import * as actionTypes from './actionTypes';
import * as api from '../../api';

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
  api.fetchTestEditorQuestions(readingTextId)
    .then((fetchedQuestions) => {
      dispatch(fetchQuestionsSucceeded(fetchedQuestions));
    }, (errorMessage) => {
      dispatch(fetchQuestionsFailed(errorMessage));
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

export const addQuestion = questionData => (dispatch) => {
  dispatch(addQuestionStart());
  api.addQuestion(questionData)
    .then((id, message) => {
      dispatch(addQuestionSucceeded(id, questionData, message));
    }, (errorMessage) => {
      dispatch(addQuestionFailed(errorMessage));
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

export const changeQuestion = (questionId, questionData) => (dispatch) => {
  dispatch(changeQuestionStart());
  api.changeQuestion({ questionId, questionData })
    .then((message) => {
      dispatch(changeQuestionSucceeded(questionId, questionData, message));
    }, (errorMessage) => {
      dispatch(changeQuestionFailed(errorMessage));
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

export const removeQuestion = questionId => (dispatch) => {
  dispatch(removeQuestionStart());
  api.removeQuestion(questionId)
    .then((message) => {
      dispatch(removeQuestionSucceeded(questionId, message));
    }, (errorMessage) => {
      dispatch(removeQuestionFailed(errorMessage));
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

export const addAnswer = answerData => (dispatch) => {
  dispatch(addAnswerStart());
  api.addAnswer(answerData)
    .then((id, message) => {
      dispatch(addAnswerSucceeded(id, answerData, message));
    }, (errorMessage) => {
      dispatch(addAnswerFailed(errorMessage));
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

export const changeAnswer = (questionId, answerId, answerData) => (dispatch) => {
  dispatch(changeAnswerStart());
  api.changeAnswer({ answerId, answerData })
    .then((message) => {
      dispatch(changeAnswerSucceeded(questionId, answerId, answerData, message));
    }, (errorMessage) => {
      dispatch(changeAnswerFailed(errorMessage));
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

export const removeAnswer = (questionId, answerId) => (dispatch) => {
  dispatch(removeAnswerStart());
  api.removeAnswer(answerId)
    .then((message) => {
      dispatch(removeAnswerSucceeded(questionId, answerId, message));
    }, (errorMessage) => {
      dispatch(removeAnswerFailed(errorMessage));
    });
};

const generateBlankExercisesStart = () => ({
  type: actionTypes.GENERATE_BLANK_EXERCISES_START,
});

const generateBlankExercisesSucceeded = blankExercises => ({
  type: actionTypes.GENERATE_BLANK_EXERCISES_SUCCEEDED,
  payload: blankExercises,
});

const generateBlankExercisesFailed = error => ({
  type: actionTypes.GENERATE_BLANK_EXERCISES_FAILED,
  payload: error,
});

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

const testPrepareFailed = error => ({
  type: actionTypes.TEST_PREPARE_FAILED,
  payload: error,
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

export const prepareQuestionTest = readingTextId => (dispatch) => {
  dispatch(testPreparing());
  dispatch(fetchQuestionsStart());
  api.prepareQuestionTest(readingTextId)
    .then((fetchedQuestions) => {
      dispatch(fetchQuestionsSucceeded(fetchedQuestions));
      dispatch(timerInit());
      dispatch(testPrepared());
    }, (errorMessage) => {
      dispatch(fetchQuestionsFailed(errorMessage));
      dispatch(testPrepareFailed(errorMessage));
    });
};

export const prepareBlankTest = text => (dispatch) => {
  dispatch(testPreparing());
  dispatch(generateBlankExercisesStart());
  api.prepareBlankTest(text)
    .then((blankExercises) => {
      dispatch(generateBlankExercisesSucceeded(blankExercises));
      dispatch(timerInit());
      dispatch(testPrepared());
    }, (errorMessage) => {
      dispatch(generateBlankExercisesFailed(errorMessage));
      dispatch(testPrepareFailed(errorMessage));
    });
};

export const startTest = attemptData => (dispatch) => {
  dispatch(testStarting());
  api.startTest(attemptData)
    .then((attemptId) => {
      dispatch(timerStart());
      dispatch(testStarted());
      dispatch(testAttemptStarted(attemptId));
    }, (errorMessage) => {
      dispatch(testStartFailed(errorMessage));
    });
};

export const finishQuestionTest = (attemptId, answers) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(testFinishing());
  const state = getState();
  const { elapsedTime } = state.timing;
  const result = { elapsedTime };
  api.finishQuestionTest({ attemptId, answers, result })
    .then((testResult) => {
      dispatch(testFinished(testResult));
    }, (errorMessage) => {
      dispatch(testFinishFailed(errorMessage));
    });
};

export const finishBlankTest = (attemptId, answers) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(testFinishing());
  const state = getState();
  const { elapsedTime } = state.timing;
  const result = { elapsedTime };
  api.finishBlankTest({ attemptId, answers, result })
    .then((testResult) => {
      dispatch(testFinished(testResult));
    }, (errorMessage) => {
      dispatch(testFinishFailed(errorMessage));
    });
};

export const endTest = () => (dispatch) => {
  dispatch(testEnd());
};

const recalculateTestAttemptStart = () => ({
  type: actionTypes.RECALCULATE_TEST_ATTEMPT_START,
});

const recalculateTestAttemptSucceeded = result => ({
  type: actionTypes.RECALCULATE_TEST_ATTEMPT_SUCCEEDED,
  payload: result,
});

const recalculateTestAttemptFailed = error => ({
  type: actionTypes.RECALCULATE_TEST_ATTEMPT_FAILED,
  payload: error,
});

export const recalculateTestAttempt = testAttemptId => (dispatch) => {
  dispatch(recalculateTestAttemptStart());
  api.recalculateTestAttempt({ testAttemptId })
    .then((testAttempt) => {
      dispatch(recalculateTestAttemptSucceeded(testAttempt.result));
    }, (errorMessage) => {
      dispatch(recalculateTestAttemptFailed(errorMessage));
    });
};
