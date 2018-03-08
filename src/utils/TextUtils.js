// Word grouping
const sentenceRegex = /[^.!?]+[.!?]+|[^.!?]+$/g;
const commaRegex = /[^,]+[,]+|[^,]+$/g;
let wordRegex = RegExp('(.{1,15}(\\s|$))\\s*', 'g');

// eslint-disable-next-line no-extend-native, func-names
Array.prototype.flatMap = function (lambda) {
  return Array.prototype.concat.apply([], this.map(lambda));
};
// Finally, split groups at ' '
const splitWords = words => words.match(wordRegex).map(group => group.trim());

// Then split groups at ','
const splitWithComma = (sentence, characterCount) =>
  sentence.match(commaRegex).flatMap(words => (
    words.length > characterCount ? splitWords(words, characterCount) : words.trim()
  ));

// First split groups at '.'
const splitWithPeriod = (text, characterCount) =>
  text.match(sentenceRegex).flatMap(sentence => (
    sentence.length > characterCount ? splitWithComma(sentence, characterCount) : sentence.trim()
  ));

// eslint-disable-next-line import/prefer-default-export
export const splitIntoWordGroups = (text, characterCount) => {
  wordRegex = RegExp(`(.{1,${characterCount}}(\\s|$))\\s*`, 'g');
  return text.length > characterCount ? splitWithPeriod(text, characterCount) : [text];
};
