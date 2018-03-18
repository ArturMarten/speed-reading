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
