/* eslint-disable func-names */
import { updateState } from './WordGroups';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';
import { splitIntoWordGroups } from '../../../../utils/TextUtils';

const CANVAS_HEIGHT = 400;
const GROUP_CHARACTER_COUNT = 15;

describe.only('Wordgroups updateState', () => {
  const textOptions = {
    font: 'Calibri',
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
  const wordGroups = splitIntoWordGroups(exampleText.contentState.getPlainText(''), GROUP_CHARACTER_COUNT);

  before(() => {
    // console.log(wordGroups);
  });

  it('increases initial state group index', () => {
    const currentState = {
      wordIndex: -1,
      groupIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.groupIndex).to.equal(0);
  });

  it('increases initial state word index', () => {
    const currentState = {
      wordIndex: -1,
      groupIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.wordIndex).to.equal(1);
  });

  it('outputs first draw rect', () => {
    const currentState = {
      wordIndex: -1,
      groupIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    const expectedRects = [{
      x: 0,
      y: 0,
      width: 102,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('increases group index after first group', () => {
    const currentState = {
      wordIndex: 1,
      groupIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.groupIndex).to.equal(1);
  });

  it('increases word index after first group', () => {
    const currentState = {
      wordIndex: 1,
      groupIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.wordIndex).to.equal(4);
  });

  it('outputs second draw rect', () => {
    const currentState = {
      wordIndex: 1,
      groupIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    const expectedRects = [{
      x: 106,
      y: 0,
      width: 111,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('increases word index after second group', () => {
    const currentState = {
      wordIndex: 4,
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.wordIndex).to.equal(5);
  });

  it('increases group index after second group', () => {
    const currentState = {
      wordIndex: 4,
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.groupIndex).to.equal(2);
  });

  it('outputs third draw rect', () => {
    const currentState = {
      wordIndex: 4,
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    const expectedRects = [{
      x: 0,
      y: 24,
      width: 91,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('detects new line after second group', () => {
    const currentState = {
      wordIndex: 4,
      groupIndex: 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.newLine).to.equal(true);
  });

  it('increases word index after fourth group', () => {
    const currentState = {
      wordIndex: 7,
      groupIndex: 4,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.wordIndex).to.equal(10);
  });

  it('increases group index after fourth group', () => {
    const currentState = {
      wordIndex: 7,
      groupIndex: 4,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.groupIndex).to.equal(5);
  });

  it('outputs fifth draw rect', () => {
    const currentState = {
      wordIndex: 7,
      groupIndex: 4,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    const expectedRects = [{
      x: 207,
      y: 24,
      width: 27,
      height: 19,
    }, {
      x: 0,
      y: 43,
      width: 90,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('detects new line after fourth group', () => {
    const currentState = {
      wordIndex: 7,
      groupIndex: 4,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.newLine).to.equal(true);
  });

  it('detects that there is not new page', () => {
    const currentState = {
      wordIndex: 84,
      groupIndex: 47,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.newPage).to.equal(false);
  });

  it('detects that there is new page', () => {
    const currentState = {
      wordIndex: 86,
      groupIndex: 48,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.newPage).to.equal(true);
  });

  it('increases margin top', () => {
    const currentState = {
      wordIndex: 86,
      groupIndex: 48,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.marginTop).to.equal(390);
  });

  it('outputs new page draw rect', () => {
    const currentState = {
      wordIndex: 86,
      groupIndex: 48,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    const expectedRects = [{
      x: 0,
      y: 0,
      width: 94,
      height: 19,
    }];
    expect(newState.drawRects).to.eql(expectedRects);
  });

  it('detects that text has not finished', () => {
    const currentState = {
      wordIndex: 119,
      groupIndex: 63,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 390,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.finished).to.equal(false);
  });

  it('detects that text has finished', () => {
    const currentState = {
      wordIndex: 120,
      groupIndex: 64,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 390,
    };
    const newState = updateState(currentState, textMetadata, wordGroups);
    expect(newState.finished).to.equal(true);
  });
});
