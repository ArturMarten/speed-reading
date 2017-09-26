// Word grouping
const sentenceRegex = /[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g;
const commaRegex = /[^,]+[\,]+|[^,]+$/g;
let wordRegex = RegExp('(.{1,15}(\\s|$))\\s*', 'g');

Array.prototype.flatMap = function(lambda) { 
  return Array.prototype.concat.apply([], this.map(lambda)); 
};

export const splitIntoWordGroups = (text, character_count) => {
  console.log('Splitting');
  wordRegex = RegExp('(.{1,' + character_count + '}(\\s|$))\\s*', 'g');  
  return text.length > character_count ? splitWithPeriod(text, character_count) : [text]
}

// First split groups at '.'
const splitWithPeriod = (text, character_count) => {
  return text.match(sentenceRegex).flatMap((sentence) => sentence.length > character_count ? splitWithComma(sentence, character_count) : sentence.trim())
}

// Then split groups at ','
const splitWithComma = (sentence, character_count) => {
  return sentence.match(commaRegex).flatMap((words) => words.length > character_count ? splitWords(words, character_count) : words.trim())
}

// Finally, split groups at ' '
const splitWords = (words, character_count) => {
  return words.match(wordRegex).map((group) => group.trim());
}