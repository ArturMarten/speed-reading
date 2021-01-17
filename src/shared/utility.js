import regression from 'regression';

export const updateObject = (oldObject, newValues) => ({
  ...oldObject,
  ...newValues,
});

export const isEmail = (value) => {
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

export const focusInput = (ref) => {
  ref.focus();
  const { inputRef } = ref;
  const { current } = inputRef;
  const { length } = current.value;
  current.setSelectionRange(length, length);
};

const pad = (time, length) => {
  let result = time;
  while (result.length < length) {
    result = `0${result}`;
  }
  return result;
};

export const formatMilliseconds = (input) => {
  const inputTime = new Date(input);
  const minutes = pad(inputTime.getMinutes().toString(), 2);
  const seconds = pad(inputTime.getSeconds().toString(), 2);
  const milliseconds = pad(inputTime.getMilliseconds().toString()[0], 1);
  return `${minutes}:${seconds}.${milliseconds}`;
};

export const formatMillisecondsInHours = (input) => {
  const inputTime = new Date(input);
  const days = Math.floor(inputTime.getTime() / 86400000);
  const hours = pad((days * 24 + inputTime.getUTCHours()).toString(), 1);
  const minutes = pad(inputTime.getMinutes().toString(), 2);
  return `${hours}h ${minutes}m`;
};

export const formatMillisecondsInText = (input, translate) => {
  const inputTime = new Date(input);
  const days = Math.floor(inputTime.getTime() / 86400000);
  const hours = days * 24 + inputTime.getUTCHours();
  const minutes = inputTime.getMinutes();

  const formattedHours = `${hours} ${hours === 1 ? translate('formatter.hour') : translate('formatter.hours')}`;
  const formattedMinutes = `${minutes} ${
    minutes === 1 ? translate('formatter.minute') : translate('formatter.minutes')
  }`;
  if (hours < 1) {
    return formattedMinutes;
  }
  if (minutes === 0) {
    return formattedHours;
  }
  return `${formattedHours} ${formattedMinutes}`;
};

export const translateSuccess = (translate, message) => {
  switch (message) {
    case 'Success':
      return translate('success.generic');
    case 'Password changed':
      return translate('success.password-changed');
    case 'Feedback added':
      return translate('success.feedback-added');
    case 'Problem report added':
      return translate('success.problem-report-added');
    case 'User updated':
      return translate('success.user-updated');
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
    case 'Account registered, password sent with email':
      return translate('success.account-registered-password-sent');
    default:
      return message;
  }
};

export const translateError = (translate, error) => {
  switch (error) {
    case 'Network Error':
      return translate('error.network-error');
    case 'Request failed with status code 503':
      return translate('error.server-maintenance');
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
  const sorted = data.slice().sort((a, b) => {
    if (typeof a[column] === 'string' && a[column] !== null) {
      return a[column].toString().localeCompare(b[column].toString());
    }
    return (a[column] !== null) - (b[column] !== null) || a[column] - b[column];
  });
  return direction === 'descending' ? sorted.reverse() : sorted;
};

export const serverSuccessMessage = (response) =>
  response.data && response.data.message ? response.data.message : 'Success';

export const serverErrorMessage = (error) =>
  error.response && error.response.data && error.response.data.error ? error.response.data.error : error.message;

export const shuffle = (array) => {
  const shuffled = array;
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/* eslint-disable object-property-newline */
/* prettier-ignore */
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

export const getSymbolDimensions = (tableDimensions) => tableDimensions.split('x');

export const getSymbolCount = (tableDimensions) => {
  const [rows, columns] = getSymbolDimensions(tableDimensions);
  return Number.parseInt(rows, 10) * Number.parseInt(columns, 10);
};

export const reduceSumFunc = (prev, cur) => prev + cur;

export const polynomial = (xSeries, ySeries, order) => {
  const data = xSeries.map((x, index) => [x, ySeries[index]]);
  return regression.polynomial(data, { order, precision: 100 });
};

export const calculateY = (equation) => (x) => {
  return equation.reduce((prev, cur, index) => prev + cur * x ** (equation.length - index - 1), 0);
};

export const leastSquares = (xSeries, ySeries) => {
  if (xSeries === null || ySeries === null || xSeries.length === 0 || ySeries.length === 0) {
    return [0, 0, 0];
  }
  if (xSeries.length === 1 || ySeries.length === 1) {
    return [0, ySeries[0], 0];
  }
  const xBar = (xSeries.reduce(reduceSumFunc, 0) * 1.0) / xSeries.length;
  const yBar = (ySeries.reduce(reduceSumFunc, 0) * 1.0) / ySeries.length;

  const ssXX = xSeries.map((d) => (d - xBar) ** 2).reduce(reduceSumFunc, 0);

  const ssYY = ySeries.map((d) => (d - yBar) ** 2).reduce(reduceSumFunc, 0);

  const ssXY = xSeries.map((d, i) => (d - xBar) * (ySeries[i] - yBar)).reduce(reduceSumFunc, 0);

  const slope = ssXY / ssXX;
  const intercept = yBar - xBar * slope;
  const rSquare = ssXY ** 2 / (ssXX * ssYY);

  return [slope, intercept, rSquare];
};

export const getAverage = (values) => {
  const sum = values.reduce(reduceSumFunc, 0);
  return sum / values.length;
};

export const getStandardDeviation = (values, average = getAverage(values)) => {
  const squareDiffs = values.map((value) => {
    const difference = value - average;
    return difference * difference;
  });
  const avgSquareDiff = getAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

export const downloadExcelData = (data, filename, filetype) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  link.href = href;
  link.setAttribute('download', `${filename}.${filetype}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(href);
};
