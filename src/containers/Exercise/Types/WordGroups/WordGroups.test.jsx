/* eslint-disable func-names */
import { updateStateFunction } from './WordGroups';
import { exampleText, writeText, getGroupsMetadata } from '../../../../utils/CanvasUtils/CanvasUtils';
import { splitIntoWordGroups } from '../../../../utils/TextUtils';

const CANVAS_HEIGHT = 400;
const GROUP_CHARACTER_COUNT = 15;

describe('Wordgroups updateState', () => {
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
  const { wordsMetadata, linesMetadata } = writeText(offscreenContext, exampleText.contentState);
  const wordGroups = splitIntoWordGroups(exampleText.contentState.getPlainText(''), GROUP_CHARACTER_COUNT);
  const groupsMetadata = getGroupsMetadata(wordsMetadata, wordGroups);
  const textMetadata = { wordsMetadata, linesMetadata, groupsMetadata };

  beforeAll(() => {
    // console.log(wordGroups);
  });

  const initialState = {
    canvasHeight: CANVAS_HEIGHT,
    groupIndex: 0,
    groupPosition: 0,
    marginTop: 0,
    drawRects: [],
  };

  const [currentState, updateState] = updateStateFunction(textMetadata, speedOptions, initialState);

  it('stores initial reading speed', () => {
    expect(currentState.wordsPerMinute).toEqual(250);
  });

  it('calculates initial speed', () => {
    expect(currentState.speed).toBeCloseTo(0.24549, 5);
  });

  it('returns initial group index', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.groupIndex).toEqual(0);
  });

  it('returns initial group position', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.groupPosition).toEqual(0);
  });

  it('returns initial finished flag', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.finished).toEqual(false);
  });

  it('stores last update timestamp', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.lastUpdate).toBeGreaterThan(0);
  });

  it('returns initial draw rects', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.drawRects).toEqual([
      {
        x: 0,
        y: 0,
        width: 140,
        height: 19,
      },
    ]);
  });

  it('returns initial restore rects', () => {
    const nextState = updateState(currentState, 0);
    expect(nextState.restoreRects).toEqual([]);
  });

  it('stores changed reading speed', () => {
    const updatedOptions = { wordsPerMinute: 300 };
    const [updatedState] = updateStateFunction(textMetadata, updatedOptions, CANVAS_HEIGHT, currentState);
    expect(updatedState.wordsPerMinute).toEqual(300);
  });

  it('calculates speed change', () => {
    const updatedOptions = { wordsPerMinute: 300 };
    const [updatedState] = updateStateFunction(textMetadata, updatedOptions, CANVAS_HEIGHT, currentState);
    expect(updatedState.speed).toBeCloseTo(0.29459, 5);
  });

  it('calculates updated group position', () => {
    const nextState = updateState(currentState, 250);
    expect(nextState.groupPosition).toBeCloseTo(61, 0);
  });

  it('increases line index on new group', () => {
    const nextState = updateState(currentState, 571);
    expect(nextState.groupIndex).toEqual(1);
  });

  it('detects new line', () => {
    const nextState = updateState(currentState, 571);
    expect(nextState.newLine).toEqual(true);
  });

  it('detects new page', () => {
    const state = {
      ...currentState,
      groupIndex: 36,
      groupPosition: 90,
      marginTop: 0,
      drawRects: [
        {
          x: 163,
          y: 366,
          width: 84,
          height: 19,
        },
      ],
    };
    const nextState = updateState(state, 20);
    expect(nextState.newPage).toEqual(true);
  });

  it('increases margin top on new page', () => {
    const state = {
      ...currentState,
      groupIndex: 36,
      groupPosition: 90,
      marginTop: 0,
      drawRects: [
        {
          x: 163,
          y: 366,
          width: 84,
          height: 19,
        },
      ],
    };
    const nextState = updateState(state, 20);
    expect(nextState.marginTop).toEqual(385);
  });

  it('returns no restore rects on new page', () => {
    const state = {
      ...currentState,
      groupIndex: 36,
      groupPosition: 90,
      marginTop: 0,
      drawRects: [
        {
          x: 163,
          y: 366,
          width: 84,
          height: 19,
        },
      ],
    };
    const nextState = updateState(state, 20);
    expect(nextState.restoreRects).toEqual([]);
  });

  it('returns finished flag after end', () => {
    const lastGroupIndex = textMetadata.groupsMetadata.length - 1;
    const lastGroupMetadata = textMetadata.groupsMetadata[lastGroupIndex];
    const state = {
      ...currentState,
      groupIndex: lastGroupIndex,
      groupPosition: lastGroupMetadata.groupWidth - 2,
    };
    const nextState = updateState(state, 9);
    expect(nextState.finished).toBeTruthy();
  });
});
