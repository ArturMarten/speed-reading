import { rest } from 'msw';
import * as textsDB from '../data/texts';
import * as usersDB from '../data/users';
import * as attemptsDB from '../data/attempts';

const apiURL = 'http://127.0.0.1:5000/api';

const handlers = [
  rest.post(`${apiURL}/register`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'Account registered, password sent with email',
      }),
    );
  }),
  rest.get(`${apiURL}/login`, async (req, res, ctx) => {
    const { username, password } = getCredentials(req);
    const { token } = await usersDB.authenticate({ username, password });
    return res(
      ctx.json({
        expiresIn: 21600,
        token,
        userId: '3d51a50e-cf70-4ee1-a6ea-39d14de246e5',
      }),
    );
  }),
  rest.get(`${apiURL}/changePassword`, async (req, res, ctx) => {
    const { username } = await getUser(req);
    const { oldPassword, newPassword } = getPasswordChange(req);
    await usersDB.changePassword({ username, oldPassword, newPassword });
    return res(
      ctx.json({
        message: 'Password changed',
      }),
    );
  }),
  rest.get(`${apiURL}/groups`, async (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Group 1' }]));
  }),
  rest.post(`${apiURL}/groups`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'New group created',
        id: 2,
      }),
    );
  }),
  rest.get(`${apiURL}/users/:publicId`, async (req, res, ctx) => {
    const { publicId } = req.params;
    return res(
      ctx.json({
        email: 'username@test.com',
        firstName: 'user',
        groupId: null,
        lastLogin: 'Tue, 01 Feb 2019 00:00:00 GMT',
        lastName: 'name',
        publicId,
        registrationDate: 'Tue, 01 Feb 2019 00:00:00 GMT',
        role: 'student',
        settings: null,
        achievements: null,
      }),
    );
  }),
  rest.get(`${apiURL}/exerciseAttempts`, async (req, res, ctx) => {
    const { searchParams } = req.url;
    const userId = searchParams.get('userId');
    const groupId = searchParams.get('groupId');
    const embed = searchParams.get('embed');
    const groupBy = searchParams.get('groupBy');
    if (groupBy) {
      const attempts = await attemptsDB.getExerciseAttemptsGroupedByUserId();
      return res(ctx.json(attempts));
    }
    const attempts = await attemptsDB.getExerciseAttempts(userId);
    return res(ctx.json(attempts));
  }),
  rest.post(`${apiURL}/exerciseAttempts`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'Exercise attempt added',
        id: 1,
      }),
    );
  }),
  rest.patch(`${apiURL}/exerciseAttempts/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'Exercise attempt patched',
      }),
    );
  }),
  rest.get(`${apiURL}/users`, async (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.post(`${apiURL}/users`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'New user created',
        publicId: '2',
      }),
    );
  }),
  rest.put(`${apiURL}/users/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'User updated',
      }),
    );
  }),
  rest.get(`${apiURL}/applicationStatistics`, async (req, res, ctx) => {
    return res(
      ctx.json({
        exerciseAttemptCount: 1000,
        feedbackCount: 5,
        helpExerciseTime: 150000000,
        questionCount: 1000,
        readingExerciseTime: 250000000,
        testTime: 100000000,
        textCount: 200,
        totalTime: 500000000,
        userCount: 100,
      }),
    );
  }),
  rest.get(`${apiURL}/bugReports`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          date: Date.now(),
          resolved: false,
          userId: null,
          description: 'Some bug',
          version: '1.0.0',
          userAgent: '',
          platform: '',
          windowDimensions: [1024, 768],
          consoleErrors: [],
          state: {},
          actions: [],
          screenshotFilename: null,
        },
      ]),
    );
  }),
  rest.post(`${apiURL}/bugReports`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Bug report added' }));
  }),
  rest.get(`${apiURL}/problemReports`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          date: Date.now(),
          resolved: false,
          type: 'text',
          userId: null,
          textTitle: 'Text title',
          description: 'Some problem',
          screenshotFilename: null,
        },
      ]),
    );
  }),
  rest.post(`${apiURL}/problemReports`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Problem report added' }));
  }),
  rest.get(`${apiURL}/feedback`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          date: Date.now(),
          userId: null,
          message: 'Some feedback',
          functionalityRating: 3,
          usabilityRating: 4,
          designRating: 5,
        },
      ]),
    );
  }),
  rest.post(`${apiURL}/feedback`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Feedback added' }));
  }),
  rest.get(`${apiURL}/collections`, async (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get(`${apiURL}/texts`, async (req, res, ctx) => {
    const texts = await textsDB.getTexts();
    return res(ctx.json(texts));
  }),
  rest.get(`${apiURL}/texts/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const text = await textsDB.getText(id);
    return res(ctx.json(text));
  }),
  rest.post(`${apiURL}/texts`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Reading text added' }));
  }),
  rest.put(`${apiURL}/texts/:id`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Reading text updated' }));
  }),
  rest.get(`${apiURL}/questions`, async (req, res, ctx) => {
    const id = req.url.searchParams.get('readingTextId');
    const questions = await textsDB.getTextQuestions(id);
    return res(ctx.json(questions));
  }),
  rest.post(`${apiURL}/questions`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Question added', id: 1 }));
  }),
  rest.post(`${apiURL}/answers`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Answer added', id: 1 }));
  }),
  rest.get(`${apiURL}/testQuestionAnswers`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          questionText: 'Text question?',
          answerId: 1,
          answers: [
            { id: 1, answerText: 'Answer 1' },
            { id: 2, answerText: 'Answer 2' },
          ],
        },
      ]),
    );
  }),
  rest.post(`${apiURL}/testQuestionAnswers`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Test question answer added' }));
  }),
  rest.post(`${apiURL}/testAttempts`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'Test attempt added',
        id: 1,
      }),
    );
  }),
  rest.patch(`${apiURL}/testAttempts/:id`, async (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'Test attempt patched',
        result: {
          elapsedTime: 12345,
          testResult: 1,
          correct: 1,
          incorrect: 0,
          unanswered: 0,
          comprehensionResult: 1,
          comprehensionPerMinute: 300,
        },
      }),
    );
  }),
  rest.post(`${apiURL}/analyze`, async (req, res, ctx) => {
    return res(
      ctx.json({
        characterCount: 4,
        wordCount: 1,
        sentenceCount: 1,
        wordLengths: [],
        sentenceLengths: [],
        wordTypeCounts: [],
        averageWordLength: 0,
        averageSentenceLengthInWords: 0,
        averageSentenceLengthInCharacters: 0,
      }),
    );
  }),
  rest.post(`${apiURL}/generateBlankExercises`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          blankExercise: ['Own ', 'BLANK', ' text'],
          correct: 'reading',
        },
      ]),
    );
  }),
  rest.get(`${apiURL}/testBlankAnswers`, async (req, res, ctx) => {
    req.url.searchParams.get('testAttemptId');
    return res(
      ctx.json([
        {
          id: 1,
          language: 'estonian',
          blankExercise: ['Own ', 'BLANK', ' text'],
          correct: 'reading',
          answer: 'reading',
          autoEvaluation: 'correct',
          userEvaluation: null,
        },
      ]),
    );
  }),
  rest.post(`${apiURL}/testBlankAnswers`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          message: 'Test blank answer added',
        },
      ]),
    );
  }),
  rest.post(`${apiURL}/exportFile`, async (req, res, ctx) => {
    return res(ctx.json([]));
  }),
].map((handler) => {
  return {
    ...handler,
    async resolver(req, res, ctx) {
      try {
        if (shouldFail(req)) {
          throw new Error('Request failure (for testing purposes).');
        }
        const result = await handler.resolver(req, res, ctx);
        return result;
      } catch (error) {
        const status = error.status || 500;
        return res(ctx.status(status), ctx.json({ error: error.message || 'Unknown Error' }));
      } finally {
        await Promise.resolve();
      }
    },
  };
});

function shouldFail(req) {
  return false;
}

function getCredentials(req) {
  const token = req.headers.get('authorization')?.replace('Basic ', '');
  if (!token) {
    const error = new Error('A token must be provided');
    error.status = 401;
    throw error;
  }
  const [username, password] = atob(token).split(':');
  return { username, password };
}

function getPasswordChange(req) {
  const token = req.headers.get('authorization')?.replace('Basic ', '');
  if (!token) {
    const error = new Error('A token must be provided');
    error.status = 401;
    throw error;
  }
  const [, password] = atob(token).split(':');
  const [oldPassword, newPassword] = password.split('_');
  return { oldPassword, newPassword };
}

async function getUser(req) {
  const token = req.headers.get('x-access-token')?.replace('Bearer ', '');
  if (!token) {
    const error = new Error('A token must be provided');
    error.status = 401;
    throw error;
  }
  try {
    const username = atob(token);
    const user = await usersDB.read(username);
    return user;
  } catch (e) {
    const error = new Error('Invalid token. Please login again.');
    error.status = 401;
    throw error;
  }
}

export { handlers, apiURL };
