import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

export const sendFeedbackStart = () => ({
  type: actionTypes.SEND_FEEDBACK_START,
});

export const sendFeedbackSucceeded = message => ({
  type: actionTypes.SEND_FEEDBACK_SUCCEEDED,
  message,
});

export const sendFeedbackFailed = error => ({
  type: actionTypes.SEND_FEEDBACK_FAILED,
  error,
});

export const sendFeedback = feedback => (dispatch) => {
  dispatch(sendFeedbackStart());
  const data = {
    message: feedback.message,
    functionalityRating: feedback.functionalityRating,
    usabilityRating: feedback.usabilityRating,
    designRating: feedback.designRating,
  };
  axios.post('/feedback', data)
    .then((response) => {
      console.log(response);
      dispatch(sendFeedbackSucceeded(response.data.message));
    })
    .catch((error) => {
      dispatch(sendFeedbackFailed(error.response.data.error));
    });
};
