import { updateStateFunction } from './ReadingAid';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

const CANVAS_HEIGHT = 400;

describe('Reading aid updateState', () => {
  const textOptions = {
    font: 'sans-serif',
    width: 250,
    fontSize: 14,
    lineSpacing: 1.0,
  };

  const speedOptions = {
    wordsPerMinute: 250,
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

  const initialState = {
    canvasHeight: CANVAS_HEIGHT,
    pageIndex: 0,
    lineIndex: 0,
    linePosition: 0,
  };

  const [currentState, updateState] = updateStateFunction(textMetadata, speedOptions, initialState);

  it('stores initial reading speed', () => {
    expect(currentState.wordsPerMinute).toEqual(250);
  });

  it('calculates initial speed', () => {
    expect(currentState.speed).toBeCloseTo(0.25434, 5);
  });

  it('returns initial line index', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.lineIndex).toEqual(0);
  });

  it('returns initial line position', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.linePosition).toEqual(0);
  });

  it('returns initial finished flag', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.finished).toEqual(false);
  });

  it('stores last update timestamp', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.lastUpdate).toBeGreaterThan(0);
  });

  it('returns initial draw rect', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.drawRect).toEqual({
      x: 0,
      y: 0,
      width: 20,
      height: 19,
    });
  });

  it('returns initial restore rect', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.restoreRect).toEqual({});
  });

  it('stores changed reading speed', () => {
    const updatedOptions = { wordsPerMinute: 300 };
    const [updatedState] = updateStateFunction(textMetadata, updatedOptions, CANVAS_HEIGHT, currentState);
    expect(updatedState.wordsPerMinute).toEqual(300);
  });

  it('calculates speed change', () => {
    const updatedOptions = { wordsPerMinute: 300 };
    const [updatedState] = updateStateFunction(textMetadata, updatedOptions, CANVAS_HEIGHT, currentState);
    expect(updatedState.speed).toBeCloseTo(0.3052, 5);
  });

  it('calculates updated line position', () => {
    const nextState = updateState(currentState, 250);
    expect(nextState.linePosition).toBeCloseTo(64, 0);
  });

  it('returns updated draw rect', () => {
    const nextState = updateState(currentState, 250);
    expect(nextState.drawRect).toEqual({
      x: 64,
      y: 0,
      width: 20,
      height: 19,
    });
  });

  it('returns updated restore rect', () => {
    const state = {
      ...currentState,
      drawRect: { x: 60, y: 0, width: 20, height: 19 },
    };
    const nextState = updateState(state, 250);
    expect(nextState.restoreRect).toEqual({
      x: 60,
      y: 0,
      width: 20,
      height: 19,
    });
  });

  it('detects new line', () => {
    const nextState = updateState(currentState, 932);
    expect(nextState.newLine).toEqual(true);
  });

  it('moves line position to start on new line', () => {
    const nextState = updateState(currentState, 932);
    expect(nextState.linePosition).toBeCloseTo(0, 0);
  });

  it('increases line index on new line', () => {
    const nextState = updateState(currentState, 932);
    expect(nextState.lineIndex).toEqual(1);
  });

  it('detects new page', () => {
    const pageFirstLineIndex = textMetadata.linesMetadata.findIndex((line) => line.rect.bottom > CANVAS_HEIGHT);
    const pageLastLineIndex = pageFirstLineIndex - 1;
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastLineIndex];
    const state = {
      ...currentState,
      lineIndex: pageLastLineIndex,
      linePosition: pageLastLineMetadata.lineWidth - 2,
    };
    const nextState = updateState(state, 8);
    expect(nextState.newPage).toEqual(true);
  });

  it('increases page index on new page', () => {
    const pageFirstLineIndex = textMetadata.linesMetadata.findIndex((line) => line.rect.bottom > CANVAS_HEIGHT);
    const pageLastLineIndex = pageFirstLineIndex - 1;
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastLineIndex];
    const state = {
      ...currentState,
      lineIndex: pageLastLineIndex,
      linePosition: pageLastLineMetadata.lineWidth - 2,
    };
    const nextState = updateState(state, 8);
    expect(nextState.pageIndex).toEqual(1);
  });

  it('returns finished flag after end', () => {
    const lastLineIndex = textMetadata.linesMetadata.length - 1;
    const lastLineMetadata = textMetadata.linesMetadata[lastLineIndex];
    const state = {
      ...currentState,
      lineIndex: lastLineIndex,
      linePosition: lastLineMetadata.lineWidth - 2,
    };
    const nextState = updateState(state, 8);
    expect(nextState.finished).toBeTruthy();
  });
});
