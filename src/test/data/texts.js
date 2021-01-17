import { ContentState, convertToRaw } from 'draft-js';

const texts = [
  {
    id: 1,
    collectionId: 1,
    title: 'Reading text',
    author: 'Text author',
    language: 'estonian',
    editor: 'Text editor',
    questionsAuthor: 'Text questions author',
    reference: 'Text reference',
    plainText: 'Reading text content',
    contentState: convertToRaw(ContentState.createFromText('Reading text content')),
    complexity: 1,
    keywords: ['Text keyword'],
    statistics: {
      averageInterestingnessRating: 8.3,
      characterCount: 4477,
      interestingnessRatingCount: 10,
      sentenceCount: 70,
      sentenceLengthClassRating: 7,
      totalReadingAttemptCount: 54,
      wordCount: 700,
      wordLengthClassRating: 10,
      userReadingAttemptCount: 0,
    },
  },
];

async function getTexts() {
  return texts;
}

async function getText(textId) {
  return texts[0];
}

async function getTextQuestions(textId) {
  return [
    {
      id: 1,
      questionText: 'Text question?',
      answers: [
        { id: 1, answerText: 'Answer 1' },
        { id: 2, answerText: 'Answer 2' },
      ],
    },
  ];
}

export { getTexts, getText, getTextQuestions };
