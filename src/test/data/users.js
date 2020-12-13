import credentials from '../../credentials';

const users = {
  [credentials.demo.username]: {
    username: credentials.demo.username,
    password: credentials.demo.password,
  },
  'username@test.com': {
    username: 'username@test.com',
    password: 'password',
  },
};

async function authenticate({ username, password }) {
  const user = users[username];
  if (!user) {
    const error = new Error('User cannot be found');
    error.status = 401;
    throw error;
  }
  if (user.password === password) {
    return { token: btoa(user.username) };
  }
  const error = new Error('Incorrect password');
  error.status = 401;
  throw error;
}

async function read(username) {
  const user = users[username];
  return user;
}

async function changePassword({ username, newPassword }) {
  // Do nothing
  // users[username].password = newPassword;
}

export { authenticate, read, changePassword };
