import { updateState } from './Scrolling';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

const CANVAS_HEIGHT = 400;

describe('Scrolling updateState', () => {
  const textOptions = {
    font: 'Arial',
    width: 250,
    fontSize: 14,
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

  it('increases initial state margin top by one', () => {
    const currentState = {
      scrollStep: 1,
      marginTop: -400,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.marginTop).toEqual(-399);
  });

  it('increases initial state margin top by two', () => {
    const currentState = {
      scrollStep: 2,
      marginTop: -400,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.marginTop).toEqual(-398);
  });

  it('increases initial state margin top by three', () => {
    const currentState = {
      scrollStep: 3,
      marginTop: -400,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.marginTop).toEqual(-397);
  });
});
