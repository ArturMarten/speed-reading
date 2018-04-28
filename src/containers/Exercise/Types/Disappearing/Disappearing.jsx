import React, { Component } from 'react';
import { connect } from 'react-redux';

import { writeText } from '../../../../../src/utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const drawState = (currentState, context) => {
  const { clearRect } = currentState;
  context.clearRect(clearRect.x, clearRect.y, clearRect.width, clearRect.height);
};

export const updateState = (currentState, textMetadata) => {
  const { canvasHeight } = currentState;
  const { wordsMetadata, linesMetadata } = textMetadata;

  // Calculate next state
  let newLine = false;
  let newPage = false;
  let finished = false;
  let { wordIndex: nextWordIndex, lineCharacterIndex: nextLineCharacterIndex, marginTop: nextMarginTop } = currentState;
  nextLineCharacterIndex += 1;
  let nextWordMetadata = wordsMetadata[nextWordIndex];
  let { lineNumber } = nextWordMetadata;
  let nextLine = linesMetadata[lineNumber];
  let nextCharacterWidth = nextLine.averageCharacterWidth;
  let nextLinePosition = nextLine.rect.left + (nextLineCharacterIndex * nextCharacterWidth);
  const wordEndPosition = nextWordMetadata.rect.right;
  const currentLineCharacterCount = linesMetadata[lineNumber].characterCount;
  if (Math.ceil(nextLinePosition) >= wordEndPosition) {
    // New word
    nextWordIndex += 1;
    nextWordMetadata = wordsMetadata[nextWordIndex];
  }
  if (nextLineCharacterIndex >= currentLineCharacterCount) {
    // New line
    nextLineCharacterIndex = 0;
    newLine = true;
    lineNumber += 1;
    nextLine = linesMetadata[lineNumber];
    nextCharacterWidth = nextLine.averageCharacterWidth;
    nextLinePosition = nextLine.rect.left + (nextLineCharacterIndex * nextCharacterWidth);
    if (nextLine.rect.bottom - nextMarginTop > canvasHeight) {
      // New page
      newPage = true;
      nextMarginTop = nextLine.rect.top;
    }
  }

  const clearRect = {
    x: Math.ceil(nextLinePosition),
    y: nextWordMetadata.rect.top - nextMarginTop,
    width: Math.ceil(nextCharacterWidth),
    height: nextWordMetadata.rect.bottom - nextWordMetadata.rect.top,
  };

  if (nextWordIndex === textMetadata.wordsMetadata.length - 1 && nextLineCharacterIndex === currentLineCharacterCount - 1) {
    finished = true;
  }

  return updateObject(currentState, {
    wordIndex: nextWordIndex,
    lineCharacterIndex: nextLineCharacterIndex,
    marginTop: nextMarginTop,
    clearRect,
    newLine,
    newPage,
    finished,
  });
};

let timeout = null;
let frame = null;

const initialState = {
  wordIndex: 0,
  lineCharacterIndex: -1,
  marginTop: 0,
};

export class Disappearing extends Component {
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
      this.calculateUpdateInterval();
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
    // Create and prepare off-screen canvas
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.offscreenContext.font = `${Math.ceil(this.props.textOptions.fontSize / 0.75)}px ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    // Prerender off-screen canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    console.log(this.textMetadata);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
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
    // Calculate update interval
    this.calculateUpdateInterval();
  }

  calculateUpdateInterval() {
    const timeInSeconds = (this.textMetadata.wordsMetadata.length / this.props.speedOptions.wpm) * 60;
    this.updateInterval = (timeInSeconds / this.props.selectedText.characterCount) * 1000;
  }

  loop() {
    // console.log('Current state: ', this.currentState);
    const newState = updateState(this.currentState, this.textMetadata);
    // console.log('New state: ', newState);
    this.currentState = newState;
    if (newState.newPage) {
      // Draw new page
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      const copyHeight = Math.max(...this.textMetadata.linesMetadata
        .map(lineMetadata => lineMetadata.rect.bottom - newState.marginTop)
        .filter(lineBottom => lineBottom < this.shownCanvas.height));
      this.shownContext.drawImage(
        this.offscreenCanvas,
        0, newState.marginTop, this.shownCanvas.width, copyHeight,
        0, 0, this.shownCanvas.width, copyHeight,
      );
    }
    if (newState.finished) {
      drawState(newState, this.shownContext);
      this.props.onExerciseFinish();
    } else if (newState.newPage) {
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.drawAndScheduleNext()); },
        this.updateInterval + this.props.exerciseOptions.pageBreakDelay,
      );
    } else if (newState.newLine) {
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.drawAndScheduleNext()); },
        this.updateInterval + this.props.exerciseOptions.lineBreakDelay,
      );
    } else {
      this.drawAndScheduleNext();
    }
  }

  drawAndScheduleNext() {
    drawState(this.currentState, this.shownContext);
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
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  speedOptions: state.options.speedOptions,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Disappearing);
