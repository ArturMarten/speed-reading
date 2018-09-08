import { nextPage, previousPage } from './ReadingTest';
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

  before(() => {
    // console.log(textMetadata);
  });

  it('next page on first page increases margin top', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = nextPage(currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.marginTop).to.equal(379);
  });

  it('previous page on second page decreases margin top', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 379,
    };
    const newState = previousPage(currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.marginTop).to.equal(0);
  });

  it('next page on second page increases margin top', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 379,
    };
    const newState = nextPage(currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.marginTop).to.equal(753);
  });

  it('previous page on third page decreases margin top', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 753,
    };
    const newState = previousPage(currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.marginTop).to.equal(379);
  });

  it('next page on third page increases margin top', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 753,
    };
    const newState = nextPage(currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.marginTop).to.equal(1127);
  });

  it('previous page on fourth page decreases margin top', () => {
    const currentState = {
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 1127,
    };
    const newState = previousPage(currentState, textMetadata, offscreenContext, offscreenCanvas);
    expect(newState.marginTop).to.equal(753);
  });
});
