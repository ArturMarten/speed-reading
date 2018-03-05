import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: null,
  sent: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_FEEDBACK_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.SEND_FEEDBACK_SUCCEEDED:
      return {
        ...state,
        loading: false,
        error: null,
        sent: true,
      };
    case actionTypes.SEND_FEEDBACK_FAILED:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
