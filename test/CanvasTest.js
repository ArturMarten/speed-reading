import {writeText} from '../src/utils/Canvas';

describe('Canvas', () => {
  const expectedCanvas = document.createElement('canvas');
  const actualCanvas = document.createElement('canvas');
  const diffCanvas = document.createElement('canvas');
  const canvasWidth = 200;
  const canvasHeight = 40;
  const fontSize = 16;
  const font = 'Calibri';
  const textBaseline = 'top';
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
    const data = diffCanvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    const buffer = new Buffer(data, 'base64');
    fs.writeFile(__dirname + '/output/' + this.currentTest.title + '.png', buffer, (err) => {
      if(err) return console.log(err);
    });
    if (this.currentTest.state !== 'passed') {
      // console.log(this.currentTest);
    }
  });

  it('exists', () => {
    expect(actualCanvas).to.exist;
  });

  it('passes similarity test', () => {
    expectedContext.fillText('expected', 0, 0);
    actualContext.fillText('expected', 0, 0);
    const expectedImage = expectedContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const actualImage = actualContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const diffImage = diffContext.createImageData(canvasWidth, canvasHeight);
    const pixelDiff = pixelmatch(expectedImage.data, actualImage.data, diffImage.data, canvasWidth, canvasHeight);
    diffContext.putImageData(diffImage, 0, 0);
    expect(pixelDiff).to.equal(0);
  });

  it('passes difference test', () => {
    expectedContext.fillText('expected', 0, 0);
    actualContext.fillText('actual', 0, 0);
    const expectedImage = expectedContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const actualImage = actualContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const diffImage = diffContext.createImageData(canvasWidth, canvasHeight);
    const pixelDiff = pixelmatch(expectedImage.data, actualImage.data, diffImage.data, canvasWidth, canvasHeight, {threshold: 0.01});
    diffContext.putImageData(diffImage, 0, 0);
    expect(pixelDiff).not.to.equal(0);
  });

  it('passes letter-by-letter test', () => {
    expectedContext.fillText('letter-by-letter', 0, 0);
    writeText(actualContext, 'letter-by-letter');
    const expectedImage = expectedContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const actualImage = actualContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const diffImage = diffContext.createImageData(canvasWidth, canvasHeight);
    const pixelDiff = pixelmatch(expectedImage.data, actualImage.data, diffImage.data, canvasWidth, canvasHeight);
    diffContext.putImageData(diffImage, 0, 0);
    expect(pixelDiff).to.equal(0);
  });
});
