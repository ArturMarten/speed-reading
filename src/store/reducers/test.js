import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  loading: false,
  error: null,
  questions: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_QUESTIONS_START: {
      return updateObject(state, {
        loading: true,
        error: null,
      });
    }
    case actionTypes.FETCH_QUESTIONS_SUCCEEDED: {
      return updateObject(state, {
        loading: false,
        error: null,
        questions: action.payload,
      });
    }
    case actionTypes.FETCH_QUESTIONS_FAILED: {
      return updateObject(state, {
        error: action.payload.error,
        loading: false,
      });
    }
    case actionTypes.ADD_QUESTION_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.ADD_QUESTION_SUCCEEDED: {
      const newQuestion = updateObject(action.payload.questionData, {
        id: action.payload.questionId,
        answers: [],
      });
      return updateObject(state, {
        questions: state.questions.concat(newQuestion),
      });
    }
    case actionTypes.ADD_QUESTION_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_QUESTION_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_QUESTION_SUCCEEDED: {
      const updatedQuestions = state.questions
        .map(question => (question.id === action.payload.questionId ?
          updateObject(question, action.payload.questionData) : question));
      return updateObject(state, {
        questions: updatedQuestions,
      });
    }
    case actionTypes.CHANGE_QUESTION_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.REMOVE_QUESTION_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.REMOVE_QUESTION_SUCCEEDED: {
      return updateObject(state, {
        questions: state.questions
          .filter(question => question.id !== action.payload),
      });
    }
    case actionTypes.REMOVE_QUESTION_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.ADD_ANSWER_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.ADD_ANSWER_SUCCEEDED: {
      const newAnswer = updateObject(action.payload.answerData, {
        id: action.payload.answerId,
      });
      const updatedQuestions = state.questions
        .map(question => (question.id === newAnswer.questionId ?
          updateObject(question, { answers: question.answers.concat(newAnswer) }) : question));

      return updateObject(state, {
        questions: updatedQuestions,
      });
    }
    case actionTypes.ADD_ANSWER_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_ANSWER_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_ANSWER_SUCCEEDED: {
      const updatedQuestions = state.questions
        .map(question => (question.id === action.payload.questionId ?
          updateObject(question, {
            answers: question.answers
              .map(answer => (answer.id === action.payload.answerId ? updateObject(answer, action.payload.answerData) : answer)),
          }) : question));
      return updateObject(state, {
        questions: updatedQuestions,
      });
    }
    case actionTypes.CHANGE_ANSWER_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.REMOVE_ANSWER_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.REMOVE_ANSWER_SUCCEEDED: {
      const updatedQuestions = state.questions
        .map(question => (question.id === action.payload.questionId ?
          updateObject(question, {
            answers: question.answers
              .filter(answer => answer.id !== action.payload.answerId),
          }) : question));
      return updateObject(state, {
        questions: updatedQuestions,
      });
    }
    case actionTypes.REMOVE_ANSWER_FAILED: {
      return updateObject(state, {
      });
    }
    default:
      return state;
  }
};

export default reducer;
