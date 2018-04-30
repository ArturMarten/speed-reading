import React, { Component } from 'react';
import { connect } from 'react-redux';

import { writeText } from '../../../../../src/utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const drawState = (currentState, context, restoreCanvas) => {
  const { restoreRects, drawRects } = currentState;
  if (restoreRects !== null) {
    restoreRects.forEach((restoreRect) => {
      context.clearRect(restoreRect.x, restoreRect.y, restoreRect.width, restoreRect.height);
      if (currentState.modification === 'group-highlighted' ||
          currentState.modification === 'group-spacing' ||
          currentState.modification === 'group-vertical'
      ) {
        context.drawImage(
          restoreCanvas,
          restoreRect.x, restoreRect.y + currentState.marginTop, restoreRect.width, restoreRect.height,
          restoreRect.x, restoreRect.y, restoreRect.width, restoreRect.height,
        );
      }
    });
  }
  drawRects.forEach((drawRect) => {
    if (currentState.modification === 'group-single') {
      context.drawImage(
        restoreCanvas,
        drawRect.x, drawRect.y + currentState.marginTop, drawRect.width, drawRect.height,
        drawRect.x, drawRect.y, drawRect.width, drawRect.height,
      );
    } else {
      const height = drawRect.height * 0.1;
      context.fillRect(drawRect.x, drawRect.y + (drawRect.height - height), drawRect.width, height);
    }
  });
};

export const updateState = (currentState, textMetadata, wordGroups) => {
  const { canvasHeight } = currentState;
  const { wordsMetadata } = textMetadata;

  // Calculate current state
  const currentWordMetadata = wordsMetadata[Math.max(currentState.wordIndex, 0)];

  // Calculate next state
  let newLine = false;
  let newPage = false;
  let finished = false;
  let { wordIndex: nextWordIndex, groupIndex: nextGroupIndex, marginTop: nextMarginTop } = currentState;
  nextGroupIndex += 1;
  nextWordIndex += 1;
  const nextWordGroup = wordGroups[nextGroupIndex].slice(1);
  let nextWordMetadata = wordsMetadata[nextWordIndex];
  let groupLeft = nextWordMetadata.rect.left;
  let groupRight = nextWordMetadata.rect.right;
  let groupBottom = nextWordMetadata.rect.bottom;
  let groupTop = nextWordMetadata.rect.top;
  const drawRects = [];
  nextWordGroup.forEach(() => {
    nextWordIndex += 1;
    nextWordMetadata = wordsMetadata[nextWordIndex];
    if (groupBottom - nextMarginTop > canvasHeight) {
      // New page
      newPage = true;
      nextMarginTop = groupTop;
    }
    if (groupRight > nextWordMetadata.rect.left) {
      const drawRect = {
        x: groupLeft,
        y: groupTop - nextMarginTop,
        width: groupRight - groupLeft,
        height: groupBottom - groupTop,
      };
      drawRects.push(drawRect);
      groupLeft = nextWordMetadata.rect.left;
      newLine = true;
    }
    groupRight = nextWordMetadata.rect.right;
    groupBottom = nextWordMetadata.rect.bottom;
    groupTop = nextWordMetadata.rect.top;
  });

  if (currentWordMetadata.lineNumber !== nextWordMetadata.lineNumber) {
    newLine = true;
  }

  const drawRect = {
    x: groupLeft,
    y: groupTop - nextMarginTop,
    width: groupRight - groupLeft,
    height: groupBottom - groupTop,
  };
  drawRects.push(drawRect);

  if (nextGroupIndex === wordGroups.length - 1) {
    finished = true;
  }

  return updateObject(currentState, {
    wordIndex: nextWordIndex,
    groupIndex: nextGroupIndex,
    marginTop: nextMarginTop,
    drawRects,
    newLine,
    newPage,
    finished,
  });
};

let timeout = null;
let frame = null;

const initialState = {
  wordIndex: -1,
  groupIndex: -1,
  marginTop: 0,
};

export class WordGroups extends Component {
  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps) {
    if ((!this.props.timerState.started && nextProps.timerState.started) ||
        (this.props.timerState.paused && !nextProps.timerState.paused)) {
      // Exercise started
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.loop()); },
        this.updateInterval + this.props.exerciseOptions.startDelay,
      );
    } else if (!this.props.timerState.resetted && nextProps.timerState.resetted) {
      // Exercise resetted
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      this.currentState = { ...initialState };
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    } else if (!this.props.timerState.stopped && nextProps.timerState.stopped) {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    } else if (!this.props.timerState.paused && nextProps.timerState.paused) {
      // Exercise paused
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    } else {
      // Speed options changed
      this.updateInterval = nextProps.speedOptions.fixation;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(timeout);
    cancelAnimationFrame(frame);
  }

  currentState = { ...initialState };

  init() {
    this.currentState.canvasHeight = this.props.canvasHeight;
    this.currentState.modification = this.props.modification;
    // Create and prepare off-screen canvas
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.offscreenContext.font = `${Math.ceil(this.props.textOptions.fontSize / 0.75)}px ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    // Prerender off-screen-canvas
    if (this.currentState.modification === 'group-spacing') {
      this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    } else {
      this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    }
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    if (this.currentState.modification === 'group-highlighted' ||
        this.currentState.modification === 'group-spacing' ||
        this.currentState.modification === 'group-vertical'
    ) {
      // Draw text
      if (this.offscreenCanvas.height > this.shownCanvas.height) {
        // Multi page
        const copyHeight = Math.max(...this.textMetadata.linesMetadata
          .map(lineMetadata => lineMetadata.rect.bottom)
          .filter(lineBottom => lineBottom < this.shownCanvas.height));
        this.shownContext.drawImage(
          this.offscreenCanvas,
          0, 0, this.shownCanvas.width, copyHeight,
          0, 0, this.shownCanvas.width, copyHeight,
        );
      } else {
        this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
      }
    }
    // Calculate update interval
    this.updateInterval = this.props.speedOptions.fixation;
    // Initial draw
    this.currentState.restoreRects = null;
    const newState = updateState(this.currentState, this.textMetadata, this.props.wordGroups);
    this.currentState = newState;
    drawState(newState, this.shownContext, this.offscreenCanvas);
  }

  loop() {
    this.currentState.restoreRects = this.currentState.drawRects ? this.currentState.drawRects.slice() : null;
    // console.log('Current state: ', this.currentState);
    const newState = updateState(this.currentState, this.textMetadata, this.props.wordGroups);
    // console.log('New state: ', newState);
    this.currentState = newState;
    if (newState.newPage) {
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      if (this.currentState.modification === 'group-highlighted' ||
          this.currentState.modification === 'group-spacing' ||
          this.currentState.modification === 'group-vertical'
      ) {
        const copyHeight = Math.max(...this.textMetadata.linesMetadata
          .map(lineMetadata => lineMetadata.rect.bottom - newState.marginTop)
          .filter(lineBottom => lineBottom < this.shownCanvas.height));
        this.shownContext.drawImage(
          this.offscreenCanvas,
          0, newState.marginTop, this.shownCanvas.width, copyHeight,
          0, 0, this.shownCanvas.width, copyHeight,
        );
      }
    }
    drawState(newState, this.shownContext, this.offscreenCanvas);
    if (newState.finished) {
      timeout = setTimeout(
        () => { this.props.onExerciseFinish(); },
        this.updateInterval,
      );
    } else if (newState.newPage) {
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.scheduleNext()); },
        this.updateInterval + this.props.exerciseOptions.pageBreakDelay,
      );
    } else if (newState.newLine) {
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.scheduleNext()); },
        this.updateInterval + this.props.exerciseOptions.lineBreakDelay,
      );
    } else {
      this.scheduleNext();
    }
  }

  scheduleNext() {
    timeout = setTimeout(
      () => { frame = requestAnimationFrame(() => this.loop()); },
      this.updateInterval,
    );
  }

  render() {
    return (
      <canvas
        ref={(ref) => { this.shownCanvas = ref; }}
        width={this.props.textOptions.width}
        height={this.props.canvasHeight}
      />
    );
  }
}

const mapStateToProps = state => ({
  modification: state.exercise.modification,
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  speedOptions: state.options.speedOptions,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(WordGroups);
