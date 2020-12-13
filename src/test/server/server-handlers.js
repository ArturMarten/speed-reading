import { rest } from 'msw';
import * as usersDB from '../data/users';

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
    return res(ctx.json([]));
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
  rest.post(`${apiURL}/bugReports`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Bug report added' }));
  }),
  rest.post(`${apiURL}/problemReports`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Problem report added' }));
  }),
  rest.post(`${apiURL}/feedback`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Feedback added' }));
  }),
  rest.get(`${apiURL}/collections`, async (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.post(`${apiURL}/texts`, async (req, res, ctx) => {
    return res(ctx.json({ message: 'Reading text added' }));
  }),
  rest.post(`${apiURL}/analyze`, async (req, res, ctx) => {
    return res(ctx.json({ characterCount: 4, wordCount: 1, sentenceCount: 1 }));
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
