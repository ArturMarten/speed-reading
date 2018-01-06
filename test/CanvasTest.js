import {writeText} from '../src/utils/Canvas';
import {ContentState, convertFromHTML} from 'draft-js';

describe('Canvas', () => {
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
  let expectedContext = expectedCanvas.getContext('2d');
  let actualContext = actualCanvas.getContext('2d');
  let diffContext = diffCanvas.getContext('2d');

  before(function() {
    expectedCanvas.width = canvasWidth; expectedCanvas.height = canvasHeight;
    actualCanvas.width = canvasWidth; actualCanvas.height = canvasHeight;
    diffCanvas.width = canvasWidth; diffCanvas.height = canvasHeight;
    expectedContext.font = fontSize + 'pt ' + font; expectedContext.textBaseline = textBaseline;
    actualContext.font = fontSize + 'pt ' + font; actualContext.textBaseline = textBaseline;
    diffContext.font = fontSize + 'pt ' + font; diffContext.textBaseline = textBaseline;
  });

  beforeEach(function() {
    expectedContext.clearRect(0, 0, canvasWidth, canvasHeight);
    actualContext.clearRect(0, 0, canvasWidth, canvasHeight);
    diffContext.clearRect(0, 0, canvasWidth, canvasHeight);
  });

  afterEach(function() {
    // console.log(this.currentTest);
    // Reset any applied styling
    expectedContext.font = fontSize + 'pt ' + font; expectedContext.textBaseline = textBaseline;
    actualContext.font = fontSize + 'pt ' + font; actualContext.textBaseline = textBaseline;
    diffContext.font = fontSize + 'pt ' + font; diffContext.textBaseline = textBaseline;
    outputPNG(diffCanvas, __dirname + '/output/diff/' + this.currentTest.title + '.png');
    if (this.currentTest.state !== 'passed') {
      // console.log(this.currentTest);
      outputPNG(expectedCanvas, __dirname + '/output/expected/' + this.currentTest.title + '.png');
      outputPNG(actualCanvas, __dirname + '/output/actual/' + this.currentTest.title + '.png');
    }
  });

  it('exists', () => {
    expect(actualCanvas).to.exist;
  });

  it('passes similarity test', () => {
    expectedContext.fillText('expected', 0, lineHeight);
    actualContext.fillText('expected', 0, lineHeight);
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes difference test', () => {
    expectedContext.fillText('expected', 0, lineHeight);
    actualContext.fillText('actual', 0, lineHeight);
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).not.to.equal(0);
  });

  it('passes letter-by-letter test', () => {
    expectedContext.fillText('letter-by-letter', 0, lineHeight);
    const content = ContentState.createFromText('letter-by-letter');
    writeText(actualContext, content, {lineHeight: lineHeight});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes bold style test', () => {
    expectedContext.font = 'bold ' + expectedContext.font;
    expectedContext.fillText('bold test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<b>bold test</b>');
    writeText(actualContext, content, {lineHeight: lineHeight});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes italic style test', () => {
    expectedContext.font = 'italic ' + expectedContext.font;
    expectedContext.fillText('italic test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<i>italic test</i>');
    writeText(actualContext, content, {lineHeight: lineHeight});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes bold italic style test', () => {
    expectedContext.font = 'bold italic ' + expectedContext.font;
    expectedContext.fillText('bold italic test', 0, lineHeight);
    const content = getDraftJSContentFromHTML('<b><i>bold italic test</i></b>');
    writeText(actualContext, content, {lineHeight: lineHeight});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes style change test', () => {
    const defaultStyle = expectedContext.font;
    expectedContext.font = 'bold ' + expectedContext.font;
    expectedContext.fillText('style', 0, lineHeight);
    const position = expectedContext.measureText('style').width;
    expectedContext.font = defaultStyle;
    expectedContext.fillText(' change test', position, lineHeight);
    const content = getDraftJSContentFromHTML('<b>style</b> change test');
    writeText(actualContext, content, {lineHeight: lineHeight});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes text wrap test', () => {
    expectedContext.fillText('this is a multiline text that', 0, lineHeight);
    expectedContext.fillText('should be wrapped', 0, lineHeight + lineHeight);
    const content = getDraftJSContentFromHTML('this is a multiline text that should be wrapped');
    writeText(actualContext, content, {lineHeight: lineHeight});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('passes multiple paragraph test', () => {
    expectedContext.fillText('paragraph1 text', 0, lineHeight);
    expectedContext.fillText('paragraph2 text', 0, lineHeight + paragraphSpace + lineHeight);
    const content = getDraftJSContentFromHTML('<p>paragraph1 text</p><p>paragraph2 text</p>');
    writeText(actualContext, content, {lineHeight: lineHeight, paragraphSpace: paragraphSpace});
    expect(getPixelDifference(expectedContext, actualContext, diffContext)).to.equal(0);
  });

  it('returns single word metadata', () => {
    const content = getDraftJSContentFromHTML('metadata');
    const singleWordWidth = expectedContext.measureText('metadata').width;
    const expectedTextMetadata = [
      ['metadata', 0, singleWordWidth, lineHeight]
    ];
    const actualTextMetadata = writeText(actualContext, content, {lineHeight: lineHeight});
    expect(actualTextMetadata).to.eql(expectedTextMetadata);
  });

  it('returns multiple words metadata', () => {
    const content = getDraftJSContentFromHTML('multiple word metadata');
    const firstWordWidth = expectedContext.measureText('multiple').width;
    const secondWordWidth = expectedContext.measureText('word').width;
    const thirdWordWidth = expectedContext.measureText('metadata').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const thirdWordStart = secondWordStart + secondWordWidth + spaceWidth;
    const expectedTextMetadata = [
      ['multiple', 0, firstWordWidth, lineHeight],
      ['word', secondWordStart, secondWordStart + secondWordWidth, lineHeight],
      ['metadata', thirdWordStart, thirdWordStart + thirdWordWidth, lineHeight]
    ];
    const actualTextMetadata = writeText(actualContext, content, {lineHeight: lineHeight});
    expect(actualTextMetadata).to.eql(expectedTextMetadata);
  });

  it('returns multiple line metadata', () => {
    const content = getDraftJSContentFromHTML('multiple word metadata that should be wrapped');
    const firstWordWidth = expectedContext.measureText('should').width;
    const secondWordWidth = expectedContext.measureText('be').width;
    const thirdWordWidth = expectedContext.measureText('wrapped').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const thirdWordStart = secondWordStart + secondWordWidth + spaceWidth;
    const expectedTextMetadata = [
      ['should', 0, firstWordWidth, lineHeight + lineHeight],
      ['be', secondWordStart, secondWordStart + secondWordWidth, lineHeight + lineHeight],
      ['wrapped', thirdWordStart, thirdWordStart + thirdWordWidth, lineHeight + lineHeight]
    ];
    const actualTextMetadata = writeText(actualContext, content, {lineHeight: lineHeight});
    expect(actualTextMetadata).to.include.deep.members(expectedTextMetadata);
  });

  it('returns multiple paragraph metadata', () => {
    const content = getDraftJSContentFromHTML('<p>paragraph1 text</p><p>paragraph2 text</p>');
    const firstWordWidth = expectedContext.measureText('paragraph1').width;
    const secondWordWidth = expectedContext.measureText('text').width;
    const spaceWidth = expectedContext.measureText(' ').width;
    const secondWordStart = firstWordWidth + spaceWidth;
    const expectedTextMetadata = [
      ['paragraph1', 0, firstWordWidth, lineHeight],
      ['text', secondWordStart, secondWordStart + secondWordWidth, lineHeight],
      ['paragraph2', 0, firstWordWidth, lineHeight + paragraphSpace + lineHeight],
      ['text', secondWordStart, secondWordStart + secondWordWidth, lineHeight + paragraphSpace + lineHeight]
    ];
    const actualTextMetadata = writeText(actualContext, content, {lineHeight: lineHeight, paragraphSpace: paragraphSpace});
    expect(actualTextMetadata).to.eql(expectedTextMetadata);
  });

  function getPixelDifference(expectedContext, actualContext, diffContext) {
    const expectedImage = expectedContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const actualImage = actualContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const diffImage = diffContext.createImageData(canvasWidth, canvasHeight);
    const pixelDiff = pixelmatch(expectedImage.data, actualImage.data, diffImage.data, canvasWidth, canvasHeight);
    diffContext.putImageData(diffImage, 0, 0);
    return pixelDiff;
  }

  function outputPNG(canvas, filePath) {
    const data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    const buffer = new Buffer(data, 'base64');
    fs.writeFile(filePath, buffer, (err) => {
      if(err) return console.log(err);
    });
  }

  function getDraftJSContentFromHTML(html) {
    const blocksFromHTML = convertFromHTML(html);
    return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
  }
});
