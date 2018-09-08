import { updateState } from './Disappearing';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

const CANVAS_HEIGHT = 400;

describe('Disappearing updateState', () => {
  const textOptions = {
    font: 'sans-serif',
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
  console.log(JSON.stringify(textMetadata, null, 2));

  before(() => {
    // console.log(textMetadata);
  });

  it('increases initial state line character index', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.lineCharacterIndex).to.equal(0);
  });

  it('outputs first clear rect', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: -1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const averageCharacterWidth = Math.ceil(textMetadata.linesMetadata[0].averageCharacterWidth);
    const expectedRect = {
      x: 0,
      y: 0,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.clearRect).to.eql(expectedRect);
  });

  it('increases first update line character index', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.lineCharacterIndex).to.equal(1);
  });

  it('outputs second clear rect', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const averageCharacterWidth = Math.ceil(textMetadata.linesMetadata[0].averageCharacterWidth);
    const expectedRect = {
      x: averageCharacterWidth,
      y: 0,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.clearRect).to.eql(expectedRect);
  });

  it('increases word index on new word', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: 5,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.wordIndex).to.equal(1);
  });

  it('increases word index on new line', () => {
    const currentState = {
      wordIndex: 3,
      lineCharacterIndex: 17,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.wordIndex).to.equal(4);
  });

  it('detects new line', () => {
    const currentState = {
      wordIndex: 3,
      lineCharacterIndex: 17,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newLine).to.equal(true);
  });

  it('resets line character index on new line', () => {
    const currentState = {
      wordIndex: 3,
      lineCharacterIndex: 17,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.lineCharacterIndex).to.equal(0);
  });

  it('outputs second line clear rect', () => {
    const currentState = {
      wordIndex: 3,
      lineCharacterIndex: 17,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const averageCharacterWidth = Math.ceil(textMetadata.linesMetadata[1].averageCharacterWidth);
    const expectedRect = {
      x: 0,
      y: 19,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.clearRect).to.eql(expectedRect);
  });

  it('outputs third line clear rect', () => {
    const currentState = {
      wordIndex: 4,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const averageCharacterWidth = Math.ceil(textMetadata.linesMetadata[2].averageCharacterWidth);
    const expectedRect = {
      x: 0,
      y: 43,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.clearRect).to.eql(expectedRect);
  });

  it('increases word index on new line', () => {
    const currentState = {
      wordIndex: 22,
      lineCharacterIndex: 26,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.wordIndex).to.equal(23);
  });

  it('detects that text has not finished', () => {
    const currentState = {
      wordIndex: 121,
      lineCharacterIndex: 13,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.finished).to.equal(false);
  });

  it('detects that text has finished', () => {
    console.log(textMetadata.wordsMetadata[121]);
    const currentState = {
      wordIndex: 121,
      lineCharacterIndex: 14,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.finished).to.equal(true);
  });

  it('detects that there it is not new page', () => {
    const currentState = {
      wordIndex: 61,
      lineCharacterIndex: 20,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newPage).to.equal(false);
  });

  it('detects that there it is new page', () => {
    const currentState = {
      wordIndex: 61,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newPage).to.equal(true);
  });

  it('increases margin top', () => {
    const currentState = {
      wordIndex: 61,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.marginTop).to.equal(385);
  });

  it('outputs new page clear rect', () => {
    const currentState = {
      wordIndex: 61,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const expectedRect = {
      x: 0,
      y: 0,
      width: 12,
      height: 19,
    };
    expect(newState.clearRect).to.eql(expectedRect);
  });
});
