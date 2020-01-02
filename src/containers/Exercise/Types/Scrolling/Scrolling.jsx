import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createOffscreenContext, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const drawState = (currentState, context, restoreCanvas) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.drawImage(
    restoreCanvas,
    0,
    currentState.marginTop,
    context.canvas.width,
    context.canvas.height,
    0,
    0,
    context.canvas.width,
    context.canvas.height,
  );
};

export const updateStateFunction = (textMetadata, options, canvasHeight, state) => {
  // Calculate remaining time and height
  // console.log(`Speed ${state.speed}`);
  // console.log(`Margin top ${state.marginTop}`);
  const { wordsMetadata, linesMetadata } = textMetadata;
  const { wordsPerMinute } = options;
  let speed = 0;
  const startMargin = -canvasHeight / 2;
  const marginTop = state.marginTop ? state.marginTop : startMargin;
  if (!state.speed) {
    // Initial speed
    const totalWords = wordsMetadata.length;
    const totalTime = Math.round((totalWords / wordsPerMinute) * 60 * 1000);
    // console.log(`Total ${totalWords} words (${wordsPerMinute} WPM)`);
    const totalHeight = linesMetadata[linesMetadata.length - 1].rect.bottom - linesMetadata[0].rect.top - startMargin;
    // console.log(`Total height ${totalHeight} px in ${totalTime}ms`);

    speed = totalHeight / totalTime;
  } else {
    // Speed changed
    const change = wordsPerMinute / state.wordsPerMinute;
    speed = state.speed * change;
  }
  // console.log(`Speed ${speed} px/ms`);

  const nextState = updateObject(state, {
    speed,
    wordsPerMinute,
    marginTop,
  });
  return [
    nextState,
    (currentState, updateTime) => {
      // Calculate next state
      const marginProgress = currentState.speed * updateTime;

      const nextMarginTop = currentState.marginTop + marginProgress;

      const finished = nextMarginTop >= linesMetadata[linesMetadata.length - 1].rect.bottom;

      return updateObject(currentState, {
        marginTop: nextMarginTop,
        lastUpdate: performance.now(),
        finished,
      });
    },
  ];
};

let timeout = null;
let animationFrame = null;

const initialState = {};

export class Scrolling extends Component {
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
      timeout = setTimeout(() => {
        this.currentState = updateObject(this.currentState, {
          lastUpdate: performance.now(),
        });
        animationFrame = requestAnimationFrame(() => this.loop());
      }, this.props.exerciseOptions.startDelay);
    } else if (!this.props.timerState.resetted && nextProps.timerState.resetted) {
      // Exercise resetted
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
      this.currentState = { ...initialState };
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
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
        this.shownCanvas.height,
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
    const fontSizeInPixels = Math.ceil(this.props.textOptions.fontSize / 0.75);
    this.shownCanvas.height = fontSizeInPixels * this.props.textOptions.lineCount;
    this.currentState.marginTop = -(this.shownCanvas.height / 2);
    // Create and prepare off-screen canvas
    this.offscreenContext = createOffscreenContext(this.shownCanvas, this.props.textOptions);
    this.offscreenCanvas = this.offscreenContext.canvas;
    // Prerender off-screen canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    // Initial draw
    const [nextState, updateState] = updateStateFunction(
      this.textMetadata,
      this.props.speedOptions,
      this.shownCanvas.height,
      this.currentState,
    );
    this.currentState = nextState;
    this.updateState = updateState;
    drawState(this.currentState, this.shownContext, this.offscreenCanvas);
  }

  loop() {
    const updateTime = performance.now() - this.currentState.lastUpdate;
    const nextState = this.updateState(this.currentState, updateTime);
    drawState(nextState, this.shownContext, this.offscreenCanvas);
    this.currentState = nextState;
    if (nextState.finished) {
      this.props.onExerciseFinish();
    } else {
      animationFrame = requestAnimationFrame(() => this.loop());
    }
  }

  render() {
    return (
      <canvas
        ref={(ref) => {
          this.shownCanvas = ref;
        }}
        width={this.props.textOptions.width}
        height={400}
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
)(Scrolling);
