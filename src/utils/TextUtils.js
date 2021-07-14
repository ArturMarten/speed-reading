// Word grouping
const sentenceRegex = /[^.!?]+[.!?]+|[^.!?]+$/g;
const commaRegex = /[^,]+[,]+|[^,]+$/g;

// eslint-disable-next-line no-extend-native
Array.prototype.flatMap = function (lambda) {
  return Array.prototype.concat.apply([], this.map(lambda));
};

const chunkLength = (chunk) => {
  return chunk.reduce((totalLength, word) => totalLength + word.length, 0);
};

const findChunkLengths = (chunks) => {
  const lengths = [];
  for (let index = 0; index < chunks.length - 1; index++) {
    lengths.push({
      index,
      length: chunkLength(chunks[index]) + chunkLength(chunks[index + 1]),
    });
  }
  return lengths;
};

export const splitIntoSentences = (text) => text.match(sentenceRegex).map((sentence) => sentence.trim());

export const splitIntoSentenceParts = (text) => text.match(commaRegex).map((part) => part.trim());

export const splitIntoChunks = (text, characterCount) => {
  let splitted = text.split(/\s+/g).map((word) => [word]);
  let chunkLengths = findChunkLengths(splitted);
  let sortedLengths = chunkLengths.sort((a, b) => a.length - b.length).filter((chunk) => chunk.length < characterCount);
  while (sortedLengths.length > 0) {
    const mergeChunk = sortedLengths[0];
    splitted = [
      ...splitted.slice(0, mergeChunk.index),
      [...splitted[mergeChunk.index], ...splitted[mergeChunk.index + 1]],
      ...splitted.slice(mergeChunk.index + 2),
    ];
    chunkLengths = findChunkLengths(splitted);
    sortedLengths = chunkLengths.sort((a, b) => a.length - b.length).filter((chunk) => chunk.length < characterCount);
  }
  return splitted;
};

export const splitIntoWordGroups = (text, characterCount) => {
  const sentences = splitIntoSentences(text);
  const sentenceParts = sentences.flatMap((sentence) => splitIntoSentenceParts(sentence));
  const chunks = sentenceParts.flatMap((sentencePart) => splitIntoChunks(sentencePart, characterCount));
  return chunks;
};
