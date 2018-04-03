import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

const fetchQuestionsStart = () => ({
  type: actionTypes.FETCH_QUESTIONS_START,
});

const fetchQuestionsSucceeded = questions => ({
  type: actionTypes.FETCH_QUESTIONS_SUCCEEDED,
  payload: questions,
});

const fetchQuestionsFailed = error => ({
  type: actionTypes.FETCH_QUESTIONS_FAILED,
  payload: error,
});

export const fetchTestEditorQuestions = readingTextId => (dispatch) => {
  dispatch(fetchQuestionsStart());
  axios.get(`/questions?readingTextId=${readingTextId}&embed=answers.correct`)
    .then((response) => {
      const fetchedQuestions = response.data;
      dispatch(fetchQuestionsSucceeded(fetchedQuestions));
    })
    .catch((error) => {
      dispatch(fetchQuestionsFailed(error.message));
    });
};

const addQuestionStart = () => ({
  type: actionTypes.ADD_QUESTION_START,
});

const addQuestionSucceeded = (questionId, questionData) => ({
  type: actionTypes.ADD_QUESTION_SUCCEEDED,
  payload: {
    questionId,
    questionData,
  },
});

const addQuestionFailed = error => ({
  type: actionTypes.ADD_QUESTION_FAILED,
  payload: error,
});

export const addQuestion = questionData => (dispatch) => {
  dispatch(addQuestionStart());
  axios.post('/questions', questionData)
    .then((response) => {
      dispatch(addQuestionSucceeded(response.data.id, questionData));
    })
    .catch((error) => {
      dispatch(addQuestionFailed(error.message));
    });
};

const changeQuestionStart = () => ({
  type: actionTypes.CHANGE_QUESTION_START,
});

const changeQuestionSucceeded = (questionId, questionData) => ({
  type: actionTypes.CHANGE_QUESTION_SUCCEEDED,
  payload: {
    questionId,
    questionData,
  },
});

const changeQuestionFailed = error => ({
  type: actionTypes.CHANGE_QUESTION_FAILED,
  payload: error,
});

export const changeQuestion = (questionId, questionData) => (dispatch) => {
  dispatch(changeQuestionStart());
  axios.put(`/questions/${questionId}`, questionData)
    .then(() => {
      dispatch(changeQuestionSucceeded(questionId, questionData));
    })
    .catch((error) => {
      dispatch(changeQuestionFailed(error.message));
    });
};

const removeQuestionStart = () => ({
  type: actionTypes.REMOVE_QUESTION_START,
});

const removeQuestionSucceeded = questionId => ({
  type: actionTypes.REMOVE_QUESTION_SUCCEEDED,
  payload: questionId,
});

const removeQuestionFailed = error => ({
  type: actionTypes.REMOVE_QUESTION_FAILED,
  payload: error,
});

export const removeQuestion = questionId => (dispatch) => {
  dispatch(removeQuestionStart());
  axios.delete(`/questions/${questionId}`)
    .then(() => {
      dispatch(removeQuestionSucceeded(questionId));
    })
    .catch((error) => {
      dispatch(removeQuestionFailed(error.message));
    });
};

const addAnswerStart = () => ({
  type: actionTypes.ADD_ANSWER_START,
});

const addAnswerSucceeded = (answerId, answerData) => ({
  type: actionTypes.ADD_ANSWER_SUCCEEDED,
  payload: {
    answerId,
    answerData,
  },
});

const addAnswerFailed = error => ({
  type: actionTypes.ADD_ANSWER_FAILED,
  payload: error,
});

export const addAnswer = answerData => (dispatch) => {
  dispatch(addAnswerStart());
  axios.post('/answers', answerData)
    .then((response) => {
      dispatch(addAnswerSucceeded(response.data.id, answerData));
    })
    .catch((error) => {
      dispatch(addAnswerFailed(error.message));
    });
};

const changeAnswerStart = () => ({
  type: actionTypes.CHANGE_ANSWER_START,
});

const changeAnswerSucceeded = (questionId, answerId, answerData) => ({
  type: actionTypes.CHANGE_ANSWER_SUCCEEDED,
  payload: {
    questionId,
    answerId,
    answerData,
  },
});

const changeAnswerFailed = error => ({
  type: actionTypes.CHANGE_ANSWER_FAILED,
  payload: error,
});

export const changeAnswer = (questionId, answerId, answerData) => (dispatch) => {
  dispatch(changeAnswerStart());
  axios.put(`/answers/${answerId}`, answerData)
    .then(() => {
      dispatch(changeAnswerSucceeded(questionId, answerId, answerData));
    })
    .catch((error) => {
      dispatch(changeAnswerFailed(error.message));
    });
};

const removeAnswerStart = () => ({
  type: actionTypes.REMOVE_ANSWER_START,
});

const removeAnswerSucceeded = (questionId, answerId) => ({
  type: actionTypes.REMOVE_ANSWER_SUCCEEDED,
  payload: {
    questionId,
    answerId,
  },
});

const removeAnswerFailed = error => ({
  type: actionTypes.REMOVE_ANSWER_FAILED,
  payload: error,
});

export const removeAnswer = (questionId, answerId) => (dispatch) => {
  dispatch(removeAnswerStart());
  axios.delete(`/answers/${answerId}`)
    .then(() => {
      dispatch(removeAnswerSucceeded(questionId, answerId));
    })
    .catch((error) => {
      dispatch(removeAnswerFailed(error.message));
    });
};

const timerInit = () => ({
  type: actionTypes.TIMER_INIT,
});

const timerStart = () => ({
  type: actionTypes.TIMER_START,
});

const timerStop = () => ({
  type: actionTypes.TIMER_STOP,
});

const testPreparing = () => ({
  type: actionTypes.TEST_PREPARING,
});

const testPrepared = () => ({
  type: actionTypes.TEST_PREPARED,
});

const testStarting = () => ({
  type: actionTypes.TEST_STARTING,
});

const testStarted = () => ({
  type: actionTypes.TEST_STARTED,
});

const testAttemptStarted = attemptId => ({
  type: actionTypes.TEST_ATTEMPT_START,
  payload: attemptId,
});

const testFinishing = () => ({
  type: actionTypes.TEST_FINISHING,
});

const testFinished = result => ({
  type: actionTypes.TEST_FINISHED,
  payload: result,
});

const testEnd = () => ({
  type: actionTypes.TEST_END,
});

export const prepareTest = readingTextId => (dispatch) => {
  dispatch(testPreparing());
  dispatch(fetchQuestionsStart());
  axios.get(`/questions?readingTextId=${readingTextId}`)
    .then((response) => {
      const fetchedQuestions = response.data;
      dispatch(fetchQuestionsSucceeded(fetchedQuestions));
      dispatch(timerInit());
      dispatch(testPrepared());
    })
    .catch((error) => {
      dispatch(fetchQuestionsFailed(error.message));
    });
};

export const startTest = (attemptData, token) => (dispatch) => {
  dispatch(testStarting());
  axios.post('/testAttempts', attemptData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(timerStart());
      dispatch(testStarted());
      dispatch(testAttemptStarted(response.data.id));
    }, (error) => {
      console.log(error);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const finishTest = (attemptId, answers, token) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(testFinishing());
  const state = getState();
  const { elapsedTime } = state.timing;
  axios.post('/testQuestionAnswers', answers, { headers: { 'x-access-token': token } })
    .then(() => {
      const result = { elapsedTime };
      return axios.patch(`/testAttempts/${attemptId}`, { result }, { headers: { 'x-access-token': token } });
    }, (error) => {
      console.log(error);
    })
    .then((response) => {
      dispatch(testFinished(response.data.result));
    }, (error) => {
      console.log(error);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const endTest = () => (dispatch) => {
  dispatch(testEnd());
};
