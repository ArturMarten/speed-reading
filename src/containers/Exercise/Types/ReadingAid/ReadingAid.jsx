import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { updateObject } from '../../../../shared/utility';
import { getColorRGBA } from '../../../../store/reducers/options';
import {
  createOffscreenContext,
  drawPage,
  drawPageLines,
  pixelRatio,
  writeText,
} from '../../../../utils/CanvasUtils/CanvasUtils';

export const pageChange = (change, currentState, textMetadata, context, offscreenCanvas) => {
  const { pageIndex } = currentState;
  const { pagesMetadata } = textMetadata;
  const newPageIndex = Math.min(Math.max(pageIndex + change, 0), pagesMetadata.length - 1);
  if (newPageIndex !== pageIndex) {
    // Page change
    const pageMetadata = pagesMetadata[newPageIndex];
    drawPage(pageMetadata, context, offscreenCanvas);
    const lineIndex = pageMetadata.lineIndices[0];
    return updateObject(currentState, {
      pageIndex: newPageIndex,
      lineIndex,
      linePosition: 0,
    });
  }
  return currentState;
};

export const drawState = (currentState, textMetadata, context, restoreCanvas) => {
  const { pageIndex, restoreRect, drawRect } = currentState;
  const { pagesMetadata } = textMetadata;
  const pageMetadata = pagesMetadata[pageIndex];
  if (restoreRect && restoreRect.width > 0 && restoreRect.height > 0) {
    context.clearRect(restoreRect.x, restoreRect.y, restoreRect.width, restoreRect.height);
    context.drawImage(
      restoreCanvas,
      restoreRect.x,
      restoreRect.y + pageMetadata.rect.top,
      restoreRect.width,
      restoreRect.height,
      restoreRect.x,
      restoreRect.y,
      restoreRect.width,
      restoreRect.height,
    );
  }

  if (currentState.cursorType === 'underline') {
    const height = drawRect.height * 0.2;
    context.fillRect(drawRect.x, drawRect.y + (drawRect.height - height), drawRect.width, height);
  } else {
    context.fillRect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);
  }
  context.drawImage(
    restoreCanvas,
    drawRect.x,
    drawRect.y + pageMetadata.rect.top,
    drawRect.width,
    drawRect.height,
    drawRect.x,
    drawRect.y,
    drawRect.width,
    drawRect.height,
  );
};

export const updateStateFunction = (textMetadata, options, state) => {
  const { wordsMetadata, linesMetadata, pagesMetadata } = textMetadata;
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
      // Calculate next state
      let { pageIndex, lineIndex, linePosition } = currentState;
      let newLine = false;
      let newPage = false;
      let finished = false;

      const widthProgress = currentState.speed * updateTime;
      // console.log(`Width progress ${widthProgress} px`);

      linePosition += widthProgress;

      let pageMetadata = pagesMetadata[pageIndex];
      let lineMetadata = linesMetadata[lineIndex];

      if (linePosition >= lineMetadata.lineWidth) {
        if (lineIndex !== linesMetadata.length - 1) {
          // New line
          newLine = true;
          lineIndex += 1;
          lineMetadata = linesMetadata[lineIndex];
          linePosition = lineMetadata.rect.left;
          if (lineMetadata.rect.bottom > pageMetadata.rect.bottom) {
            // New page
            newPage = true;
            pageIndex += 1;
            pageMetadata = pagesMetadata[pageIndex];
          }
        } else {
          finished = true;
        }
      }

      const restoreRect = { ...currentState.drawRect };
      const drawRect = getDrawRect(lineMetadata, pageMetadata, linePosition);

      return updateObject(currentState, {
        pageIndex,
        lineIndex,
        linePosition,
        restoreRect,
        drawRect,
        newLine,
        newPage,
        finished,
        lastUpdate: performance.now(),
      });
    },
  ];
};

export const getDrawRect = (lineMetadata, pageMetadata, linePosition) => {
  const MAX_WIDTH = 20;
  const maxWidth = MAX_WIDTH;
  return {
    x: Math.ceil(linePosition),
    y: lineMetadata.rect.top - pageMetadata.rect.top,
    width: Math.ceil(Math.min(maxWidth, lineMetadata.lineWidth - linePosition)),
    height: lineMetadata.rect.bottom - lineMetadata.rect.top,
  };
};

let timeout = null;
let animationFrame = null;

const initialState = {
  pageIndex: 0,
  lineIndex: 0,
  linePosition: 0,
  drawRect: { x: 0, y: 0, width: 0, height: 0 },
};

export class ReadingAid extends Component {
  currentState = { ...initialState };

  componentDidMount() {
    this.init();
    document.addEventListener('keydown', this.preventDefault);
    document.addEventListener('keyup', this.keyPressHandler);
  }

  shouldComponentUpdate(nextProps) {
    if (
      (!this.props.timerState.started && nextProps.timerState.started) ||
      (this.props.timerState.paused && !nextProps.timerState.paused)
    ) {
      // Exercise started
      this.currentState = this.updateState(this.currentState, 0);
      drawState(this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
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
    document.removeEventListener('keydown', this.preventDefault);
    document.removeEventListener('keyup', this.keyPressHandler);
  }

  init() {
    this.currentState.cursorType = this.props.exerciseOptions.cursorType;
    this.currentState.canvasHeight = this.props.canvasHeight * pixelRatio;
    // Create and prepare off-screen canvas
    this.offscreenContext = createOffscreenContext(this.shownCanvas, this.props.textOptions);
    this.offscreenCanvas = this.offscreenContext.canvas;
    // Prerender off-screen-canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    // Draw text
    if (this.offscreenCanvas.height > this.shownCanvas.height) {
      // Multi page
      drawPageLines(this.textMetadata.linesMetadata, this.shownContext, this.offscreenCanvas);
    } else {
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    }
    this.shownContext.fillStyle = getColorRGBA(this.props.exerciseOptions.cursorColor);
    const [nextState, updateState] = updateStateFunction(this.textMetadata, this.props.speedOptions, this.currentState);
    this.currentState = nextState;
    this.updateState = updateState;
  }

  preventDefault = (event) => {
    const { key } = event;
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) !== -1) {
      event.preventDefault();
    }
  };

  keyPressHandler = (event) => {
    const { key } = event;
    if (key === 'ArrowRight') {
      this.onNextPage();
    } else if (key === 'ArrowLeft') {
      this.onPreviousPage();
    }
  };

  onNextPage = () => {
    this.onPageChange(1);
  };

  onPreviousPage = () => {
    this.onPageChange(-1);
  };

  onPageChange = (change) => {
    const newState = pageChange(change, this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
    if (this.currentState.pageIndex !== newState.pageIndex) {
      const { linesMetadata, pagesMetadata } = this.textMetadata;
      const lineMetadata = linesMetadata[newState.lineIndex];
      const pageMetadata = pagesMetadata[newState.pageIndex];
      newState.drawRect = getDrawRect(lineMetadata, pageMetadata, newState.linePosition);
      drawState(newState, this.textMetadata, this.shownContext, this.offscreenCanvas);
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
      this.delayedLoop(this.props.exerciseOptions.pageBreakDelay);
    }
    this.currentState = newState;
  };

  loop() {
    const updateTime = performance.now() - this.currentState.lastUpdate;
    this.currentState = this.updateState(this.currentState, updateTime);
    if (this.currentState.newPage) {
      const { linesMetadata, pagesMetadata } = this.textMetadata;
      const marginTop = pagesMetadata[this.currentState.pageIndex].rect.top;
      drawPageLines(linesMetadata, this.shownContext, this.offscreenCanvas, marginTop);
    }
    drawState(this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
    if (this.currentState.finished) {
      this.props.onExerciseFinish();
    } else if (this.currentState.newPage) {
      this.delayedLoop(this.props.exerciseOptions.pageBreakDelay);
    } else if (this.currentState.newLine) {
      this.delayedLoop(this.props.exerciseOptions.lineBreakDelay);
    } else {
      animationFrame = requestAnimationFrame(() => this.loop());
    }
  }

  delayedLoop(delay) {
    timeout = setTimeout(() => {
      this.currentState = updateObject(this.currentState, {
        lastUpdate: performance.now(),
      });
      animationFrame = requestAnimationFrame(() => this.loop());
    }, delay);
  }

  render() {
    return (
      <>
        <canvas
          ref={(ref) => {
            this.shownCanvas = ref;
          }}
          width={this.props.canvasWidth}
          height={this.props.canvasHeight}
        />
        <Button.Group fluid basic>
          <Button onClick={this.onPreviousPage}>
            <Icon name="chevron left" />
            {this.props.translate('text-exercise.previous-page')}
          </Button>
          <Button onClick={this.onNextPage}>
            {this.props.translate('text-exercise.next-page')}
            <Icon name="chevron right" />
          </Button>
        </Button.Group>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  speedOptions: state.options.speedOptions,
});

export default connect(mapStateToProps, null)(ReadingAid);
