import * as actionTypes from './actionTypes';
import * as api from '../../api';

const sendFeedbackStart = () => ({
  type: actionTypes.SEND_FEEDBACK_START,
});

const sendFeedbackSucceeded = (message) => ({
  type: actionTypes.SEND_FEEDBACK_SUCCEEDED,
  payload: message,
});

const sendFeedbackFailed = (error) => ({
  type: actionTypes.SEND_FEEDBACK_FAILED,
  payload: error,
});

export const sendFeedback = (feedbackData) => (dispatch) => {
  dispatch(sendFeedbackStart());
  api.sendFeedback(feedbackData).then(
    (message) => {
      dispatch(sendFeedbackSucceeded(message));
    },
    (errorMessage) => {
      dispatch(sendFeedbackFailed(errorMessage));
    },
  );
};

const fetchFeedbackStart = () => ({
  type: actionTypes.FETCH_FEEDBACK_START,
});

const fetchFeedbackSucceeded = (feedbackList) => ({
  type: actionTypes.FETCH_FEEDBACK_SUCCEEDED,
  payload: feedbackList,
});

const fetchFeedbackFailed = (error) => ({
  type: actionTypes.FETCH_FEEDBACK_FAILED,
  payload: error,
});

export const fetchFeedback = () => (dispatch) => {
  dispatch(fetchFeedbackStart());
  api.fetchFeedback().then(
    (feedback) => {
      dispatch(fetchFeedbackSucceeded(feedback));
    },
    (errorMessage) => {
      dispatch(fetchFeedbackFailed(errorMessage));
    },
  );
};
