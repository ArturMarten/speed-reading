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
  if (event.nativeEvent) {
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

export const translateError = (translate, error) => {
  switch (error) {
    case 'Network Error':
      return translate('error.network-error');
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
    case 'Incorrect password':
      return translate('error.incorrect-password');
    case 'You do not have required permission':
      return translate('error.no-permission');
    default:
      return error;
  }
}
