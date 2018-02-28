/* eslint-disable func-names */
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { ContentState, convertFromHTML } from 'draft-js';
import { writeText } from './CanvasUtils';

// eslint-disable-next-line no-unused-vars
const imgOutputFolder = `${__dirname}/../../test/output`;

// To get test name in Jasmine
/*
let testName = '';
jasmine.getEnv().addReporter({
  specStarted: (result) => {
    testName = result.fullName;
  }
});
*/

function getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight) {
  const expectedImage = expectedContext.getImageData(0, 0, canvasWidth, canvasHeight);
  const actualImage = actualContext.getImageData(0, 0, canvasWidth, canvasHeight);
  const diffImage = diffContext.createImageData(canvasWidth, canvasHeight);
  const pixelDiff = pixelmatch(expectedImage.data, actualImage.data, diffImage.data, canvasWidth, canvasHeight);
  diffContext.putImageData(diffImage, 0, 0);
  return pixelDiff;
}

// eslint-disable-next-line no-unused-vars
function outputPNG(canvas, filePath) {
  const data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(data, 'base64');
  fs.writeFile(filePath, buffer, (err) => {
    if (err) return console.log(err);
    return 0;
  });
}

function getDraftJSContentFromHTML(html) {
  const blocksFromHTML = convertFromHTML(html);
  return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
}

describe('CanvasUtils', () => {
  const expectedCanvas = document.createElement('canvas');
  const actualCanvas = document.createElement('canvas');
  const diffCanvas = document.createElement('canvas');
  const canvasWidth = 250;
  const canvasHeight = 50;
  const fontSize = 16;
  const lineHeight = fontSize + 4;
  const paragraphSpace = 10;
  const font = 'Calibri';
  const textBaseline = 'bottom';
  const expectedContext = expectedCanvas.getContext('2d');
  const actualContext = actualCanvas.getContext('2d');
  const diffContext = diffCanvas.getContext('2d');

  before(() => {
    expectedCanvas.width = canvasWidth; expectedCanvas.height = canvasHeight;
    actualCanvas.width = canvasWidth; actualCanvas.height = canvasHeight;
    diffCanvas.width = canvasWidth; diffCanvas.height = canvasHeight;
    expectedContext.font = `${fontSize}pt ${font}`; expectedContext.textBaseline = textBaseline;
    actualContext.font = `${fontSize}pt ${font}`; actualContext.textBaseline = textBaseline;
    diffContext.font = `${fontSize}pt ${font}`; diffContext.textBaseline = textBaseline;
  });

  beforeEach(() => {
    expectedContext.clearRect(0, 0, canvasWidth, canvasHeight);
    actualContext.clearRect(0, 0, canvasWidth, canvasHeight);
    diffContext.clearRect(0, 0, canvasWidth, canvasHeight);
  });

  afterEach(function () {
    // Reset any applied styling
    expectedContext.font = `${fontSize}pt ${font}`; expectedContext.textBaseline = textBaseline;
    actualContext.font = `${fontSize}pt ${font}`; actualContext.textBaseline = textBaseline;
    diffContext.font = `${fontSize}pt ${font}`; diffContext.textBaseline = textBaseline;

    const testName = `CanvasUtils ${this.currentTest.title}`;
    outputPNG(diffCanvas, `${imgOutputFolder}/diff/${testName}.png`);

    /*
    // When required, output actual and expected images
    outputPNG(expectedCanvas, `${imgOutputFolder}/expected/${testName}.png`);
    outputPNG(actualCanvas,  `${imgOutputFolder}/actual/${testName}.png`);
    */
  });

  it('exists', () => {
    expect(actualCanvas).to.not.equal(undefined);
  });

  it('passes similarity test', () => {
    expectedContext.fillText('expected', 0, lineHeight);
    actualContext.fillText('expected', 0, lineHeight);
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('passes difference test', () => {
    expectedContext.fillText('expected', 0, lineHeight);
    actualContext.fillText('actual', 0, lineHeight);
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).not.to.equal(0);
  });

  it('passes letter-by-letter test', () => {
    expectedContext.fillText('letter-by-letter', 0, lineHeight);
    const content = ContentState.createFromText('letter-by-letter');
    writeText(actualContext, content, { lineHeight });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('passes bold style test', () => {
    expectedContext.font = `bold ${expectedContext.font}`;
    expectedContext.fillText('bold test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<b>bold test</b>');
    writeText(actualContext, content, { lineHeight });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('passes italic style test', () => {
    expectedContext.font = `italic ${expectedContext.font}`;
    expectedContext.fillText('italic test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<i>italic test</i>');
    writeText(actualContext, content, { lineHeight });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('passes bold italic style test', () => {
    expectedContext.font = `bold italic ${expectedContext.font}`;
    expectedContext.fillText('bold italic test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<b><i>bold italic test</i></b>');
    writeText(actualContext, content, { lineHeight });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
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
    writeText(actualContext, content, { lineHeight });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('passes text wrap test', () => {
    expectedContext.fillText('this is a multiline text that', 0, lineHeight);
    expectedContext.fillText('should be wrapped', 0, lineHeight + lineHeight);
    const content = getDraftJSContentFromHTML('this is a multiline text that should be wrapped');
    writeText(actualContext, content, { lineHeight });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('passes multiple paragraph test', () => {
    expectedContext.fillText('paragraph1 text', 0, lineHeight);
    expectedContext.fillText('paragraph2 text', 0, lineHeight + paragraphSpace + lineHeight);
    const content = getDraftJSContentFromHTML('<p>paragraph1 text</p><p>paragraph2 text</p>');
    writeText(actualContext, content, { lineHeight, paragraphSpace });
    expect(getPixelDifference(expectedContext, actualContext, diffContext, canvasWidth, canvasHeight)).to.equal(0);
  });

  it('returns single word metadata', () => {
    const content = getDraftJSContentFromHTML('metadata');
    const singleWordWidth = expectedContext.measureText('metadata').width;
    const expectedWordMetadata = [
      ['metadata', 0, singleWordWidth, lineHeight],
    ];
    const actualTextMetadata = writeText(actualContext, content, { lineHeight });
    expect(actualTextMetadata.wordMetadata).to.eql(expectedWordMetadata);
    expect(actualTextMetadata.lines.length).to.equal(1);
  });

  it('returns multiple words metadata', () => {
    const content = getDraftJSContentFromHTML('multiple word metadata');
    const firstWordWidth = expectedContext.measureText('multiple').width;
    const secondWordWidth = expectedContext.measureText('word').width;
    const thirdWordWidth = expectedContext.measureText('metadata').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const thirdWordStart = secondWordStart + secondWordWidth + spaceWidth;
    const expectedWordMetadata = [
      ['multiple', 0, firstWordWidth, lineHeight],
      ['word', secondWordStart, secondWordStart + secondWordWidth, lineHeight],
      ['metadata', thirdWordStart, thirdWordStart + thirdWordWidth, lineHeight],
    ];
    const actualTextMetadata = writeText(actualContext, content, { lineHeight });
    expect(actualTextMetadata.wordMetadata).to.eql(expectedWordMetadata);
    expect(actualTextMetadata.lines.length).to.equal(1);
  });

  it('returns multiple line metadata', () => {
    const content = getDraftJSContentFromHTML('multiple word metadata that should be wrapped');
    const firstWordWidth = expectedContext.measureText('should').width;
    const secondWordWidth = expectedContext.measureText('be').width;
    const thirdWordWidth = expectedContext.measureText('wrapped').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const thirdWordStart = secondWordStart + secondWordWidth + spaceWidth;
    const expectedWordMetadata = [
      ['should', 0, firstWordWidth, lineHeight + lineHeight],
      ['be', secondWordStart, secondWordStart + secondWordWidth, lineHeight + lineHeight],
      ['wrapped', thirdWordStart, thirdWordStart + thirdWordWidth, lineHeight + lineHeight],
    ];
    const actualTextMetadata = writeText(actualContext, content, { lineHeight });
    expect(actualTextMetadata.wordMetadata).to.include.deep.members(expectedWordMetadata);
    expect(actualTextMetadata.lines.length).to.equal(2);
  });

  it('returns multiple paragraph metadata', () => {
    const content = getDraftJSContentFromHTML('<p>paragraph1 text</p><p>paragraph2 text</p>');
    const firstWordWidth = expectedContext.measureText('paragraph1').width;
    const secondWordWidth = expectedContext.measureText('text').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const expectedWordMetadata = [
      ['paragraph1', 0, firstWordWidth, lineHeight],
      ['text', secondWordStart, secondWordStart + secondWordWidth, lineHeight],
      ['paragraph2', 0, firstWordWidth, lineHeight + paragraphSpace + lineHeight],
      ['text', secondWordStart, secondWordStart + secondWordWidth, lineHeight + paragraphSpace + lineHeight],
    ];
    const actualTextMetadata = writeText(actualContext, content, { lineHeight, paragraphSpace });
    expect(actualTextMetadata.wordMetadata).to.eql(expectedWordMetadata);
    expect(actualTextMetadata.lines.length).to.equal(2);
  });
});
