import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { updateObject } from '../../../../shared/utility';
import { createOffscreenContext, drawPage, pixelRatio, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

export const pageChange = (change, currentState, textMetadata, context, offscreenCanvas) => {
  const { pageIndex } = currentState;
  const { pagesMetadata } = textMetadata;
  const newPageIndex = Math.min(Math.max(pageIndex + change, 0), pagesMetadata.length - 1);
  if (newPageIndex !== pageIndex) {
    const pageMetadata = pagesMetadata[newPageIndex];
    drawPage(pageMetadata, context, offscreenCanvas);
    return updateObject(currentState, {
      pageIndex: newPageIndex,
    });
  }
  return currentState;
};

const initialState = {
  pageIndex: 0,
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

  preventDefault = (event) => {
    const { key } = event;
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) !== -1) {
      event.preventDefault();
    }
  };

  keyPressHandler = (event) => {
    const { key } = event;
    if (key === 'ArrowRight') {
      this.onNextPage();
    } else if (key === 'ArrowLeft') {
      this.onPreviousPage();
    }
  };

  onNextPage = () => {
    this.currentState = pageChange(1, this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
  };

  onPreviousPage = () => {
    this.currentState = pageChange(-1, this.currentState, this.textMetadata, this.shownContext, this.offscreenCanvas);
  };

  render() {
    return (
      <>
        <canvas
          ref={(ref) => {
            this.shownCanvas = ref;
          }}
          width={this.props.canvasWidth}
          height={this.props.canvasHeight}
        />
        <Button.Group fluid basic>
          <Button onClick={this.onPreviousPage}>
            <Icon name="chevron left" />
            {this.props.translate('text-exercise.previous-page')}
          </Button>
          <Button onClick={this.onNextPage}>
            {this.props.translate('text-exercise.next-page')}
            <Icon name="chevron right" />
          </Button>
        </Button.Group>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  textOptions: state.options.textOptions,
});

export default connect(mapStateToProps, null)(ReadingTest);
