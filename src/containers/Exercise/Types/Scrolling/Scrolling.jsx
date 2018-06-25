import React, { Component } from 'react';
import { connect } from 'react-redux';

import { writeText } from '../../../../utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const drawState = (currentState, context, restoreCanvas) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.drawImage(
    restoreCanvas,
    0, currentState.marginTop, context.canvas.width, context.canvas.height,
    0, 0, context.canvas.width, context.canvas.height,
  );
};

export const updateState = (currentState, textMetadata) => {
  const { linesMetadata } = textMetadata;

  // Calculate next state
  let finished = false;
  let { marginTop: nextMarginTop } = currentState;
  nextMarginTop += currentState.scrollStep;

  if (nextMarginTop >= linesMetadata[linesMetadata.length - 1].rect.bottom) {
    finished = true;
  }

  return updateObject(currentState, {
    marginTop: nextMarginTop,
    finished,
  });
};

let timeout = null;
let frame = null;

const initialState = {};

export class Scrolling extends Component {
  currentState = { ...initialState };

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
    } else if (!this.props.timerState.stopped && nextProps.timerState.stopped) {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    } else if (!this.props.timerState.paused && nextProps.timerState.paused) {
      // Exercise paused
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    } else {
      // Speed options changed
      this.calculateUpdateInterval(nextProps.speedOptions.wpm);
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(timeout);
    cancelAnimationFrame(frame);
  }

  init() {
    const fontSizeInPixels = Math.ceil(this.props.textOptions.fontSize / 0.75);
    this.shownCanvas.height = fontSizeInPixels * this.props.textOptions.lineCount;
    this.currentState.marginTop = -this.shownCanvas.height;
    // Create and prepare off-screen canvas
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.shownCanvas.width;
    this.offscreenCanvas.height = this.shownCanvas.height;
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
    this.offscreenContext.font = `${fontSizeInPixels}px ${this.props.textOptions.font}`;
    this.offscreenContext.textBaseline = 'bottom';
    this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    // Prerender off-screen canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    // Calculate update interval
    this.calculateUpdateInterval(this.props.speedOptions.wpm);
  }

  calculateUpdateInterval(newWPM) {
    const { wordsMetadata } = this.textMetadata;
    const timeInSeconds = (wordsMetadata.length / newWPM) * 60;
    const pixelHeight = (wordsMetadata[wordsMetadata.length - 1].rect.bottom - wordsMetadata[0].rect.top) + this.shownCanvas.height;
    const scrollStep = 1;
    this.currentState.scrollStep = scrollStep;
    this.updateInterval = 1000 / ((pixelHeight / scrollStep) / timeInSeconds);
    // console.log('Time in seconds', timeInSeconds, ', pixel height', pixelHeight);
    // console.log('Update interval in fps', this.updateInterval);
  }

  loop() {
    // console.log('Current state: ', this.currentState);
    const newState = updateState(this.currentState, this.textMetadata);
    // console.log('New state: ', newState);
    this.currentState = newState;
    drawState(newState, this.shownContext, this.offscreenCanvas);
    if (newState.finished) {
      timeout = setTimeout(
        () => { this.props.onExerciseFinish(); },
        this.updateInterval,
      );
    } else {
      timeout = setTimeout(
        () => { frame = requestAnimationFrame(() => this.loop()); },
        this.updateInterval,
      );
    }
  }

  render() {
    return (
      <canvas
        ref={(ref) => { this.shownCanvas = ref; }}
        width={this.props.textOptions.width}
        height={400}
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

export default connect(mapStateToProps, mapDispatchToProps)(Scrolling);
