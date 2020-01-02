import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createOffscreenContext, writeText, drawPage, pixelRatio } from '../../../../utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const drawState = (currentState, context) => {
  const { clearRects } = currentState;
  clearRects.forEach((clearRect) => {
    if (clearRect && clearRect.width > 0 && clearRect.height > 0) {
      context.clearRect(clearRect.x, clearRect.y, clearRect.width, clearRect.height);
    }
  });
};

export const updateStateFunction = (textMetadata, options, state) => {
  const { wordsMetadata, linesMetadata } = textMetadata;
  const { wordsPerMinute } = options;
  let speed = 0;

  if (!state.speed) {
    // Initial speed
    const totalTime = Math.round((wordsMetadata.length / options.wordsPerMinute) * 60 * 1000);
    const totalWidth = linesMetadata.reduce((acc, el) => acc + el.lineWidth, 0);
    // console.log(`Total width ${totalWidth}px in ${totalTime}ms`);
    speed = totalWidth / totalTime;
  } else {
    // Speed changed
    const change = wordsPerMinute / state.wordsPerMinute;
    speed = state.speed * change;
  }
  // console.log(`Speed ${speed} px/ms`);

  const nextState = updateObject(state, {
    speed,
    wordsPerMinute,
  });

  return [
    nextState,
    (currentState, updateTime) => {
      const { canvasHeight } = currentState;
      let { lineIndex, linePosition, marginTop } = currentState;
      let newLine = false;
      let newPage = false;
      let finished = false;
      const clearRects = [];

      const widthProgress = currentState.speed * updateTime;
      // console.log(`Width progress ${widthProgress} px`);

      linePosition += widthProgress;

      let lineMetadata = linesMetadata[lineIndex];

      if (linePosition >= lineMetadata.lineWidth) {
        if (lineIndex !== linesMetadata.length - 1) {
          // New line
          clearRects.push({
            x: 0,
            y: lineMetadata.rect.top - marginTop,
            width: lineMetadata.lineWidth,
            height: lineMetadata.rect.bottom - lineMetadata.rect.top,
          });
          newLine = true;
          linePosition -= lineMetadata.lineWidth;
          lineIndex += 1;
          lineMetadata = linesMetadata[lineIndex];
          if (lineMetadata.rect.bottom - marginTop > canvasHeight) {
            // New page
            newPage = true;
            marginTop = lineMetadata.rect.top;
          }
        } else {
          finished = true;
        }
      }

      clearRects.push({
        x: 0,
        y: lineMetadata.rect.top - marginTop,
        width: Math.ceil(linePosition),
        height: lineMetadata.rect.bottom - lineMetadata.rect.top,
      });

      return updateObject(currentState, {
        marginTop,
        lineIndex,
        linePosition,
        clearRects,
        newLine,
        newPage,
        finished,
        lastUpdate: performance.now(),
      });
    },
  ];
};

let timeout = null;
let animationFrame = null;

const initialState = {
  lineIndex: 0,
  linePosition: 0,
  marginTop: 0,
  clearRects: [],
};

export class Disappearing extends Component {
  currentState = { ...initialState };

  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps) {
    if (
      (!this.props.timerState.started && nextProps.timerState.started) ||
      (this.props.timerState.paused && !nextProps.timerState.paused)
    ) {
      // Exercise started
      this.currentState = this.updateState(this.currentState, 0);
      this.delayedLoop(this.props.exerciseOptions.startDelay);
    } else if (!this.props.timerState.resetted && nextProps.timerState.resetted) {
      // Exercise resetted
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
      this.currentState = { ...initialState };
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    } else if (!this.props.timerState.stopped && nextProps.timerState.stopped) {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    } else if (!this.props.timerState.paused && nextProps.timerState.paused) {
      // Exercise paused
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    } else {
      // Speed options changed
      const [nextState, updateState] = updateStateFunction(
        this.textMetadata,
        nextProps.speedOptions,
        this.currentState,
      );
      this.currentState = nextState;
      this.updateState = updateState;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(timeout);
    cancelAnimationFrame(animationFrame);
  }

  init() {
    this.currentState.canvasHeight = this.props.canvasHeight * pixelRatio;
    // Create and prepare off-screen canvas
    this.offscreenContext = createOffscreenContext(this.shownCanvas, this.props.textOptions);
    this.offscreenCanvas = this.offscreenContext.canvas;
    // Prerender off-screen canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    // Draw text
    if (this.offscreenCanvas.height > this.shownCanvas.height) {
      // Multi page
      drawPage(this.textMetadata.linesMetadata, this.shownContext, this.offscreenCanvas);
    } else {
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    }
    const [nextState, updateState] = updateStateFunction(this.textMetadata, this.props.speedOptions, this.currentState);
    this.currentState = nextState;
    this.updateState = updateState;
  }

  loop() {
    const updateTime = performance.now() - this.currentState.lastUpdate;
    this.currentState = this.updateState(this.currentState, updateTime);
    if (this.currentState.newPage) {
      drawPage(this.textMetadata.linesMetadata, this.shownContext, this.offscreenCanvas, this.currentState.marginTop);
    }
    if (this.currentState.finished) {
      drawState(this.currentState, this.shownContext);
      this.props.onExerciseFinish();
    } else if (this.currentState.newPage) {
      this.delayedLoop(this.props.exerciseOptions.pageBreakDelay);
    } else if (this.currentState.newLine) {
      this.delayedLoop(this.props.exerciseOptions.lineBreakDelay);
    } else {
      drawState(this.currentState, this.shownContext);
      animationFrame = requestAnimationFrame(() => this.loop());
    }
  }

  delayedLoop(delay) {
    timeout = setTimeout(() => {
      drawState(this.currentState, this.shownContext);
      this.currentState = updateObject(this.currentState, {
        lastUpdate: performance.now(),
      });
      animationFrame = requestAnimationFrame(() => this.loop());
    }, delay);
  }

  render() {
    return (
      <canvas
        ref={(ref) => {
          this.shownCanvas = ref;
        }}
        width={this.props.textOptions.width}
        height={this.props.canvasHeight}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  speedOptions: state.options.speedOptions,
});

export default connect(
  mapStateToProps,
  null,
)(Disappearing);
