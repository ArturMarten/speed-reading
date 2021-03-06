import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateObject } from '../../../../shared/utility';
import * as glur from 'glur';
import {
  createOffscreenContext,
  drawPageLines,
  getGroupsMetadata,
  pixelRatio,
  writeText,
} from '../../../../utils/CanvasUtils/CanvasUtils';

export const drawState = (currentState, context, restoreCanvas, clearCanvas) => {
  const { restoreRects, drawRects } = currentState;

  restoreRects.forEach((restoreRect) => {
    context.clearRect(restoreRect.x, restoreRect.y, restoreRect.width, restoreRect.height);
    if (currentState.modification === 'group-highlighted' || currentState.modification === 'group-blurry') {
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
  drawRects.forEach((drawRect) => {
    if (currentState.modification === 'group-blurry') {
      context.clearRect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);
      context.drawImage(
        clearCanvas,
        drawRect.x,
        drawRect.y + currentState.marginTop,
        drawRect.width,
        drawRect.height,
        drawRect.x,
        drawRect.y,
        drawRect.width,
        drawRect.height,
      );
    }
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
    } else if (currentState.modification === 'group-highlighted') {
      const underlineHeight = drawRect.height * 0.1;
      context.fillRect(drawRect.x, drawRect.y + (drawRect.height - underlineHeight), drawRect.width, underlineHeight);
    }
  });
};

export const updateStateFunction = (textMetadata, options, state) => {
  const { wordsMetadata, groupsMetadata } = textMetadata;
  const { wordsPerMinute } = options;
  let speed = 0;

  if (!state.speed) {
    // Initial speed
    const totalTime = Math.round((wordsMetadata.length / options.wordsPerMinute) * 60 * 1000);
    const totalWidth = groupsMetadata.reduce((acc, el) => acc + el.groupWidth, 0);
    // console.log(`Total width ${totalWidth}px in ${totalTime}ms`);
    speed = totalWidth / totalTime;
  } else {
    // Speed changed
    const change = wordsPerMinute / state.wordsPerMinute;
    speed = state.speed * change;
  }
  // console.log(`Speed ${speed} px/ms`);

  const nextState = updateObject(state, {
    speed,
    wordsPerMinute,
  });
  return [
    nextState,
    (currentState, updateTime) => {
      // Calculate next state
      const { canvasHeight } = currentState;
      let { groupIndex, groupPosition, marginTop } = currentState;
      let newGroup = false;
      let newLine = false;
      let newPage = false;
      let finished = false;
      const drawRects = [];

      const widthProgress = currentState.speed * updateTime;
      // console.log(`Width progress ${widthProgress} px`);

      groupPosition += widthProgress;

      let groupMetadata = groupsMetadata[groupIndex];

      if (groupPosition >= groupMetadata.groupWidth) {
        if (groupIndex !== groupsMetadata.length - 1) {
          // New group
          newGroup = true;
          groupPosition -= groupMetadata.groupWidth;
          groupIndex += 1;
          groupMetadata = groupsMetadata[groupIndex];

          const previousGroupIndex = Math.max(groupIndex - 1, 0);
          const previousGroupMetadata = groupsMetadata[previousGroupIndex];
          const previousGroupRectBottom = previousGroupMetadata.rects[previousGroupMetadata.rects.length - 1].bottom;
          const groupRectBottom = groupMetadata.rects[groupMetadata.rects.length - 1].bottom;
          if (previousGroupRectBottom !== groupRectBottom) {
            newLine = true;
          }
        } else {
          finished = true;
        }
      }

      for (let index = 0; index < groupMetadata.rects.length; index += 1) {
        const groupRect = groupMetadata.rects[index];
        if (groupRect.bottom - marginTop > canvasHeight) {
          if (drawRects.length === 1) {
            if (groupPosition < drawRects[0].width) {
              break;
            } else {
              drawRects.pop();
            }
          }

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
      }

      const restoreRects = newPage ? [] : currentState.drawRects.slice();

      return updateObject(currentState, {
        marginTop,
        groupIndex,
        groupPosition,
        restoreRects,
        drawRects,
        newGroup,
        newLine,
        newPage,
        finished,
        lastUpdate: performance.now(),
      });
    },
  ];
};

let timeout = null;
let animationFrame = null;

const initialState = {
  groupIndex: 0,
  groupPosition: 0,
  marginTop: 0,
  drawRects: [],
};

const BLUR_RADIUS = 9;
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
      this.currentState = this.updateState(this.currentState, 0);
      drawState(this.currentState, this.shownContext, this.offscreenCanvas, this.clearOffscreenCanvas);
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
      const [nextState, updateState] = updateStateFunction(
        this.textMetadata,
        nextProps.speedOptions,
        this.currentState,
      );
      this.currentState = nextState;
      this.updateState = updateState;
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

    if (this.currentState.modification === 'group-blurry') {
      this.clearOffscreenContext = createOffscreenContext(this.offscreenCanvas, this.props.textOptions);
      this.clearOffscreenCanvas = this.clearOffscreenContext.canvas;
      const imageData = this.offscreenContext.getImageData(
        0,
        0,
        this.offscreenCanvas.width,
        this.offscreenCanvas.height,
      );
      this.clearOffscreenContext.putImageData(imageData, 0, 0);
      glur(imageData.data, this.offscreenCanvas.width, this.offscreenCanvas.height, BLUR_RADIUS);
      this.offscreenContext.putImageData(imageData, 0, 0);
    }

    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    if (this.currentState.modification === 'group-highlighted' || this.currentState.modification === 'group-blurry') {
      // Draw text
      if (this.offscreenCanvas.height > this.shownCanvas.height) {
        // Multi page
        drawPageLines(this.textMetadata.linesMetadata, this.shownContext, this.offscreenCanvas);
      } else {
        this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
        this.shownContext.drawImage(this.offscreenCanvas, 0, 0);
      }
    }
    // Initial draw
    const [nextState, updateState] = updateStateFunction(this.textMetadata, this.props.speedOptions, this.currentState);
    this.currentState = nextState;
    this.updateState = updateState;
  }

  loop() {
    const updateTime = performance.now() - this.currentState.lastUpdate;
    this.currentState = this.updateState(this.currentState, updateTime);
    if (this.currentState.newPage) {
      if (this.currentState.modification === 'group-highlighted' || this.currentState.modification === 'group-blurry') {
        drawPageLines(
          this.textMetadata.linesMetadata,
          this.shownContext,
          this.offscreenCanvas,
          this.currentState.marginTop,
        );
      } else if (this.currentState.modification === 'group-single') {
        const { canvas } = this.shownContext;
        this.shownContext.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    if (this.currentState.newGroup) {
      // Optimization
      drawState(this.currentState, this.shownContext, this.offscreenCanvas, this.clearOffscreenCanvas);
    }
    if (this.currentState.finished) {
      this.props.onExerciseFinish();
    } else if (this.currentState.newPage) {
      this.delayedLoop(this.props.exerciseOptions.pageBreakDelay);
    } else if (this.currentState.newLine) {
      this.delayedLoop(this.props.exerciseOptions.lineBreakDelay);
    } else {
      animationFrame = requestAnimationFrame(() => this.loop());
    }
  }

  delayedLoop(delay) {
    timeout = setTimeout(() => {
      this.currentState = updateObject(this.currentState, {
        lastUpdate: performance.now(),
      });
      animationFrame = requestAnimationFrame(() => this.loop());
    }, delay);
  }

  render() {
    return (
      <canvas
        ref={(ref) => {
          this.shownCanvas = ref;
        }}
        width={this.props.canvasWidth}
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

export default connect(mapStateToProps, null)(WordGroups);
