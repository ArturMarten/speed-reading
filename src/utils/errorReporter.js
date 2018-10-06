// Reference: https://github.com/dtschust/redux-bug-reporter/blob/master/src/utils.js

export const errorData = {
  errors: [],

  addError: function addError(error) {
    this.errors.push(error);
  },

  getErrors: function getErrors() {
    return this.errors;
  },
};

const listenToOnError = () => {
  const originalWindowError = window.onerror;
  if (!originalWindowError) {
    window.onerror = (message, url, lineNumber, columnNumber, error) => {
      const data = {
        message,
        lineNumber,
        columnNumber,
        stackTrace: error && error.stack ? error.stack : null,
      };
      errorData.addError(data);
      if (originalWindowError) {
        originalWindowError.apply(window);
      }
    };
  }
};

export const listenToErrors = () => {
  listenToOnError();
};
