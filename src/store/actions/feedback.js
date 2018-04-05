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
      dispatch(sendFeedbackSucceeded(serverSuccessMessage(response)));
    }, (error) => {
      dispatch(sendFeedbackFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(sendFeedbackFailed(error.message));
    });
};

export default sendFeedback;
