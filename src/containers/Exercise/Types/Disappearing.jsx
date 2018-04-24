import React, { Component } from 'react';
import { connect } from 'react-redux';

import { writeText, getLineMetadata, WordMetadata, LineMetadata } from '../../../../src/utils/CanvasUtils/CanvasUtils';

import { updateObject } from '../../../shared/utility';

let timeout = null;
let frame = null;

const initialState = {
  wordIndex: 0,
  lineCharacter: 0,
  linePosition: 0,
  currentRect: [0, 0, 0, 0],
};

export const draw = (context, currentRect) => {
  // Draw new state
  context.clearRect(...currentRect);
};

export const drawState = (currentState, context) => {
  // Draw new state
  context.clearRect(...currentState.rect);
};

/*
  currentState = {
    wordIndex: 0,
    linePosition: 0,
    lineCharacterIndex: 0,
    rect: [0, 0, 0, 0],
  }
*/

// Functional style
export const updateState = (currentState, textMetadata, lineMetadata) => {
  let { wordIndex: currentWordIndex, linePosition: currentLinePosition, lineCharacterIndex: currentLineCharacterIndex } = currentState;
  const { wordMetadata } = textMetadata;
  let currentWordMetadata = wordMetadata[currentWordIndex];
  let lineNumber = textMetadata.lines.indexOf(currentWordMetadata[WordMetadata.y1]);
  let newLine = false;
  const wordEndPosition = currentWordMetadata[WordMetadata.x2];
  const lineEndCharacterIndex = lineMetadata[lineNumber][LineMetadata.CharacterCount];
  if (currentLinePosition > wordEndPosition) {
    // New word
    currentWordIndex += 1;
    currentWordMetadata = wordMetadata[currentWordIndex];
  } else if (currentLineCharacterIndex >= lineEndCharacterIndex) {
    // New line
    currentWordIndex += 1;
    currentWordMetadata = wordMetadata[currentWordIndex];
    currentLineCharacterIndex = 0;
    newLine = true;
    lineNumber += 1;
  }
  const currentLine = lineMetadata[lineNumber];
  const characterWidth = currentLine[LineMetadata.AverageCharacterWidth];
  currentLinePosition = currentLine[LineMetadata.x1] + (currentLineCharacterIndex * characterWidth);
  const rect = [currentLinePosition, currentWordMetadata[WordMetadata.y2], characterWidth,
    currentWordMetadata[WordMetadata.y1] - currentWordMetadata[WordMetadata.y2]];

  return updateObject(currentState, {
    wordIndex: currentWordIndex,
    linePosition: currentLinePosition,
    lineCharacterIndex: currentLineCharacterIndex,
    rect,
    newLine,
  });
};

export class Disappearing extends Component {
  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps) {
    if ((!this.props.timerState.started && nextProps.timerState.started) ||
        (this.props.timerState.paused && !nextProps.timerState.paused)) {
      // Exercise started
      timeout = setTimeout(() => this.update(), this.updateInterval + this.props.exerciseOptions.startDelay);
    } else if (!this.props.timerState.resetted && nextProps.timerState.resetted) {
      // Exercise resetted
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      this.cursorState = { ...initialState };
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
      // Text/exercise options or text changed
      const timeInSeconds = (this.textMetadata.wordMetadata.length / nextProps.speedOptions.wpm) * 60;
      this.updateInterval = (timeInSeconds / nextProps.selectedText.characterCount) * 1000;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(timeout);
    cancelAnimationFrame(frame);
  }

  cursorState = { ...initialState };
  currentState = {
    wordIndex: 0,
    linePosition: 0,
    lineCharacterIndex: 0,
    rect: [0, 0, 0, 0],
    newLine: false,
  };

  init() {
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
    this.lineMetadata = getLineMetadata(this.textMetadata);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    // Calculate update interval
    const timeInSeconds = (this.textMetadata.wordMetadata.length / this.props.speedOptions.wpm) * 60;
    this.updateInterval = (timeInSeconds / this.props.selectedText.characterCount) * 1000;
    this.loop();
  }

  loop() {
    const newState = updateState(this.currentState, this.textMetadata, this.lineMetadata);
    drawState(newState, this.shownContext);
    this.currentState = newState;
  }

  update() {
    // Get current position
    let currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.wordIndex];
    let lineNumber = this.textMetadata.lines.indexOf(currentWordMetadata[WordMetadata.y1]);
    // Calculate next position
    this.cursorState.newLine = false;
    if (this.cursorState.linePosition > this.textMetadata.wordMetadata[this.cursorState.wordIndex][WordMetadata.x2]) {
      // New word
      this.cursorState.wordIndex += 1;
      currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.wordIndex];
    } else if (this.cursorState.lineCharacter >= this.lineMetadata[lineNumber][LineMetadata.CharacterCount]) {
      // New line
      this.cursorState.lineCharacter = 0;
      this.cursorState.wordIndex += 1;
      currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.wordIndex];
      this.cursorState.newLine = true;
      lineNumber += 1;
    }
    if (this.cursorState.wordIndex === this.textMetadata.wordMetadata.length) {
      this.props.onExerciseFinish();
    } else {
      this.cursorState.linePosition = this.lineMetadata[lineNumber][LineMetadata.x1] +
        (this.cursorState.lineCharacter * this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth]);

      this.cursorState.currentRect = [
        this.cursorState.linePosition,
        currentWordMetadata[WordMetadata.y2],
        this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth],
        currentWordMetadata[WordMetadata.y1] - currentWordMetadata[WordMetadata.y2],
      ];
      const nextUpdate = this.cursorState.newLine ? this.updateInterval + this.props.exerciseOptions.lineBreakDelay : this.updateInterval;
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.update()); },
        nextUpdate,
      );
      draw(this.shownContext, this.cursorState.currentRect);
      this.cursorState.lineCharacter += 1;
    }
  }

  render() {
    return (
      <canvas
        ref={(ref) => { this.shownCanvas = ref; }}
        width={this.props.textOptions.width}
        height={1000}
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
