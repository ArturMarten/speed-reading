import { convertFromHTML, ContentState } from 'draft-js';

/*
  Word coordinates
  (x1, y1) - Bottom left corner
  (x2, y2) - Top right corner
*/

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
    canvasContext.fillText(wordMetadata.word, wordMetadata.x1, wordMetadata.y1);
  });
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

const addLineMetadata = (linesMetadata, characterCount, rect) => {
  linesMetadata.push({
    characterCount,
    averageCharacterWidth: (rect.right - rect.left) / characterCount,
    rect,
  });
};

const getLinesMetadata = (wordsMetadata) => {
  const linesMetadata = [];
  let characterCount = 0;
  let rect = { ...wordsMetadata[0].rect };
  wordsMetadata.forEach((wordMetadata) => {
    if (rect.bottom === wordMetadata.rect.bottom) {
      // Same line
      characterCount += wordMetadata.word.length;
      rect.right = wordMetadata.rect.right;
    } else {
      // New line
      addLineMetadata(linesMetadata, characterCount, rect);
      rect = { ...wordMetadata.rect };
      characterCount = wordMetadata.word.length;
    }
  });
  addLineMetadata(linesMetadata, characterCount, rect);
  return linesMetadata;
};

const addWordMetadata = (wordsMetadata, word, context, lineNumber, wordStartPosition, fillYStart, lineHeight) => {
  const wordWidth = context.measureText(word).width;
  wordsMetadata.push({
    word,
    lineNumber,
    rect: {
      top: fillYStart - lineHeight,
      right: Math.ceil(wordStartPosition + wordWidth),
      bottom: fillYStart,
      left: Math.floor(wordStartPosition),
    },
  });
};

export const writeText = (canvasContext, contentState, textOptions = { lineSpacing: 1, paragraphSpace: 5 }) => {
  // Canvas data
  const canvasWidth = canvasContext.canvas.width;
  const canvasHeight = canvasContext.canvas.height;
  const defaultStyle = canvasContext.font;
  let currentStyle = defaultStyle;
  const lineHeight = +defaultStyle.match(/\d+(\.\d+)?(?=px)/)[0];
  let spaceWidth = canvasContext.measureText(' ').width;
  // Text data
  const text = contentState.getPlainText('\n').replace(/\n/g, '');
  let currentBlock = contentState.getFirstBlock();
  let currentBlockKey = currentBlock.getKey();
  let characterMetadata = currentBlock.getCharacterList();
  let currentBlockLength = currentBlock.getText().length;
  let previousBlocksLength = 0;
  const letters = text.split('');
  const textLength = letters.length;
  // Initializing
  const wordsMetadata = [];
  let currentWord = '';
  let lineNumber = 0;
  let wordStartPosition = 0;
  let fillXStart = 0;
  let fillYStart = lineHeight;
  let fillText = '';

  const nextBlock = () => {
    previousBlocksLength += currentBlockLength;
    currentBlock = contentState.getBlockAfter(currentBlockKey);
    currentBlockKey = currentBlock.getKey();
    characterMetadata = currentBlock.getCharacterList();
    currentBlockLength = currentBlock.getText().length;
  };

  const newLine = ({ additionalSpacing = 0, overflowText = '' }) => {
    fillXStart = 0;
    fillYStart += lineHeight + additionalSpacing;
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
          newLine({ overflowText: word });
          lineNumber += 1;
        }
        draw();
        addWordMetadata(wordsMetadata, currentWord, canvasContext, lineNumber, wordStartPosition, fillYStart, lineHeight);
        currentWord = '';
        lineNumber += 1;
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
        lineNumber += 1;
        newLine({ overflowText: `${currentWord} ` });
      }
      addWordMetadata(wordsMetadata, currentWord, canvasContext, lineNumber, wordStartPosition, fillYStart, lineHeight);
      currentWord = '';
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
          lineNumber += 1;
          newLine({ overflowText: word });
        }
        draw();
        // Add remaining word metadata
        addWordMetadata(wordsMetadata, currentWord, canvasContext, lineNumber, wordStartPosition, fillYStart, lineHeight);
        currentWord = '';
      }
    }
  });
  const textHeight = wordsMetadata[wordsMetadata.length - 1].y1;
  if (textHeight > canvasHeight) {
    setCanvasHeight(canvasContext, textHeight);
  }
  const linesMetadata = getLinesMetadata(wordsMetadata);
  return { wordsMetadata, linesMetadata };
};

// eslint-disable-next-line
const blocksFromHTML = convertFromHTML('<p><b>Lorem ipsum dolor sit amet</b></p><p>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc pulvinar sapien et ligula ullamcorper malesuada. Mauris cursus mattis molestie a iaculis at erat. Purus gravida quis blandit turpis cursus in hac. Placerat orci nulla pellentesque dignissim enim. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Lacus luctus accumsan tortor posuere. Ut sem nulla pharetra diam. Quisque egestas diam in arcu cursus euismod. Vitae semper quis lectus nulla at volutpat diam.</p><p>Lacus vel facilisis volutpat est velit egestas dui id ornare. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Nunc id cursus metus aliquam eleifend mi. A diam maecenas sed enim ut. Est lorem ipsum dolor sit amet consectetur.</p>');
const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

export const exampleText = {
  characterCount: 801,
  wordCount: 122,
  sentenceCount: 15,
  contentState,
};
