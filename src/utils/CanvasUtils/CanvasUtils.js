export const WordMetadata = {
  Word: 0,
  StartX: 1,
  EndX: 2,
  StartY: 3,
};

export const LineMetadata = {
  CharacterCount: 0,
  AverageCharacterWidth: 1,
  StartX: 2,
  EndX: 3,
};

const getCanvasFont = (defaultStyle, nextStyle) => {
  let result = defaultStyle;
  if (nextStyle.contains('BOLD')) {
    result = `bold ${result}`;
  }
  if (nextStyle.contains('ITALIC')) {
    result = `italic ${result}`;
  }
  return result;
};

export const drawText = (canvasContext, textMetadata) => {
  const { wordsMetadata } = textMetadata;
  wordsMetadata.forEach((wordMetadata) => {
    canvasContext.fillText(wordMetadata[WordMetadata.Word], wordMetadata[WordMetadata.StartX], wordMetadata[WordMetadata.StartY]);
  });
};

export const measureText = (text, style) => {
  const span = document.createElement('span');
  let div = document.createElement('div');
  const block = document.createElement('div');

  block.style.display = 'inline-block';
  block.style.width = '1px';
  block.style.height = '0';

  div.style.visibility = 'hidden';
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '500px';
  div.style.height = '200px';

  div.appendChild(span);
  div.appendChild(block);
  document.body.appendChild(div);
  const result = {};
  try {
    span.setAttribute('style', style);

    span.innerHTML = '';
    span.appendChild(document.createTextNode(text.replace(/\s/g, String.fromCharCode(160))));

    block.style.verticalAlign = 'baseline';
    result.ascent = (block.offsetTop - span.offsetTop);
    block.style.verticalAlign = 'bottom';
    result.height = (block.offsetTop - span.offsetTop);
    result.descent = result.height - result.ascent;
    result.width = span.offsetWidth;
  } finally {
    div.parentNode.removeChild(div);
    div = null;
  }
  return result;
};

const setCanvasHeight = (oldContext, newHeight) => {
  const { canvas, font, textBaseline } = oldContext;
  const tempCanvas = document.createElement('canvas');
  const tempContext = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempContext.drawImage(canvas, 0, 0);
  canvas.height = newHeight;
  const newContext = canvas.getContext('2d');
  newContext.font = font;
  newContext.textBaseline = textBaseline;
  newContext.drawImage(tempCanvas, 0, 0);
};

export const writeText = (canvasContext, content, textOptions = { lineHeight: 20, paragraphSpace: 5 }) => {
  const canvasWidth = canvasContext.canvas.width;
  const canvasHeight = canvasContext.canvas.height;
  const text = content.getPlainText('\n').replace(/\n/g, '');
  let currentBlock = content.getFirstBlock();
  let currentBlockKey = currentBlock.getKey();
  let characterMetadata = currentBlock.getCharacterList();
  let currentBlockLength = currentBlock.getText().length;
  let previousBlocksLength = 0;
  const defaultStyle = canvasContext.font;
  /*
    WordMetadata: [word, startPosition, endPosition, lineNumber][]
  */
  const wordMetadata = [];
  const lines = [];
  const letters = text.split('');
  const textLength = letters.length;
  let currentStyle = defaultStyle;
  let spaceWidth = canvasContext.measureText(' ').width;
  let currentWord = '';
  let wordStartPosition = 0;
  let fillXStart = 0;
  let fillYStart = textOptions.lineHeight;
  let fillText = '';

  const nextBlock = () => {
    previousBlocksLength += currentBlockLength;
    currentBlock = content.getBlockAfter(currentBlockKey);
    currentBlockKey = currentBlock.getKey();
    characterMetadata = currentBlock.getCharacterList();
    currentBlockLength = currentBlock.getText().length;
  };

  const newLine = ({ additionalSpacing = 0, overflowText = '' }) => {
    fillXStart = 0;
    fillYStart += textOptions.lineHeight + additionalSpacing;
    fillText = overflowText;
    wordStartPosition = 0;
  };

  const draw = () => {
    const { canvas } = canvasContext;
    if (fillYStart > canvas.height) {
      // Increase canvas size, when text doesn't fit anymore
      setCanvasHeight(canvasContext, canvas.height + 500);
    }
    canvasContext.fillText(fillText, fillXStart, fillYStart);
  };

  const addWordMetadata = () => {
    const wordWidth = canvasContext.measureText(currentWord).width;
    wordMetadata.push([currentWord, wordStartPosition, wordStartPosition + wordWidth, fillYStart]);
    currentWord = '';
  };
  // console.log(content.getBlockMap().toArray()[0].getCharacterList());

  letters.forEach((currentLetter, letterIndex) => {
    // Check if block has ended
    if (letterIndex === previousBlocksLength + currentBlockLength) {
      if (fillText !== '') {
        const fillTextWidth = canvasContext.measureText(fillText).width;
        if (fillXStart + fillTextWidth > canvasWidth) {
          const word = fillText.substring(fillText.substring(0, fillText.length - 1).lastIndexOf(' ') + 1, fillText.length);
          fillText = fillText.substring(0, fillText.substring(0, fillText.length - 1).lastIndexOf(' '));
          draw();
          lines.push(fillYStart);
          newLine({ overflowText: word });
        }
        draw();
        lines.push(fillYStart);
        addWordMetadata();
      }
      nextBlock();
      newLine({ additionalSpacing: textOptions.paragraphSpace });
      while (currentBlockLength === 0) {
        nextBlock();
        newLine({});
      }
    }
    // Check if style has changed
    const styledBlock = characterMetadata.get(letterIndex - previousBlocksLength);
    const nextStyle = styledBlock.getStyle();
    if (currentStyle !== nextStyle) {
      // Draw previous styled text
      draw();
      const fillTextWidth = canvasContext.measureText(fillText).width;
      fillXStart += fillTextWidth;
      fillText = currentLetter;
      // Update with new style
      canvasContext.font = getCanvasFont(defaultStyle, nextStyle); // eslint-disable-line no-param-reassign
      spaceWidth = canvasContext.measureText(' ').width;
      currentStyle = nextStyle;
    } else {
      fillText += currentLetter;
    }
    if (currentLetter === ' ') {
      // Word ended
      // Check if it fits in current line
      const wordWidth = canvasContext.measureText(currentWord).width;
      if (wordStartPosition + wordWidth > canvasWidth) {
        fillText = fillText.substring(0, fillText.substring(0, fillText.length - 1).lastIndexOf(' '));
        draw();
        lines.push(fillYStart);
        newLine({ overflowText: `${currentWord} ` });
      }
      addWordMetadata();
      wordStartPosition = wordStartPosition + spaceWidth + wordWidth;
    } else {
      currentWord += currentLetter;
      // Check if text has ended
      if (letterIndex + 1 === textLength) {
        // Draw all remaining text
        const fillTextWidth = canvasContext.measureText(fillText).width;
        if (fillXStart + fillTextWidth > canvasWidth) {
          const word = fillText.substring(fillText.substring(0, fillText.length - 1).lastIndexOf(' ') + 1, fillText.length);
          fillText = fillText.substring(0, fillText.substring(0, fillText.length - 1).lastIndexOf(' '));
          draw();
          lines.push(fillYStart);
          newLine({ overflowText: word });
          draw();
        } else {
          draw();
        }
        // Add remaining word metadata
        addWordMetadata();
      }
    }
  });
  const textHeight = wordMetadata[wordMetadata.length - 1][WordMetadata.StartY];
  if (textHeight > canvasHeight) {
    setCanvasHeight(canvasContext, textHeight);
  }
  lines.push(fillYStart);
  return { wordMetadata, lines };
};

export const getLineMetadata = (textMetadata) => {
  const lineMetadata = [];
  let line = textMetadata.wordMetadata[0][WordMetadata.StartY];
  let lineLength = 0;
  let lineStartX = textMetadata.wordMetadata[0][WordMetadata.StartX];
  let lineEndX = textMetadata.wordMetadata[0][WordMetadata.EndX];
  textMetadata.wordMetadata.forEach((wordMetadata) => {
    if (line === wordMetadata[WordMetadata.StartY]) {
      // Same line
      lineLength += wordMetadata[WordMetadata.Word].length;
      lineEndX = Math.round(wordMetadata[WordMetadata.EndX]);
    } else {
      // New line
      lineMetadata.push([lineLength, (lineEndX - lineStartX) / lineLength, lineStartX, lineEndX]);
      lineStartX = wordMetadata[WordMetadata.StartX];
      lineEndX = wordMetadata[WordMetadata.EndX];
      lineLength = wordMetadata[WordMetadata.Word].length;
      line = wordMetadata[WordMetadata.StartY];
    }
  });
  lineMetadata.push([lineLength, (lineEndX - lineStartX) / lineLength, lineStartX, lineEndX]);
  return lineMetadata;
};
