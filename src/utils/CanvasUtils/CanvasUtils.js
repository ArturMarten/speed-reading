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

function getCanvasFont(defaultStyle, nextStyle) {
  let result = defaultStyle;
  if (nextStyle.contains('BOLD')) {
    result = `bold ${result}`;
  }
  if (nextStyle.contains('ITALIC')) {
    result = `italic ${result}`;
  }
  return result;
}

export function writeText(canvasContext, content, textOptions = { lineHeight: 20, paragraphSpace: 5 }) {
  const canvasWidth = canvasContext.canvas.width;
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
  const lines = [textOptions.lineHeight];
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
    lines.push(fillYStart);
  };

  const draw = () => {
    // console.log(fillText, fillXStart, fillYStart);
    canvasContext.fillText(fillText, fillXStart, fillYStart);
  };

  const addWordMetadata = () => {
    const wordWidth = canvasContext.measureText(currentWord).width;
    wordMetadata.push([currentWord, wordStartPosition, wordStartPosition + wordWidth, fillYStart]);
    currentWord = '';
  };
  // console.log(content.getBlockMap().toArray()[0].getCharacterList());

  letters.forEach((currentLetter, letterIndex) => {
    if (letterIndex === previousBlocksLength + currentBlockLength) {
      // Block ended
      nextBlock();
      while (currentBlockLength === 0) {
        newLine({});
        nextBlock();
      }
      draw();
      addWordMetadata();
      newLine({ additionalSpacing: textOptions.paragraphSpace });
    }
    const styledBlock = characterMetadata.get(letterIndex - previousBlocksLength);
    const nextStyle = styledBlock.getStyle();
    if (currentStyle !== nextStyle) {
      // Style changed
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
        newLine({ overflowText: `${currentWord} ` });
      }
      addWordMetadata();
      wordStartPosition = wordStartPosition + spaceWidth + wordWidth;
    } else {
      currentWord += currentLetter;
      if (letterIndex + 1 === textLength) {
        // Text ended
        // Draw all remaining text
        const fillTextWidth = canvasContext.measureText(fillText).width;
        draw();
        fillXStart = fillTextWidth;
        fillText = currentLetter;
        // Add remaining word metadata
        addWordMetadata();
        wordStartPosition = 0;
      }
    }
  });
  return { wordMetadata, lines };
}


export function getLineMetadata(textMetadata) {
  const lineMetadata = [];
  let line = textMetadata.wordMetadata[0][WordMetadata.StartY];
  let lineLength = 0;
  let lineStartX = textMetadata.wordMetadata[0][1];
  let lineEndX = textMetadata.wordMetadata[0][2];
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
}
