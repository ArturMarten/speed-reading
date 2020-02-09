import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import { createOffscreenContext, writeText, pixelRatio } from '../../../../utils/CanvasUtils/CanvasUtils';
import { updateObject } from '../../../../shared/utility';

export const previousPage = (currentState, textMetadata, context, offscreenCanvas) => {
  const { canvasHeight, marginTop } = currentState;
  const previousPageTop = Math.min(
    ...textMetadata.linesMetadata
      .map((lineMetadata) => lineMetadata.rect.top)
      .filter((lineTop) => lineTop >= Math.max(marginTop - canvasHeight, 0)),
  );
  if (previousPageTop < marginTop) {
    const previousPageBottom = Math.min(
      ...textMetadata.linesMetadata
        .map((lineMetadata) => lineMetadata.rect.top)
        .filter((lineBottom) => lineBottom >= marginTop),
    );
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const height = previousPageBottom - previousPageTop;
    context.drawImage(
      offscreenCanvas,
      0,
      previousPageTop,
      context.canvas.width,
      height,
      0,
      0,
      context.canvas.width,
      height,
    );
    return updateObject(currentState, {
      marginTop: marginTop - height,
    });
  }
  return currentState;
};

export const nextPage = (currentState, textMetadata, context, offscreenCanvas) => {
  const { marginTop, canvasHeight } = currentState;
  const currentPageBottom = Math.max(
    ...textMetadata.linesMetadata
      .map((lineMetadata) => lineMetadata.rect.bottom)
      .filter((lineBottom) => lineBottom < marginTop + canvasHeight),
  );
  const nextPageBottom = Math.max(
    ...textMetadata.linesMetadata
      .map((lineMetadata) => lineMetadata.rect.bottom)
      .filter((lineBottom) => lineBottom < currentPageBottom + canvasHeight),
  );
  if (nextPageBottom > currentPageBottom) {
    const nextPageTop = Math.max(
      ...textMetadata.linesMetadata
        .map((lineMetadata) => lineMetadata.rect.bottom)
        .filter((lineBottom) => lineBottom < canvasHeight + marginTop),
    );
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const height = nextPageBottom - nextPageTop;
    context.drawImage(
      offscreenCanvas,
      0,
      nextPageTop,
      context.canvas.width,
      height,
      0,
      0,
      context.canvas.width,
      height,
    );
    return updateObject(currentState, {
      marginTop: nextPageTop,
    });
  }
  return currentState;
};

const initialState = {
  marginTop: 0,
};

export class ReadingTest extends Component {
  currentState = { ...initialState };

  componentDidMount() {
    this.init();
    document.addEventListener('keydown', this.preventDefault);
    document.addEventListener('keyup', this.keyPressHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.preventDefault);
    document.removeEventListener('keyup', this.keyPressHandler);
  }

  onNextPage = () => {
    this.currentState = nextPage(this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
  };

  onPreviousPage = () => {
    this.currentState = previousPage(this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
  };

  keyPressHandler = (event) => {
    const { key } = event;
    if (key === 'ArrowRight') {
      this.onNextPage();
    } else if (key === 'ArrowLeft') {
      this.onPreviousPage();
    }
  };

  preventDefault = (event) => {
    const { key } = event;
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) !== -1) {
      event.preventDefault();
    }
  };

  init() {
    this.currentState.canvasHeight = this.props.canvasHeight * pixelRatio;
    // Create and prepare off-screen canvas
    this.offscreenContext = createOffscreenContext(this.shownCanvas, this.props.textOptions);
    this.offscreenCanvas = this.offscreenContext.canvas;
    // Prerender off-screen-canvas
    this.textMetadata = writeText(this.offscreenContext, this.props.selectedText.contentState);
    // Prepare visible canvas
    this.shownContext = this.shownCanvas.getContext('2d');
    this.shownContext.clearRect(0, 0, this.shownCanvas.width, this.shownCanvas.height);
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

  render() {
    return (
      <>
        <canvas
          ref={(ref) => {
            this.shownCanvas = ref;
          }}
          width={this.props.textOptions.width}
          height={this.props.canvasHeight}
        />
        <Button.Group fluid basic>
          <Button onClick={this.onPreviousPage}>
            <Icon name="left chevron" />
            {this.props.translate('text-exercise.previous-page')}
          </Button>
          <Button onClick={this.onNextPage}>
            {this.props.translate('text-exercise.next-page')}
            <Icon name="right chevron" />
          </Button>
        </Button.Group>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  textOptions: state.options.textOptions,
});

export default connect(
  mapStateToProps,
  null,
)(ReadingTest);
