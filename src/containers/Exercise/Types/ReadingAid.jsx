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
    // Create and prepare off-screen canvas
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext.font = `${Math.ceil(this.props.textOptions.fontSize / 0.75)}px ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    // Prerender off-screen-canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    this.lineMetadata = getLineMetadata(this.textMetadata);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    this.shownContext.fillStyle = 'rgba(0, 255, 0, 0.9)';
    // Initial draw
    const currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
    const lineNumber = this.textMetadata.lines.indexOf(currentWordMetadata[WordMetadata.y1]);
    this.cursorState.currentRect = [
      this.cursorState.linePosition,
      currentWordMetadata[WordMetadata.y2],
      this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth],
      currentWordMetadata[WordMetadata.y1] - currentWordMetadata[WordMetadata.y2],
    ];
    this.shownContext.fillRect(...this.cursorState.currentRect);
    this.shownContext.drawImage(this.offscreenCanvas, ...this.cursorState.currentRect, ...this.cursorState.currentRect);
    // Calculate update interval
    const timeInSeconds = (this.textMetadata.wordMetadata.length / this.props.speedOptions.wpm) * 60;
    this.updateInterval = (timeInSeconds / this.props.selectedText.characterCount) * 1000;
  }

  update() {
    // Create previous rect
    this.cursorState.previousRect = [
      Math.max(this.cursorState.currentRect[0] - 2, 0),
      this.cursorState.currentRect[1],
      this.cursorState.currentRect[2] + 2,
      this.cursorState.currentRect[3],
    ];
    // Get current position
    let currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
    let lineNumber = this.textMetadata.lines.indexOf(currentWordMetadata[WordMetadata.y1]);
    // Calculate next position
    this.cursorState.lineCharacter += 1;
    this.cursorState.newLine = false;
    if (this.cursorState.linePosition >= this.textMetadata.wordMetadata[this.cursorState.word][WordMetadata.x2]) {
      // New word
      this.cursorState.word += 1;
      currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
    } else if (this.cursorState.lineCharacter >= this.lineMetadata[lineNumber][LineMetadata.CharacterCount]) {
      // New line
      this.cursorState.lineCharacter = 0;
      this.cursorState.word += 1;
      currentWordMetadata = this.textMetadata.wordMetadata[this.cursorState.word];
      this.cursorState.newLine = true;
      lineNumber += 1;
    }
    if (this.cursorState.word === this.textMetadata.wordMetadata.length) {
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
      draw(this.shownContext, this.offscreenCanvas, this.cursorState.previousRect, this.cursorState.currentRect);
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
