import React, { Component } from 'react';
import { connect } from 'react-redux';

import { writeText, getLineMetadata, WordMetadata, LineMetadata } from '../../../../src/utils/CanvasUtils/CanvasUtils';

let update = null;
const initialState = {
  word: 0,
  lineCharacter: -1,
  linePosition: 0,
  currentRect: [0, 0, 0, 0],
};

export class Disappearing extends Component {
  componentDidMount() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.shownContext = this.shownCanvas.getContext('2d');
    this.init();
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.timerState.started && this.props.timerState.started) ||
        (prevProps.timerState.paused && !this.props.timerState.paused)) {
      // Exercise started
      update = setTimeout(() => this.update(), this.updateInterval + this.props.exerciseOptions.startDelay);
    } else if (!prevProps.timerState.resetted && this.props.timerState.resetted) {
      // Exercise resetted
      clearTimeout(update);
      this.cursorState = { ...initialState };
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    } else if (!prevProps.timerState.stopped && this.props.timerState.stopped) {
      clearTimeout(update);
    } else if (!prevProps.timerState.paused && this.props.timerState.paused) {
      // Exercise paused
      clearTimeout(update);
    } else {
      // Text/exercise options or text changed
      // this.init();
      // this.draw();
      const characters = this.textMetadata.wordMetadata
        .map(wordMetadata => wordMetadata[0].length)
        .reduce((prev, curr) => prev + curr);
      const timeInSeconds = (this.textMetadata.wordMetadata.length / this.props.speedOptions.wpm) * 60;
      this.updateInterval = (timeInSeconds / characters) * 1000;
    }
  }

  componentWillUnmount() {
    clearTimeout(update);
  }

  cursorState = { ...initialState };

  init() {
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext.font = `${this.props.textOptions.fontSize}pt ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.shownContext.fillStyle = 'rgba(0, 255, 0, 0.9)';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.text);
    const characters = this.textMetadata.wordMetadata
      .map(wordMetadata => wordMetadata[0].length)
      .reduce((prev, curr) => prev + curr);
    this.lineMetadata = getLineMetadata(this.textMetadata);
    const timeInSeconds = (this.textMetadata.wordMetadata.length / this.props.speedOptions.wpm) * 60;
    this.updateInterval = (timeInSeconds / characters) * 1000;
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
  }

  update() {
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
      update = setTimeout(
        () => this.update(),
        this.cursorState.newLine ? this.updateInterval + this.props.exerciseOptions.lineBreakDelay : this.updateInterval,
      );
      requestAnimationFrame(() => this.draw());
    }
  }

  draw() {
    // Draw new state
    this.shownContext.clearRect(...this.cursorState.currentRect);
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
