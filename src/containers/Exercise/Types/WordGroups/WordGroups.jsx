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
  // Calculate next state
  const { canvasHeight } = currentState;
  const { groupsMetadata } = textMetadata;
  let { groupIndex, marginTop } = currentState;
  let newLine = false;
  let newPage = false;
  let finished = false;
  const drawRects = [];

  groupIndex += 1;
  const groupMetadata = groupsMetadata[groupIndex];
  groupMetadata.rects.forEach((groupRect) => {
    if (groupRect.bottom - marginTop > canvasHeight) {
      // New page
      newPage = true;
      marginTop = groupRect.top;
    }
    const drawRect = {
      x: groupRect.left,
      y: groupRect.top - marginTop,
      width: groupRect.right - groupRect.left,
      height: groupRect.bottom - groupRect.top,
    };
    drawRects.push(drawRect);
  });

  const previousGroupMetadata = groupsMetadata[Math.max(groupIndex - 1, 0)];
  const previousGroupRectBottom = previousGroupMetadata.rects[previousGroupMetadata.rects.length - 1].bottom;
  const groupRectBottom = groupMetadata.rects[groupMetadata.rects.length - 1].bottom;
  if (previousGroupRectBottom !== groupRectBottom) {
    newLine = true;
  }

  if (groupIndex === groupsMetadata.length - 1) {
    finished = true;
  }

  return updateObject(currentState, {
    groupIndex,
    marginTop,
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
    if (
      this.currentState.modification === 'group-highlighted' ||
      this.currentState.modification === 'group-spacing' ||
      this.currentState.modification === 'group-vertical'
    ) {
      // Draw text
      if (this.offscreenCanvas.height > this.shownCanvas.height) {
        // Multi page
        this.drawPage();
      } else {
        this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
        this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
      }
    }
    // Calculate update interval
    this.updateInterval = this.props.speedOptions.fixation;
    // Initial draw
    this.currentState.restoreRects = null;
    this.currentState = updateState(this.currentState, this.textMetadata, this.props.wordGroups);
    drawState(this.currentState, this.shownContext, this.offscreenCanvas);
  }

  drawPage(marginTop = 0) {
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
    const copyHeight = Math.max(
      ...this.textMetadata.linesMetadata
        .map((lineMetadata) => lineMetadata.rect.bottom - marginTop)
        .filter((lineBottom) => lineBottom < this.shownCanvas.height),
    );
    this.shownContext.drawImage(
      this.offscreenCanvas,
      0,
      marginTop,
      this.shownCanvas.width,
      copyHeight,
      0,
      0,
      this.shownCanvas.width,
      copyHeight,
    );
  }

  loop() {
    this.currentState.restoreRects = this.currentState.drawRects ? this.currentState.drawRects.slice() : null;
    this.currentState = updateState(this.currentState, this.textMetadata, this.props.wordGroups);
    if (this.currentState.newPage) {
      if (
        this.currentState.modification === 'group-highlighted' ||
        this.currentState.modification === 'group-spacing' ||
        this.currentState.modification === 'group-vertical'
      ) {
        this.drawPage(this.currentState.marginTop);
      }
    }
    drawState(this.currentState, this.shownContext, this.offscreenCanvas);
    if (this.currentState.finished) {
      timeout = setTimeout(() => {
        this.props.onExerciseFinish();
      }, this.updateInterval);
    } else if (this.currentState.newPage) {
      this.delayedLoop(this.props.exerciseOptions.pageBreakDelay);
    } else if (this.currentState.newLine) {
      this.delayedLoop(this.props.exerciseOptions.lineBreakDelay);
    } else {
      this.scheduleLoop();
    }
  }

  delayedLoop(delay) {
    timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(() => this.scheduleLoop());
    }, delay);
  }

  scheduleLoop() {
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
