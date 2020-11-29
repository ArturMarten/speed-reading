import { updateStateFunction } from './Scrolling';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

const CANVAS_HEIGHT = 400;

describe('Scrolling updateState', () => {
  const textOptions = {
    font: 'Arial',
    width: 250,
    fontSize: 14,
    lineSpacing: 1.0,
  };

  const speedOptions = {
    wordsPerMinute: 280,
  };

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = textOptions.width;
  offscreenCanvas.height = CANVAS_HEIGHT;
  const offscreenContext = offscreenCanvas.getContext('2d');
  offscreenContext.font = `${Math.ceil(textOptions.fontSize / 0.75)}px ${textOptions.font}`;
  offscreenContext.textBaseline = 'bottom';
  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  const textMetadata = writeText(offscreenContext, exampleText.contentState);

  const initialState = {};
  const [currentState, updateState] = updateStateFunction(textMetadata, speedOptions, CANVAS_HEIGHT, initialState);

  const { wordsMetadata, linesMetadata } = textMetadata;
  const calculateTotalTime = (wordsPerMinute) => {
    const totalWords = wordsMetadata.length;
    return Math.round((totalWords / wordsPerMinute) * 60 * 1000);
  };
  const startMarginTop = -CANVAS_HEIGHT / 2;
  const totalHeight = linesMetadata[linesMetadata.length - 1].rect.bottom - linesMetadata[0].rect.top - startMarginTop;

  beforeAll(() => {
    // console.log(textMetadata);
  });

  it('stores reading speed in state', () => {
    expect(currentState.wordsPerMinute).toEqual(280);
  });

  it('stores initial margin top', () => {
    expect(currentState.marginTop).toEqual(-200);
  });

  it('calculates initial speed', () => {
    const expectedSpeed = totalHeight / calculateTotalTime(speedOptions.wordsPerMinute);
    expect(currentState.speed).toBeCloseTo(expectedSpeed, 5);
  });

  it('stores last update timestamp', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.lastUpdate).toBeGreaterThan(0);
  });

  it('calculates margin top', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.marginTop).toEqual(-200);
  });

  it('stores changed reading speed', () => {
    const updatedOptions = { wordsPerMinute: 300 };
    const [updatedState] = updateStateFunction(textMetadata, updatedOptions, CANVAS_HEIGHT, currentState);
    expect(updatedState.wordsPerMinute).toEqual(300);
  });

  it('calculates speed change', () => {
    const updatedOptions = { wordsPerMinute: 300 };
    const [updatedState] = updateStateFunction(textMetadata, updatedOptions, CANVAS_HEIGHT, currentState);
    const expectedSpeed = totalHeight / calculateTotalTime(updatedOptions.wordsPerMinute);
    expect(updatedState.speed).toBeCloseTo(expectedSpeed, 5);
  });
  it('calculates updated margin top', () => {
    const nextState = updateState(currentState, 250);
    const expectedMarginTop = startMarginTop + currentState.speed * 250;
    expect(nextState.marginTop).toBeCloseTo(expectedMarginTop, 0);
  });

  it('returns finished flag before end', () => {
    const nextState = updateState(currentState, 26142);
    expect(nextState.finished).toBeFalsy();
  });

  it('returns finished flag after end', () => {
    const nextState = updateState(currentState, 26144);
    expect(nextState.finished).toBeTruthy();
  });
});
