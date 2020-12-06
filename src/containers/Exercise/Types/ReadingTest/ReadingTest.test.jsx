import { pageChange } from './ReadingTest';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

const CANVAS_HEIGHT = 400;

describe('Reading test', () => {
  const textOptions = {
    font: 'Arial',
    width: 250,
    fontSize: 25,
    lineSpacing: 1.0,
  };
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = textOptions.width;
  offscreenCanvas.height = CANVAS_HEIGHT;
  const offscreenContext = offscreenCanvas.getContext('2d');
  offscreenContext.font = `${Math.ceil(textOptions.fontSize / 0.75)}px ${textOptions.font}`;
  offscreenContext.textBaseline = 'bottom';
  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  const textMetadata = writeText(offscreenContext, exampleText.contentState);

  beforeAll(() => {
    // console.log(textMetadata);
  });

  it('next page on first page increases page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 0,
    };
    const newState = pageChange(1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(1);
  });

  it('previous page on first page does not change page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 0,
    };
    const newState = pageChange(-1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(0);
  });

  it('previous page on second page decreases page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 1,
    };
    const newState = pageChange(-1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(0);
  });

  it('next page on second page increases page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 1,
    };
    const newState = pageChange(1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(2);
  });

  it('previous page on third page decreases page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 2,
    };
    const newState = pageChange(-1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(1);
  });

  it('next page on third page increases page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 2,
    };
    const newState = pageChange(1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(3);
  });

  it('previous page on fourth page decreases page index', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: 3,
    };
    const newState = pageChange(-1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(2);
  });

  it('next page on the last page does not change page index', () => {
    const lastPageIndex = textMetadata.pagesMetadata.length - 1;
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      pageIndex: lastPageIndex,
    };
    const newState = pageChange(1, currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.pageIndex).toEqual(lastPageIndex);
  });
});
