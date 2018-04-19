import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../../shared/utility';

const sendFeedbackStart = () => ({
  type: actionTypes.SEND_FEEDBACK_START,
});

const sendFeedbackSucceeded = message => ({
  type: actionTypes.SEND_FEEDBACK_SUCCEEDED,
  payload: message,
});

const sendFeedbackFailed = error => ({
  type: actionTypes.SEND_FEEDBACK_FAILED,
  payload: error,
});

export const sendFeedback = feedbackData => (dispatch) => {
  dispatch(sendFeedbackStart());
  axios.post('/feedback', feedbackData)
    .then((response) => {
      dispatch(sendFeedbackSucceeded(serverSuccessMessage(response)));
    }, (error) => {
      dispatch(sendFeedbackFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(sendFeedbackFailed(error.message));
    });
};

const fetchFeedbackStart = () => ({
  type: actionTypes.FETCH_FEEDBACK_START,
});

const fetchFeedbackSucceeded = feedbackList => ({
  type: actionTypes.FETCH_FEEDBACK_SUCCEEDED,
  payload: feedbackList,
});

const fetchFeedbackFailed = error => ({
  type: actionTypes.FETCH_FEEDBACK_FAILED,
  payload: error,
});

export const fetchFeedback = token => (dispatch) => {
  dispatch(fetchFeedbackStart());
  axios.get('/feedback', { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchFeedbackSucceeded(response.data));
    }, (error) => {
      dispatch(fetchFeedbackFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchFeedbackFailed(error.message));
    });
};
