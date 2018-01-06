export function writeText(canvasContext, content, textOptions = {lineHeight: 20, paragraphSpace: 5}) {
  const canvasWidth = canvasContext.canvas.width;
  const text = content.getPlainText('\n').replace(/\n/g, '');
  let currentBlock = content.getFirstBlock();
  let currentBlockKey = currentBlock.getKey();
  let characterMetadata = currentBlock.getCharacterList();
  let blockLength = currentBlock.getText().length;
  let previousBlocksLength = 0;
  const defaultStyle = canvasContext.font;
  /*
    WordMetadata: [word, startPosition, endPosition, lineNumber][]
  */
  const wordMetadata = [];
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
    previousBlocksLength += blockLength;
    currentBlock = content.getBlockAfter(currentBlockKey);
    currentBlockKey = currentBlock.getKey();
    characterMetadata = currentBlock.getCharacterList();
    blockLength = currentBlock.getText().length;
  };

  const newLine = ({additionalSpacing = 0, text = ''}) => {
    fillXStart = 0;
    fillYStart += textOptions.lineHeight + additionalSpacing;
    fillText = text;
    wordStartPosition = 0;
  };

  const addWordMetadata = () => {
    const wordWidth = canvasContext.measureText(currentWord).width;
    wordMetadata.push([currentWord, wordStartPosition, wordStartPosition + wordWidth, fillYStart]);
    currentWord = '';
  };
  // console.log(content.getBlockMap().toArray()[0].getCharacterList());

  letters.forEach(
    (currentLetter, letterIndex) => {
      if (letterIndex === blockLength) {
        // Block ended
        nextBlock();
        canvasContext.fillText(fillText, fillXStart, fillYStart);
        addWordMetadata();
        newLine({additionalSpacing: textOptions.paragraphSpace});
      }
      const nextStyle = characterMetadata.get(letterIndex - previousBlocksLength).getStyle();
      if (currentStyle !== nextStyle) {
        // Style changed
        // Draw previous styled block
        canvasContext.fillText(fillText, fillXStart, fillYStart);
        const fillTextWidth = canvasContext.measureText(fillText).width;
        fillXStart = fillTextWidth;
        fillText = currentLetter;
        // Update with new style
        canvasContext.font = getCanvasFont(defaultStyle, nextStyle);
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
          canvasContext.fillText(fillText, fillXStart, fillYStart);
          newLine({text: currentWord + ' '});
        }
        addWordMetadata();
        wordStartPosition = wordStartPosition + spaceWidth + wordWidth;
      } else {
        currentWord += currentLetter;
        if (letterIndex + 1 === textLength) {
          // Text ended
          // Draw all remaining text
          const fillTextWidth = canvasContext.measureText(fillText).width;
          canvasContext.fillText(fillText, fillXStart, fillYStart);
          fillXStart = fillTextWidth;
          fillText = currentLetter;
          // Add remaining word metadata
          addWordMetadata();
          wordStartPosition = 0;
        }
      }
    }
  );
  return wordMetadata;
}

function getCanvasFont(defaultStyle, nextStyle) {
  let result = defaultStyle;
  if (nextStyle.contains('BOLD')) {
    result = 'bold ' + result;
  }
  if (nextStyle.contains('ITALIC')) {
    result = 'italic ' + result;
  }
  return result;
}
