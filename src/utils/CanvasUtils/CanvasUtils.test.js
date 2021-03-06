/* eslint-disable func-names */
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { List } from 'immutable';
import { ContentState, convertFromHTML, ContentBlock, genKey } from 'draft-js';
import { createImageData } from 'canvas';
import { exampleText, writeText2 } from './CanvasUtils';

// const imgOutputFolder = `${__dirname}/output`;

// To get test name in Jasmine
/*
let testName = '';
jasmine.getEnv().addReporter({
  specStarted: (result) => {
    testName = result.fullName;
  }
});
*/

export const logJSON = (json) => {
  console.log(JSON.stringify(json, null, 2));
};

const getPixelDifference = (expectedContext, actualContext, diffContext, canvasWidth, canvasHeight) => {
  const expectedImage = expectedContext.getImageData(0, 0, canvasWidth, canvasHeight);
  const actualImage = actualContext.getImageData(0, 0, canvasWidth, canvasHeight);
  const diffImage = createImageData(canvasWidth, canvasHeight);
  const pixelDiff = pixelmatch(expectedImage.data, actualImage.data, diffImage.data, canvasWidth, canvasHeight);
  diffContext.putImageData(diffImage, 0, 0);
  return pixelDiff;
};

export const outputCanvasAsPNG = (canvas, filePath) => {
  const data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(data, 'base64');
  fs.writeFile(filePath, buffer, (err) => {
    if (err) return console.log(err);
    return 0;
  });
};

const createEmptyBlock = () =>
  new ContentBlock({
    key: genKey(),
    type: 'unstyled',
    text: '',
    characterList: List(),
    depth: 0,
    data: {},
  });

const getDraftJSContentFromHTML = (html) => {
  const blocksFromHTML = convertFromHTML(html);
  return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
};

describe('CanvasUtils', () => {
  const expectedCanvas = document.createElement('canvas');
  const actualCanvas = document.createElement('canvas');
  const diffCanvas = document.createElement('canvas');
  const canvasWidth = 250;
  const canvasHeight = 100;
  const fontSize = 20;
  const lineHeight = fontSize;
  const paragraphSpace = 5;
  const font = 'sans-serif';
  const textBaseline = 'bottom';
  const textOptions = {
    width: canvasWidth,
    height: canvasHeight,
    font,
    fontSize,
    fontSizeInPx: fontSize,
  };
  const expectedContext = expectedCanvas.getContext('2d');
  const actualContext = actualCanvas.getContext('2d');
  const diffContext = diffCanvas.getContext('2d');

  beforeAll(() => {
    expectedCanvas.width = canvasWidth;
    expectedCanvas.height = canvasHeight;
    actualCanvas.width = canvasWidth;
    actualCanvas.height = canvasHeight;
    diffCanvas.width = canvasWidth;
    diffCanvas.height = canvasHeight;
    expectedContext.font = `${fontSize}px ${font}`;
    expectedContext.textBaseline = textBaseline;
    actualContext.font = `${fontSize}px ${font}`;
    actualContext.textBaseline = textBaseline;
    diffContext.font = `${fontSize}px ${font}`;
    diffContext.textBaseline = textBaseline;
  });

  beforeEach(() => {
    expectedContext.clearRect(0, 0, canvasWidth, canvasHeight);
    actualContext.clearRect(0, 0, canvasWidth, canvasHeight);
    diffContext.clearRect(0, 0, canvasWidth, canvasHeight);
  });

  afterEach(function () {
    // Reset any applied styling
    expectedContext.font = `${fontSize}px ${font}`;
    expectedContext.textBaseline = textBaseline;
    actualContext.font = `${fontSize}px ${font}`;
    actualContext.textBaseline = textBaseline;
    diffContext.font = `${fontSize}px ${font}`;
    diffContext.textBaseline = textBaseline;

    /*
    // When required, output diff images
    const testName = `${expect.getState().currentTestName}`;
    outputCanvasAsPNG(diffCanvas, `${imgOutputFolder}/diff/${testName}.png`);

    // When required, output actual and expected images
    outputCanvasAsPNG(actualCanvas, `${imgOutputFolder}/actual/${testName}.png`);
    outputCanvasAsPNG(expectedCanvas, `${imgOutputFolder}/expected/${testName}.png`);
    */
  });

  it('exists', () => {
    expect(actualCanvas).not.toEqual(undefined);
  });

  it('passes similarity test', () => {
    expectedContext.fillText('expected', 0, lineHeight);
    actualContext.fillText('expected', 0, lineHeight);
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes difference test', () => {
    expectedContext.fillText('expected', 0, lineHeight);
    actualContext.fillText('actual', 0, lineHeight);
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).not.toEqual(0);
  });

  it('passes letter-by-letter test', () => {
    expectedContext.fillText('letter-by-letter', 0, lineHeight);
    const content = ContentState.createFromText('letter-by-letter');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes bold style test', () => {
    expectedContext.font = `bold ${expectedContext.font}`;
    expectedContext.fillText('bold test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<b>bold test</b>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes italic style test', () => {
    expectedContext.font = `italic ${expectedContext.font}`;
    expectedContext.fillText('italic test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<i>italic test</i>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes bold italic style test', () => {
    expectedContext.font = `bold italic ${expectedContext.font}`;
    expectedContext.fillText('bold italic test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<b><i>bold italic test</i></b>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes style change test', () => {
    const defaultStyle = expectedContext.font;
    expectedContext.font = `bold ${defaultStyle}`;
    expectedContext.fillText('style', 0, lineHeight);
    let position = expectedContext.measureText('style').width;
    expectedContext.font = defaultStyle;
    expectedContext.fillText(' change ', position, lineHeight);
    position += expectedContext.measureText(' change ').width;
    expectedContext.font = `italic ${defaultStyle}`;
    expectedContext.fillText('test', position, lineHeight);
    const content = getDraftJSContentFromHTML('<b>style</b> change <i>test</i>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes text wrap test', () => {
    expectedContext.fillText('this is a multiline text', 0, lineHeight);
    expectedContext.fillText('that should be wrapped', 0, lineHeight + lineHeight);
    const content = getDraftJSContentFromHTML('this is a multiline text that should be wrapped');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes multiple paragraph test', () => {
    expectedContext.fillText('paragraph1 text', 0, lineHeight);
    expectedContext.fillText('paragraph2 text', 0, lineHeight + lineHeight + paragraphSpace);
    const content = getDraftJSContentFromHTML('<p>paragraph1 text</p><p>paragraph2 text</p>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes paragraph wrap test', () => {
    expectedContext.fillText('paragraph text should', 0, lineHeight);
    expectedContext.fillText('be wrapped', 0, lineHeight + lineHeight);
    const content = getDraftJSContentFromHTML('<p>paragraph text should be wrapped</p>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes two paragraph wrap test', () => {
    expectedContext.fillText('paragraph text should', 0, lineHeight);
    expectedContext.fillText('be wrapped', 0, lineHeight + lineHeight);
    expectedContext.fillText('paragraph', 0, lineHeight + lineHeight + lineHeight + paragraphSpace);
    const content = getDraftJSContentFromHTML('<p>paragraph text should be wrapped</p><p>paragraph</p>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes empty paragraph test', () => {
    expectedContext.fillText('Second line', 0, lineHeight + paragraphSpace + lineHeight);
    const emptyBlock = [createEmptyBlock()];
    const secondBlock = convertFromHTML('<p>Second line</p>').contentBlocks;
    const mergedBlocks = emptyBlock.concat(secondBlock);
    const content = ContentState.createFromBlockArray(mergedBlocks, {});
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes two empty paragraph test', () => {
    expectedContext.fillText('Third line', 0, lineHeight + lineHeight + lineHeight + paragraphSpace);
    const emptyBlocks = [createEmptyBlock(), createEmptyBlock()];
    const thirdBlock = convertFromHTML('<p>Third line</p>').contentBlocks;
    const mergedBlocks = emptyBlocks.concat(thirdBlock);
    const content = ContentState.createFromBlockArray(mergedBlocks, {});
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes empty paragraph between test', () => {
    expectedContext.fillText('First line', 0, lineHeight);
    expectedContext.fillText('Third line', 0, lineHeight + lineHeight + lineHeight + paragraphSpace);
    const firstBlock = convertFromHTML('<p>First line</p>').contentBlocks;
    const emptyBlock = [createEmptyBlock()];
    const thirdBlock = convertFromHTML('<p>Third line</p>').contentBlocks;
    const mergedBlocks = firstBlock.concat(emptyBlock).concat(thirdBlock);
    const content = ContentState.createFromBlockArray(mergedBlocks, {});
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('passes paragraph extra spaces test', () => {
    expectedContext.fillText('Paragraph', 0, lineHeight);
    expectedContext.fillText('with space', 0, lineHeight + lineHeight + paragraphSpace);
    const content = getDraftJSContentFromHTML('<p>Paragraph </p><p>with space</p>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('resizes canvas to fit text', () => {
    expectedContext.fillText('Visible', 0, lineHeight);
    expectedContext.fillText('Overflow', 0, lineHeight + lineHeight + paragraphSpace);
    const content = getDraftJSContentFromHTML('<p>Visible</p><p>Overflow</p>');
    const { offscreens } = writeText2(actualCanvas, content, textOptions);
    expect(getPixelDifference(expectedContext, offscreens[0], diffContext, canvasWidth, canvasHeight)).toEqual(0);
  });

  it('returns single word metadata', () => {
    const content = getDraftJSContentFromHTML('metadata');
    const singleWordWidth = expectedContext.measureText('metadata').width;
    const expectedWordsMetadata = [
      {
        word: 'metadata',
        lineNumber: 0,
        rect: {
          top: 0,
          right: singleWordWidth,
          bottom: lineHeight,
          left: 0,
        },
      },
    ];
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(1);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns multiple words metadata', () => {
    const content = getDraftJSContentFromHTML('multiple word metadata');
    const firstWordWidth = expectedContext.measureText('multiple').width;
    const secondWordWidth = expectedContext.measureText('word').width;
    const thirdWordWidth = expectedContext.measureText('metadata').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const thirdWordStart = secondWordStart + secondWordWidth + spaceWidth;
    const expectedWordsMetadata = [
      {
        word: 'multiple',
        lineNumber: 0,
        rect: {
          top: 0,
          right: firstWordWidth,
          bottom: lineHeight,
          left: 0,
        },
      },
      {
        word: 'word',
        lineNumber: 0,
        rect: {
          top: 0,
          right: secondWordStart + secondWordWidth,
          bottom: lineHeight,
          left: secondWordStart,
        },
      },
      {
        word: 'metadata',
        lineNumber: 0,
        rect: {
          top: 0,
          right: thirdWordStart + thirdWordWidth,
          bottom: lineHeight,
          left: thirdWordStart,
        },
      },
    ];
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(1);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns multiple line metadata', () => {
    const content = getDraftJSContentFromHTML('multiple word metadata that should be wrapped');
    const firstWordWidth = expectedContext.measureText('that').width;
    const secondWordWidth = expectedContext.measureText('should').width;
    const thirdWordWidth = expectedContext.measureText('be').width;
    const fourthWordWidth = expectedContext.measureText('wrapped').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const thirdWordStart = secondWordStart + secondWordWidth + spaceWidth;
    const fourthWordStart = thirdWordStart + thirdWordWidth + spaceWidth;
    const expectedWordsMetadata = [
      {
        word: 'that',
        lineNumber: 1,
        rect: {
          top: lineHeight,
          right: firstWordWidth,
          bottom: lineHeight + lineHeight,
          left: 0,
        },
      },
      {
        word: 'should',
        lineNumber: 1,
        rect: {
          top: lineHeight,
          right: secondWordStart + secondWordWidth,
          bottom: lineHeight + lineHeight,
          left: secondWordStart,
        },
      },
      {
        word: 'be',
        lineNumber: 1,
        rect: {
          top: lineHeight,
          right: thirdWordStart + thirdWordWidth,
          bottom: lineHeight + lineHeight,
          left: thirdWordStart,
        },
      },
      {
        word: 'wrapped',
        lineNumber: 1,
        rect: {
          top: lineHeight,
          right: fourthWordStart + fourthWordWidth,
          bottom: lineHeight + lineHeight,
          left: fourthWordStart,
        },
      },
    ];
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata).toEqual(expect.arrayContaining(expectedWordsMetadata));
    expect(actualTextMetadata.linesMetadata.length).toEqual(2);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns multiple paragraph metadata', () => {
    const content = getDraftJSContentFromHTML('<p>paragraph1 text</p><p>paragraph2 text</p>');
    const firstWordWidth = expectedContext.measureText('paragraph1').width;
    const secondWordWidth = expectedContext.measureText('text').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const expectedWordsMetadata = [
      {
        word: 'paragraph1',
        lineNumber: 0,
        rect: {
          top: 0,
          right: firstWordWidth,
          bottom: lineHeight,
          left: 0,
        },
      },
      {
        word: 'text',
        lineNumber: 0,
        rect: {
          top: 0,
          right: secondWordStart + secondWordWidth,
          bottom: lineHeight,
          left: secondWordStart,
        },
      },
      {
        word: 'paragraph2',
        lineNumber: 1,
        rect: {
          top: lineHeight + paragraphSpace,
          right: firstWordWidth,
          bottom: lineHeight + paragraphSpace + lineHeight,
          left: 0,
        },
      },
      {
        word: 'text',
        lineNumber: 1,
        rect: {
          top: lineHeight + paragraphSpace,
          right: secondWordStart + secondWordWidth,
          bottom: lineHeight + paragraphSpace + lineHeight,
          left: secondWordStart,
        },
      },
    ];
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(2);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns paragraph wrap metadata', () => {
    const content = getDraftJSContentFromHTML('<p>paragraph text should be wrapped</p>');
    const lastWordWidth = expectedContext.measureText('be').width;
    const expectedWordsMetadata = {
      word: 'be',
      lineNumber: 1,
      rect: {
        top: lineHeight,
        right: lastWordWidth,
        bottom: lineHeight + lineHeight,
        left: 0,
      },
    };
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata[3]).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(2);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns empty paragraph metadata', () => {
    const emptyBlock = [createEmptyBlock()];
    const secondBlock = convertFromHTML('<p>Second</p>').contentBlocks;
    const mergedBlocks = emptyBlock.concat(secondBlock);
    const content = ContentState.createFromBlockArray(mergedBlocks, {});
    const firstWordWidth = expectedContext.measureText('Second').width;
    const expectedWordsMetadata = {
      word: 'Second',
      lineNumber: 0,
      rect: {
        top: lineHeight + paragraphSpace,
        right: firstWordWidth,
        bottom: lineHeight + paragraphSpace + lineHeight,
        left: 0,
      },
    };
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata[0]).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(1);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns two empty paragraph metadata', () => {
    const emptyBlocks = [createEmptyBlock(), createEmptyBlock()];
    const thirdBlock = convertFromHTML('<p>Third</p>').contentBlocks;
    const mergedBlocks = emptyBlocks.concat(thirdBlock);
    const content = ContentState.createFromBlockArray(mergedBlocks, {});
    const firstWordWidth = expectedContext.measureText('Third').width;
    const expectedWordsMetadata = {
      word: 'Third',
      lineNumber: 0,
      rect: {
        top: lineHeight + lineHeight + paragraphSpace,
        right: firstWordWidth,
        bottom: lineHeight + lineHeight + lineHeight + paragraphSpace,
        left: 0,
      },
    };
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata[0]).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(1);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns empty paragraph between metadata', () => {
    const firstBlock = convertFromHTML('<p>First</p>').contentBlocks;
    const emptyBlock = [createEmptyBlock()];
    const thirdBlock = convertFromHTML('<p>Third</p>').contentBlocks;
    const mergedBlocks = firstBlock.concat(emptyBlock).concat(thirdBlock);
    const content = ContentState.createFromBlockArray(mergedBlocks, {});
    const firstWordWidth = expectedContext.measureText('First').width;
    const thirdWordWidth = expectedContext.measureText('Third').width;
    const expectedWordsMetadata = [
      {
        word: 'First',
        lineNumber: 0,
        rect: {
          top: 0,
          right: firstWordWidth,
          bottom: lineHeight,
          left: 0,
        },
      },
      {
        word: 'Third',
        lineNumber: 1,
        rect: {
          top: lineHeight + lineHeight + paragraphSpace,
          right: thirdWordWidth,
          bottom: lineHeight + lineHeight + lineHeight + paragraphSpace,
          left: 0,
        },
      },
    ];
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.linesMetadata.length).toEqual(2);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns two paragraph wrap metadata', () => {
    const content = getDraftJSContentFromHTML('<p>paragraph text should be wrapped</p><p>paragraph</p>');
    const wrappedWordWidth = expectedContext.measureText('be').width;
    const expectedWordsMetadata = {
      word: 'be',
      lineNumber: 1,
      rect: {
        top: lineHeight,
        right: wrappedWordWidth,
        bottom: lineHeight + lineHeight,
        left: 0,
      },
    };
    const actualTextMetadata = writeText2(actualCanvas, content, textOptions, { paragraphSpace });
    expect(actualTextMetadata.wordsMetadata[3]).toEqual(expectedWordsMetadata);
    expect(actualTextMetadata.pagesMetadata.length).toEqual(1);
  });

  it('returns text metadata', () => {
    const textMetadata = writeText2(actualCanvas, exampleText.contentState, textOptions, { paragraphSpace });
    expect(textMetadata.wordsMetadata.length).toEqual(exampleText.wordCount);
    expect(textMetadata.linesMetadata.length).toEqual(38);
    expect(textMetadata.pagesMetadata.length).toEqual(8);
    expect(textMetadata.offscreens.length).toEqual(8);
  });
});
