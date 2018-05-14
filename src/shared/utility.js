export const updateObject = (oldObject, newValues) => ({
  ...oldObject,
  ...newValues,
});

export const isEmail = (value) => {
  // eslint-disable-next-line
  const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return pattern.test(value);
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }
  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }
  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }
  if (rules.isEmail) {
    isValid = isEmail(value) && isValid;
  }
  return isValid;
};

export const stopPropagation = (event) => {
  if (event && event.nativeEvent) {
    event.nativeEvent.stopImmediatePropagation();
  }
};

export const formatMilliseconds = (input) => {
  const pad = (time, length) => {
    let result = time;
    while (result.length < length) {
      result = `0${result}`;
    }
    return result;
  };
  const inputTime = new Date(input);
  const minutes = pad(inputTime.getMinutes().toString(), 2);
  const seconds = pad(inputTime.getSeconds().toString(), 2);
  const milliseconds = pad(inputTime.getMilliseconds().toString()[0], 1);
  return `${minutes}:${seconds}.${milliseconds}`;
};

export const translateSuccess = (translate, message) => {
  switch (message) {
    case 'Success':
      return translate('success.generic');
    case 'Password changed':
      return translate('success.password-changed');
    case 'Feedback added':
      return translate('success.feedback-added');
    case 'Bug report added':
      return translate('success.bug-report-added');
    case 'Reading text added':
      return translate('success.reading-text-added');
    case 'Reading text updated':
      return translate('success.reading-text-updated');
    case 'Question added':
      return translate('success.question-added');
    case 'Question updated':
      return translate('success.question-updated');
    case 'Question removed':
      return translate('success.question-removed');
    case 'Answer added':
      return translate('success.answer-added');
    case 'Answer updated':
      return translate('success.answer-updated');
    case 'Answer removed':
      return translate('success.answer-removed');
    case 'Account registered, password sent with e-email':
      return translate('success.account-registered-password-sent');
    default:
      return message;
  }
};

export const translateError = (translate, error) => {
  switch (error) {
    case 'Network Error':
      return translate('error.network-error');
    case 'There was a problem processing the requested URL':
      return translate('error.internal-server-error');
    case 'Authentication missing':
      return translate('error.authentication-missing');
    case 'Authentication token is missing':
      return translate('error.authentication-token-missing');
    case 'Authentication token is invalid':
      return translate('error.authentication-token-invalid');
    case 'Authentication expired':
      return translate('error.authentication-expired');
    case 'User cannot be found':
      return translate('error.user-not-found');
    case 'Group already exists':
      return translate('error.group-already-exists');
    case 'User already exists':
      return translate('error.user-already-exists');
    case 'Incorrect password':
      return translate('error.incorrect-password');
    case 'Incorrect old password':
      return translate('error.incorrect-old-password');
    case 'You do not have required permission':
      return translate('error.no-permission');
    default:
      return error;
  }
};

export const sortByColumn = (data, column, direction) => {
  if (column === null) return data;
  const sorted = data.sort((a, b) => {
    if (typeof a[column] === 'string') {
      return a[column].toString().localeCompare(b[column].toString());
    }
    return (a[column] !== null) - (b[column] !== null) || a[column] - b[column];
  });
  return direction === 'descending' ? sorted.reverse() : sorted;
};

export const serverSuccessMessage = response => (
  response.data && response.data.message ?
    response.data.message : 'Success'
);

export const serverErrorMessage = error => (
  error.response && error.response.data && error.response.data.error ?
    error.response.data.error : error.message
);

export const shuffle = (array) => {
  const shuffled = array;
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/* eslint-disable object-property-newline */
const similarSymbols = {
  0: ['8'], 1: ['7'], 2: ['5'], 3: ['6'], 4: ['7'], 5: ['2', '6'], 7: ['1'], 8: ['3', '6', '9'], 9: ['3', '6', '8'],
  a: ['e'], b: ['d'], c: ['o'], d: ['b'], e: ['a'], f: ['t'], g: ['j'], h: ['k'], i: ['l'],
  j: ['y'], k: ['h'], l: ['i'], m: ['n'], n: ['m'], o: ['c'], p: ['q'], q: ['p'], r: ['f'],
  s: ['z'], t: ['f'], u: ['v'], v: ['w', 'u'], w: ['v'], x: ['y'], y: ['j', 'x'], z: ['s'],
};

export const getSimilarSymbol = (symbol) => {
  const similar = similarSymbols[symbol];
  if (!similar) return symbol;
  return similar[Math.floor(Math.random() * similar.length)];
};

const BASE64_MARKER = ';base64,';

export const convertDataURIToBinary = (dataURI) => {
  console.log(dataURI);
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; i += 1) {
    array[i] = raw.charCodeAt(i);
  }
  console.log(array);
  return array;
};

export const reduceSumFunc = (prev, cur) => prev + cur;
