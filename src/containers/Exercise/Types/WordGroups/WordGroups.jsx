import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  createOffscreenContext,
  writeText,
  getGroupsMetadata,
  pixelRatio,
} from '../../../../utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const drawState = (currentState, context, restoreCanvas) => {
  const { restoreRects, drawRects } = currentState;
  if (restoreRects !== null) {
    restoreRects.forEach((restoreRect) => {
      context.clearRect(restoreRect.x, restoreRect.y, restoreRect.width, restoreRect.height);
      if (
        currentState.modification === 'group-highlighted' ||
        currentState.modification === 'group-spacing' ||
        currentState.modification === 'group-vertical'
      ) {
        context.drawImage(
          restoreCanvas,
          restoreRect.x,
          restoreRect.y + currentState.marginTop,
          restoreRect.width,
          restoreRect.height,
          restoreRect.x,
          restoreRect.y,
          restoreRect.width,
          restoreRect.height,
        );
      }
    });
  }
  drawRects.forEach((drawRect) => {
    if (currentState.modification === 'group-single') {
      context.drawImage(
        restoreCanvas,
        drawRect.x,
        drawRect.y + currentState.marginTop,
        drawRect.width,
        drawRect.height,
        drawRect.x,
        drawRect.y,
        drawRect.width,
        drawRect.height,
      );
    } else {
      const height = drawRect.height * 0.1;
      context.fillRect(drawRect.x, drawRect.y + (drawRect.height - height), drawRect.width, height);
    }
  });
};

export const updateState = (currentState, textMetadata) => {
  const { canvasHeight } = currentState;
  const { groupsMetadata } = textMetadata;

  // Calculate current state
  const currentGroupMetadata = groupsMetadata[Math.max(currentState.groupIndex, 0)];

  // Calculate next state
  let newLine = false;
  let newPage = false;
  let finished = false;
  let { groupIndex: nextGroupIndex, marginTop: nextMarginTop } = currentState;
  nextGroupIndex += 1;
  const nextGroupMetadata = groupsMetadata[nextGroupIndex];
  const drawRects = [];
  nextGroupMetadata.rects.forEach((groupRect) => {
    if (groupRect.bottom - nextMarginTop > canvasHeight) {
      // New page
      newPage = true;
      nextMarginTop = groupRect.top;
    }
    const drawRect = {
      x: groupRect.left,
      y: groupRect.top - nextMarginTop,
      width: groupRect.right - groupRect.left,
      height: groupRect.bottom - groupRect.top,
    };
    drawRects.push(drawRect);
  });

  const currentGroupRectBottom = currentGroupMetadata.rects[currentGroupMetadata.rects.length - 1].bottom;
  const nextGroupRectBottom = nextGroupMetadata.rects[nextGroupMetadata.rects.length - 1].bottom;
  if (currentGroupRectBottom !== nextGroupRectBottom) {
    newLine = true;
  }

  if (nextGroupIndex === groupsMetadata.length - 1) {
    finished = true;
  }

  return updateObject(currentState, {
    groupIndex: nextGroupIndex,
    marginTop: nextMarginTop,
    drawRects,
    newLine,
    newPage,
    finished,
  });
};

let timeout = null;
let animationFrame = null;

const initialState = {
  groupIndex: -1,
  marginTop: 0,
};

export class WordGroups extends Component {
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
        animationFrame = requestAnimationFrame(() => this.loop());
      }, this.updateInterval + this.props.exerciseOptions.startDelay);
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
      this.updateInterval = nextProps.speedOptions.fixation;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(timeout);
    cancelAnimationFrame(animationFrame);
  }

  init() {
    this.currentState.canvasHeight = this.props.canvasHeight * pixelRatio;
    this.currentState.modification = this.props.modification;
    // Create and prepare off-screen canvas
    this.offscreenContext = createOffscreenContext(this.shownCanvas, this.props.textOptions);
    this.offscreenCanvas = this.offscreenContext.canvas;
    // Prerender off-screen-canvas
    const { wordsMetadata, linesMetadata } = writeText(this.offscreenContext, this.props.selectedText.contentState);
    const groupsMetadata = getGroupsMetadata(wordsMetadata, this.props.wordGroups);
    this.textMetadata = { wordsMetadata, linesMetadata, groupsMetadata };
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    if (
      this.currentState.modification === 'group-highlighted' ||
      this.currentState.modification === 'group-spacing' ||
      this.currentState.modification === 'group-vertical'
    ) {
      // Draw text
      if (this.offscreenCanvas.height > this.shownCanvas.height) {
        // Multi page
        const copyHeight = Math.max(
          ...this.textMetadata.linesMetadata
            .map((lineMetadata) => lineMetadata.rect.bottom)
            .filter((lineBottom) => lineBottom < this.shownCanvas.height),
        );
        this.shownContext.drawImage(
          this.offscreenCanvas,
          0,
          0,
          this.shownCanvas.width,
          copyHeight,
          0,
          0,
          this.shownCanvas.width,
          copyHeight,
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
      if (
        this.currentState.modification === 'group-highlighted' ||
        this.currentState.modification === 'group-spacing' ||
        this.currentState.modification === 'group-vertical'
      ) {
        const copyHeight = Math.max(
          ...this.textMetadata.linesMetadata
            .map((lineMetadata) => lineMetadata.rect.bottom - newState.marginTop)
            .filter((lineBottom) => lineBottom < this.shownCanvas.height),
        );
        this.shownContext.drawImage(
          this.offscreenCanvas,
          0,
          newState.marginTop,
          this.shownCanvas.width,
          copyHeight,
          0,
          0,
          this.shownCanvas.width,
          copyHeight,
        );
      }
    }
    drawState(newState, this.shownContext, this.offscreenCanvas);
    if (newState.finished) {
      timeout = setTimeout(() => {
        this.props.onExerciseFinish();
      }, this.updateInterval);
    } else if (newState.newPage) {
      timeout = setTimeout(() => {
        animationFrame = requestAnimationFrame(() => this.scheduleNext());
      }, this.props.exerciseOptions.pageBreakDelay);
    } else if (newState.newLine) {
      timeout = setTimeout(() => {
        animationFrame = requestAnimationFrame(() => this.scheduleNext());
      }, this.props.exerciseOptions.lineBreakDelay);
    } else {
      this.scheduleNext();
    }
  }

  scheduleNext() {
    timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(() => this.loop());
    }, this.updateInterval);
  }

  render() {
    return (
      <canvas
        ref={(ref) => {
          this.shownCanvas = ref;
        }}
        width={this.props.textOptions.width}
        height={this.props.canvasHeight}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  modification: state.exercise.modification,
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  speedOptions: state.options.speedOptions,
});

export default connect(
  mapStateToProps,
  null,
)(WordGroups);
