import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const fetchTestEditorQuestions = readingTextId => (
  new Promise((resolve, reject) => {
    axios.get(`/questions?readingTextId=${readingTextId}&embed=answers.correct`)
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const addQuestion = questionData => (
  new Promise((resolve, reject) => {
    axios.post('/questions', questionData)
      .then((response) => {
        resolve(response.data.id, serverSuccessMessage(response));
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const changeQuestion = ({ questionId, questionData }) => (
  new Promise((resolve, reject) => {
    axios.put(`/questions/${questionId}`, questionData)
      .then((response) => {
        resolve(serverSuccessMessage(response));
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const removeQuestion = questionId => (
  new Promise((resolve, reject) => {
    axios.delete(`/questions/${questionId}`)
      .then(() => {
        resolve('Question removed');
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const addAnswer = answerData => (
  new Promise((resolve, reject) => {
    axios.post('/answers', answerData)
      .then((response) => {
        resolve(response.data.id, serverSuccessMessage(response));
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const changeAnswer = ({ answerId, answerData }) => (
  new Promise((resolve, reject) => {
    axios.put(`/answers/${answerId}`, answerData)
      .then((response) => {
        resolve(serverSuccessMessage(response));
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const removeAnswer = answerId => (
  new Promise((resolve, reject) => {
    axios.delete(`/answers/${answerId}`)
      .then(() => {
        resolve('Answer removed');
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const prepareQuestionTest = readingTextId => (
  new Promise((resolve, reject) => {
    axios.get(`/questions?readingTextId=${readingTextId}`)
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const prepareBlankTest = text => (
  new Promise((resolve, reject) => {
    axios.post('/generateBlankExercises', { text })
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const startTest = attemptData => (
  new Promise((resolve, reject) => {
    axios.post('/testAttempts', attemptData)
      .then((response) => {
        resolve(response.data.id);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const finishQuestionTest = ({ attemptId, answers, result }) => (
  new Promise((resolve, reject) => {
    axios.post('/testQuestionAnswers', answers)
      .then(() => (
        axios.patch(`/testAttempts/${attemptId}`, { result })
      ), (error) => {
        reject(serverErrorMessage(error));
      })
      .then((response) => {
        resolve(response.data.result);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const finishBlankTest = ({ attemptId, answers, result }) => (
  new Promise((resolve, reject) => {
    axios.post('/testBlankAnswers', answers)
      .then(() => (
        axios.patch(`/testAttempts/${attemptId}`, { result })
      ), (error) => {
        reject(serverErrorMessage(error));
      })
      .then((response) => {
        resolve(response.data.result);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const addTestRating = ratingData => (
  new Promise((resolve, reject) => {
    axios.post('/testRatings', ratingData)
      .then((response) => {
        resolve(serverSuccessMessage(response));
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const fetchTestQuestionAnswers = testAttemptId => (
  new Promise((resolve, reject) => {
    axios.get(`/testQuestionAnswers?testAttemptId=${testAttemptId}`)
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const fetchTestBlankAnswers = testAttemptId => (
  new Promise((resolve, reject) => {
    axios.get(`/testBlankAnswers?testAttemptId=${testAttemptId}`)
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const changeTestBlankAnswer = ({ blankAnswerId, userEvaluation }) => (
  new Promise((resolve, reject) => {
    axios.patch(`/testBlankAnswers/${blankAnswerId}`, { userEvaluation })
      .then(() => {
        resolve();
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const reevaluateTestAttempt = ({ testAttemptId }) => (
  new Promise((resolve, reject) => {
    axios.patch(`/testAttempts/${testAttemptId}/re-evaluate`)
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);
