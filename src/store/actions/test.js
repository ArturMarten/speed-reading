import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage, serverSuccessMessage } from '../../shared/utility';

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
    }, (error) => {
      dispatch(fetchQuestionsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchQuestionsFailed(error.message));
    });
};

const addQuestionStart = () => ({
  type: actionTypes.ADD_QUESTION_START,
});

const addQuestionSucceeded = (questionId, questionData, message) => ({
  type: actionTypes.ADD_QUESTION_SUCCEEDED,
  payload: {
    questionId,
    questionData,
    message,
  },
});

const addQuestionFailed = error => ({
  type: actionTypes.ADD_QUESTION_FAILED,
  payload: error,
});

export const addQuestion = (questionData, token) => (dispatch) => {
  dispatch(addQuestionStart());
  axios.post('/questions', questionData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(addQuestionSucceeded(response.data.id, questionData, serverSuccessMessage(response)));
    }, (error) => {
      dispatch(addQuestionFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(addQuestionFailed(error.message));
    });
};

const changeQuestionStart = () => ({
  type: actionTypes.CHANGE_QUESTION_START,
});

const changeQuestionSucceeded = (questionId, questionData, message) => ({
  type: actionTypes.CHANGE_QUESTION_SUCCEEDED,
  payload: {
    questionId,
    questionData,
    message,
  },
});

const changeQuestionFailed = error => ({
  type: actionTypes.CHANGE_QUESTION_FAILED,
  payload: error,
});

export const changeQuestion = (questionId, questionData, token) => (dispatch) => {
  dispatch(changeQuestionStart());
  axios.put(`/questions/${questionId}`, questionData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(changeQuestionSucceeded(questionId, questionData, serverSuccessMessage(response)));
    }, (error) => {
      dispatch(changeQuestionFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(changeQuestionFailed(error.message));
    });
};

const removeQuestionStart = () => ({
  type: actionTypes.REMOVE_QUESTION_START,
});

const removeQuestionSucceeded = (questionId, message) => ({
  type: actionTypes.REMOVE_QUESTION_SUCCEEDED,
  payload: {
    id: questionId,
    message,
  },
});

const removeQuestionFailed = error => ({
  type: actionTypes.REMOVE_QUESTION_FAILED,
  payload: error,
});

export const removeQuestion = (questionId, token) => (dispatch) => {
  dispatch(removeQuestionStart());
  axios.delete(`/questions/${questionId}`, { headers: { 'x-access-token': token } })
    .then(() => {
      dispatch(removeQuestionSucceeded(questionId, 'Question removed'));
    }, (error) => {
      dispatch(removeQuestionFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(removeQuestionFailed(error.message));
    });
};

const addAnswerStart = () => ({
  type: actionTypes.ADD_ANSWER_START,
});

const addAnswerSucceeded = (answerId, answerData, message) => ({
  type: actionTypes.ADD_ANSWER_SUCCEEDED,
  payload: {
    answerId,
    answerData,
    message,
  },
});

const addAnswerFailed = error => ({
  type: actionTypes.ADD_ANSWER_FAILED,
  payload: error,
});

export const addAnswer = (answerData, token) => (dispatch) => {
  dispatch(addAnswerStart());
  axios.post('/answers', answerData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(addAnswerSucceeded(response.data.id, answerData, serverSuccessMessage(response)));
    }, (error) => {
      dispatch(addAnswerFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(addAnswerFailed(error.message));
    });
};

const changeAnswerStart = () => ({
  type: actionTypes.CHANGE_ANSWER_START,
});

const changeAnswerSucceeded = (questionId, answerId, answerData, message) => ({
  type: actionTypes.CHANGE_ANSWER_SUCCEEDED,
  payload: {
    questionId,
    answerId,
    answerData,
    message,
  },
});

const changeAnswerFailed = error => ({
  type: actionTypes.CHANGE_ANSWER_FAILED,
  payload: error,
});

export const changeAnswer = (questionId, answerId, answerData, token) => (dispatch) => {
  dispatch(changeAnswerStart());
  axios.put(`/answers/${answerId}`, answerData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(changeAnswerSucceeded(questionId, answerId, answerData, serverSuccessMessage(response)));
    }, (error) => {
      dispatch(changeAnswerFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(changeAnswerFailed(error.message));
    });
};

const removeAnswerStart = () => ({
  type: actionTypes.REMOVE_ANSWER_START,
});

const removeAnswerSucceeded = (questionId, answerId, message) => ({
  type: actionTypes.REMOVE_ANSWER_SUCCEEDED,
  payload: {
    questionId,
    answerId,
    message,
  },
});

const removeAnswerFailed = error => ({
  type: actionTypes.REMOVE_ANSWER_FAILED,
  payload: error,
});

export const removeAnswer = (questionId, answerId, token) => (dispatch) => {
  dispatch(removeAnswerStart());
  axios.delete(`/answers/${answerId}`, { headers: { 'x-access-token': token } })
    .then(() => {
      dispatch(removeAnswerSucceeded(questionId, answerId, 'Answer removed'));
    }, (error) => {
      dispatch(removeAnswerFailed(serverErrorMessage(error)));
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

const testStartFailed = error => ({
  type: actionTypes.TEST_START_FAILED,
  payload: error,
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

const testFinishFailed = error => ({
  type: actionTypes.TEST_FINISH_FAILED,
  payload: error,
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
    }, (error) => {
      dispatch(fetchQuestionsFailed(serverErrorMessage(error)));
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
      dispatch(testStartFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(testStartFailed(error.message));
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
      dispatch(testFinishFailed(serverErrorMessage(error)));
    })
    .then((response) => {
      dispatch(testFinished(response.data.result));
    }, (error) => {
      dispatch(testFinishFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(testFinishFailed(error.message));
    });
};

export const endTest = () => (dispatch) => {
  dispatch(testEnd());
};
