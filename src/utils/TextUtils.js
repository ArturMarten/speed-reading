// Word grouping
const sentenceRegex = /[^.!?]+[.!?]+|[^.!?]+$/g;
const commaRegex = /[^,]+[,]+|[^,]+$/g;
let wordRegex = RegExp('(.{1,15}(\\s|$))\\s*', 'g');

Array.prototype.flatMap = function(lambda) {
  return Array.prototype.concat.apply([], this.map(lambda));
};

export const splitIntoWordGroups = (text, characterCount) => {
  console.log('Splitting');
  wordRegex = RegExp('(.{1,' + characterCount + '}(\\s|$))\\s*', 'g');
  return text.length > characterCount ? splitWithPeriod(text, characterCount) : [text];
};

// First split groups at '.'
const splitWithPeriod = (text, characterCount) => {
  return text.match(sentenceRegex).flatMap(
    (sentence) => sentence.length > characterCount ? splitWithComma(sentence, characterCount) : sentence.trim()
  );
};

// Then split groups at ','
const splitWithComma = (sentence, characterCount) => {
  return sentence.match(commaRegex).flatMap((words) => words.length > characterCount ? splitWords(words, characterCount) : words.trim());
};

// Finally, split groups at ' '
const splitWords = (words, characterCount) => {
  return words.match(wordRegex).map((group) => group.trim());
};
