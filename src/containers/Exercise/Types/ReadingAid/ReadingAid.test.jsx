import { updateState } from './ReadingAid';
import { exampleText, writeText } from '../../../../utils/CanvasUtils/CanvasUtils';

const CANVAS_HEIGHT = 400;

describe('Reading aid updateState', () => {
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

  beforeAll(() => {
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
    expect(newState.lineCharacterIndex).toEqual(0);
  });

  it('outputs first restore rect', () => {
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
    expect(newState.restoreRect).toEqual(expectedRect);
  });

  it('outputs first draw rect', () => {
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
    expect(newState.drawRect).toEqual(expectedRect);
  });

  it('increases first update line character index', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: 0,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.lineCharacterIndex).toEqual(1);
  });

  it('outputs second restore rect', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: 0,
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
    expect(newState.restoreRect).toEqual(expectedRect);
  });

  it('outputs second draw rect', () => {
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
    expect(newState.drawRect).toEqual(expectedRect);
  });

  it('increases word index on new word', () => {
    const currentState = {
      wordIndex: 0,
      lineCharacterIndex: 5,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.wordIndex).toEqual(1);
  });

  it('increases word index on new line', () => {
    const currentState = {
      wordIndex: 4,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.wordIndex).toEqual(5);
  });

  it('detects new line', () => {
    const currentState = {
      wordIndex: 4,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newLine).toEqual(true);
  });

  it('resets line character index on new line', () => {
    const currentState = {
      wordIndex: 4,
      lineCharacterIndex: 21,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.lineCharacterIndex).toEqual(0);
  });

  it('outputs second line restore rect', () => {
    const currentState = {
      wordIndex: 3,
      lineCharacterIndex: 17,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const lineFirstWordIndex = textMetadata.wordsMetadata.findIndex((word) => word.rect.bottom > 19);
    const lineLastWordIndex = lineFirstWordIndex - 1;
    const lineLastWordMetadata = textMetadata.wordsMetadata[lineLastWordIndex];
    const averageCharacterWidth = Math.ceil(textMetadata.linesMetadata[0].averageCharacterWidth);
    const expectedRect = {
      x: lineLastWordMetadata.rect.right - averageCharacterWidth + 1,
      y: 0,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.restoreRect).toEqual(expectedRect);
  });

  it('outputs second line draw rect', () => {
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
    expect(newState.drawRect).toEqual(expectedRect);
  });

  it('outputs third line restore rect', () => {
    const currentState = {
      wordIndex: 4,
      lineCharacterIndex: 3,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const averageCharacterWidth = Math.ceil(textMetadata.linesMetadata[1].averageCharacterWidth);
    const expectedRect = {
      x: 42,
      y: 19,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.restoreRect).toEqual(expectedRect);
  });

  it('outputs third line draw rect', () => {
    const currentState = {
      wordIndex: 4,
      lineCharacterIndex: 3,
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
    expect(newState.drawRect).toEqual(expectedRect);
  });

  it('detects that text has not finished', () => {
    const textLastLineMetadata = textMetadata.linesMetadata[textMetadata.linesMetadata.length - 1];
    const currentState = {
      wordIndex: 121,
      lineCharacterIndex: textLastLineMetadata.characterCount - 3,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.finished).toEqual(false);
  });

  it('detects that text has finished', () => {
    const textLastLineMetadata = textMetadata.linesMetadata[textMetadata.linesMetadata.length - 1];
    const currentState = {
      wordIndex: 121,
      lineCharacterIndex: textLastLineMetadata.characterCount - 2,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.finished).toEqual(true);
  });

  it('detects that there it is not new page', () => {
    const pageFirstWordIndex = textMetadata.wordsMetadata.findIndex((word) => word.rect.bottom > CANVAS_HEIGHT);
    const pageLastWordIndex = pageFirstWordIndex - 1;
    const pageLastWordMetadata = textMetadata.wordsMetadata[pageLastWordIndex];
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastWordMetadata.lineNumber];
    const currentState = {
      wordIndex: pageLastWordIndex,
      lineCharacterIndex: pageLastLineMetadata.characterCount - 2,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newPage).toEqual(false);
  });

  it('detects that there it is new page', () => {
    const pageFirstWordIndex = textMetadata.wordsMetadata.findIndex((word) => word.rect.bottom > CANVAS_HEIGHT);
    const pageLastWordIndex = pageFirstWordIndex - 1;
    const pageLastWordMetadata = textMetadata.wordsMetadata[pageLastWordIndex];
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastWordMetadata.lineNumber];
    const currentState = {
      wordIndex: pageLastWordIndex,
      lineCharacterIndex: pageLastLineMetadata.characterCount - 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.newPage).toEqual(true);
  });

  it('increases margin top', () => {
    const pageFirstWordIndex = textMetadata.wordsMetadata.findIndex((word) => word.rect.bottom > CANVAS_HEIGHT);
    const pageLastWordIndex = pageFirstWordIndex - 1;
    const pageLastWordMetadata = textMetadata.wordsMetadata[pageLastWordIndex];
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastWordMetadata.lineNumber];
    const currentState = {
      wordIndex: pageLastWordIndex,
      lineCharacterIndex: pageLastLineMetadata.characterCount - 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    expect(newState.marginTop).toEqual(385);
  });

  it('outputs new page restore rect', () => {
    const pageFirstWordIndex = textMetadata.wordsMetadata.findIndex((word) => word.rect.bottom > CANVAS_HEIGHT);
    const pageLastWordIndex = pageFirstWordIndex - 1;
    const pageLastWordMetadata = textMetadata.wordsMetadata[pageLastWordIndex];
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastWordMetadata.lineNumber];
    const currentState = {
      wordIndex: pageLastWordIndex,
      lineCharacterIndex: pageLastLineMetadata.characterCount - 1,
      canvasHeight: CANVAS_HEIGHT,
      marginTop: 0,
    };
    const newState = updateState(currentState, textMetadata);
    const averageCharacterWidth = Math.ceil(pageLastLineMetadata.averageCharacterWidth);
    const expectedRect = {
      x: pageLastLineMetadata.rect.right - averageCharacterWidth + 1,
      y: pageLastLineMetadata.rect.top,
      width: averageCharacterWidth,
      height: 19,
    };
    expect(newState.restoreRect).toEqual(expectedRect);
  });

  it('outputs new page draw rect', () => {
    const pageFirstWordIndex = textMetadata.wordsMetadata.findIndex((word) => word.rect.bottom > CANVAS_HEIGHT);
    const pageLastWordIndex = pageFirstWordIndex - 1;
    const pageLastWordMetadata = textMetadata.wordsMetadata[pageLastWordIndex];
    const pageLastLineMetadata = textMetadata.linesMetadata[pageLastWordMetadata.lineNumber];
    const currentState = {
      wordIndex: pageLastWordIndex,
      lineCharacterIndex: pageLastLineMetadata.characterCount - 1,
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
    expect(newState.drawRect).toEqual(expectedRect);
  });
});
