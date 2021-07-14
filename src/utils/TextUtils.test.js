const { exampleText } = require('./CanvasUtils/CanvasUtils');
const { splitIntoWordGroups, splitIntoSentences, splitIntoSentenceParts, splitIntoChunks } = require('./TextUtils');

const testText = exampleText.contentState.getPlainText('');
const testSentences = splitIntoSentences(testText);

test('splitIntoSentences works', () => {
  const sentences = splitIntoSentences(testText);
  expect(sentences.length).toBe(15);
});

test('splitIntoSentenceParts works', () => {
  const parts = splitIntoSentenceParts(testSentences[0]);
  expect(parts.length).toBe(2);
});

test('splitIntoChunks works', () => {
  const chunks = splitIntoChunks(testSentences[1], 15);
  expect(chunks.length).toBe(4);
});

test('splitIntoWordGroups works with high character count', () => {
  const wordGroups = splitIntoWordGroups(testText, 15);
  expect(wordGroups.length).toBe(68);
  expect(wordGroups[0]).toStrictEqual(['Lorem', 'ipsum']);
  expect(wordGroups[1]).toStrictEqual(['dolor', 'sit', 'amet']);
  expect(wordGroups[4]).toStrictEqual(['elit,']);
});

test('splitIntoWordGroups works with medium character count', () => {
  const wordGroups = splitIntoWordGroups(testText, 10);
  expect(wordGroups.length).toBe(101);
  expect(wordGroups[0]).toStrictEqual(['Lorem']);
  expect(wordGroups[4]).toStrictEqual(['consectetur']);
  expect(wordGroups[6]).toStrictEqual(['elit,']);
});

test('splitIntoWordGroups works with low character count', () => {
  const wordGroups = splitIntoWordGroups(testText, 6);
  expect(wordGroups.length).toBe(118);
  expect(wordGroups[0]).toStrictEqual(['Lorem']);
  expect(wordGroups[5]).toStrictEqual(['consectetur']);
  expect(wordGroups[7]).toStrictEqual(['elit,']);
});
