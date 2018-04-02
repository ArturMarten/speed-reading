import React, { Component } from 'react';
import { connect } from 'react-redux';

import { writeText, getLineMetadata, WordMetadata, LineMetadata } from '../../../../src/utils/CanvasUtils/CanvasUtils';

let timeout = null;
let frame = null;

const initialState = {
  word: 0,
  lineCharacter: 0,
  linePosition: 0,
  currentRect: [0, 0, 0, 0],
  previousRect: [0, 0, 0, 0],
};

const draw = (context, copyCanvas, previousRect, currentRect) => {
  // Clear previous state
  context.clearRect(...previousRect);
  context.drawImage(copyCanvas, ...previousRect, ...previousRect);
  // Draw new state
  context.fillRect(...currentRect);
  context.drawImage(copyCanvas, ...currentRect, ...currentRect);
};

export class ReadingAid extends Component {
  componentDidMount() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.shownContext = this.shownCanvas.getContext('2d');
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

  init() {
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext.font = `${this.props.textOptions.fontSize}pt ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.text);
    this.lineMetadata = getLineMetadata(this.textMetadata);
    const timeInSeconds = (this.textMetadata.wordMetadata.length / this.props.speedOptions.wpm) * 60;
    this.updateInterval = (timeInSeconds / this.props.selectedText.characterCount) * 1000;
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    this.shownContext.fillStyle = 'rgba(0, 255, 0, 0.9)';
  }

  update() {
    // Create previous rect
    this.previousRect = [
      this.cursorState.currentRect[0] - 1,
      this.cursorState.currentRect[1],
      this.cursorState.currentRect[2] + 2,
      this.cursorState.currentRect[3],
    ];

    // Calculate next position
    let currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
    let lineNumber = this.textMetadata.lines.indexOf(currentWordMetadata[WordMetadata.StartY]);

    this.cursorState.lineCharacter += 1;
    this.cursorState.newLine = false;
    if (this.cursorState.lineCharacter >= this.lineMetadata[lineNumber][LineMetadata.CharacterCount]) {
      // New line
      this.cursorState.lineCharacter = 0;
      this.cursorState.word += 1;
      currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
      this.cursorState.newLine = true;
      lineNumber += 1;
    } else if (this.cursorState.linePosition > this.textMetadata.wordMetadata[this.cursorState.word][WordMetadata.EndX]) {
      // New word
      this.cursorState.word += 1;
      currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
    }
    if (this.cursorState.word === this.textMetadata.wordMetadata.length) {
      this.props.onExerciseFinish();
    } else {
      this.cursorState.linePosition =
      this.lineMetadata[lineNumber][LineMetadata.StartX] +
      (this.cursorState.lineCharacter * this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth]);
      // console.error(this.cursorState.linePosition);

      this.cursorState.currentRect = [
        this.cursorState.linePosition,
        currentWordMetadata[WordMetadata.StartY] - 20,
        this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth],
        this.props.textOptions.fontSize + 2,
      ];
      const nextUpdate = this.cursorState.newLine ? this.updateInterval + this.props.exerciseOptions.lineBreakDelay : this.updateInterval;
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.update()); },
        nextUpdate,
      );
      draw(this.shownContext, this.offscreenCanvas, this.previousRect, this.cursorState.currentRect);
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

export default connect(mapStateToProps, mapDispatchToProps)(ReadingAid);
