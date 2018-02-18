import React, {Component} from 'react';
import {writeText, getLineMetadata, WordMetadata, LineMetadata} from '../../../src/utils/Canvas/Canvas';

// Move to exercise options
const START_DELAY = 300;
const LINE_BREAK_DELAY = 100;

let update = null;
const initialState = {
  word: 0,
  lineCharacter: 0,
  linePosition: 0,
  currentRect: [0, 0, 0, 0],
  previousRect: [0, 0, 0, 0]
};

class Reading extends Component {
  constructor(props) {
    super(props);
    this.cursorState = {...initialState};
  }

  componentDidMount() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.shownContext = this.shownCanvas.getContext('2d');
    this.init();
  }

  componentDidUpdate(previous) {
    if ((!previous.exerciseState.started && this.props.exerciseState.started) ||
        (previous.exerciseState.paused && !this.props.exerciseState.paused)) {
      // Exercise started
      update = setTimeout(() => this.update(), this.updateInterval + START_DELAY);
    } else if (!previous.exerciseState.resetted && this.props.exerciseState.resetted) {
      // Exercise resetted
      clearTimeout(update);
      this.cursorState = {...initialState};
      this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
      this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
    } else if (!previous.exerciseState.finished && this.props.exerciseState.finished) {
      clearTimeout(update);
    } else if (!previous.exerciseState.paused && this.props.exerciseState.paused) {
      // Exercise paused
      clearTimeout(update);
    } else {
      // Text/exercise options or text changed
      this.init();
      // this.draw();
    }
  }

  componentWillUnmount() {
    clearTimeout(update);
  }

  init() {
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext.font = this.props.textOptions.fontSize + 'pt ' + this.props.textOptions.font;
    this.offscreenContext.textBaseline = 'bottom';
    this.shownContext.fillStyle='rgba(0, 255, 0, 0.9)';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.content);
    const characters = this.textMetadata.wordMetadata.map(
      (wordMetadata) => wordMetadata[0].length
    ).reduce((prev, curr) => prev + curr);
    this.lineMetadata = getLineMetadata(this.textMetadata);
    const timeInSeconds = (this.textMetadata.wordMetadata.length/this.props.exerciseOptions.wpm) * 60;
    this.updateInterval = (timeInSeconds/characters) * 1000;
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
  }

  update() {
    // Create previous rect
    this.previousRect = [
      this.cursorState.currentRect[0] - 1,
      this.cursorState.currentRect[1],
      this.cursorState.currentRect[2] + 2,
      this.cursorState.currentRect[3]
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
      console.error('ENDED');
      this.props.onExerciseFinish();
    } else {
      this.cursorState.linePosition =
      this.lineMetadata[lineNumber][LineMetadata.StartX] +
      this.cursorState.lineCharacter * this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth];
      // console.error(this.cursorState.linePosition);

      this.cursorState.currentRect = [
        this.cursorState.linePosition,
        currentWordMetadata[WordMetadata.StartY] - 20,
        this.lineMetadata[lineNumber][LineMetadata.AverageCharacterWidth],
        this.props.textOptions.fontSize + 2
      ];
      update = setTimeout(() => this.update(), this.cursorState.newLine ? this.updateInterval + LINE_BREAK_DELAY : this.updateInterval);
      requestAnimationFrame(() => this.draw());
    }
  }

  draw() {
    // Clear previous state
    this.shownContext.clearRect(...this.previousRect);
    this.shownContext.drawImage(this.offscreenCanvas, ...this.previousRect, ...this.previousRect);
    // Draw new state
    this.shownContext.fillRect(...this.cursorState.currentRect);
    this.shownContext.drawImage(this.offscreenCanvas, ...this.cursorState.currentRect, ...this.cursorState.currentRect);
  }

  render() {
    return (
      <canvas
        ref={(ref) => this.shownCanvas = ref}
        width={this.props.textOptions.width}
        height={1000}
      />
    );
  }
}

export default Reading;
