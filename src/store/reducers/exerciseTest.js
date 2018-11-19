import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialQuestionStatus = {
  loading: false,
  message: null,
  error: null,
};

const initialAnswerStatus = {
  loading: false,
  message: null,
  error: null,
};

const initialState = {
  questions: [],
  questionsStatus: {
    loading: false,
    error: null,
  },
  blankExercises: [],
  blankExercisesStatus: {
    loading: false,
    error: null,
  },
  questionStatus: initialQuestionStatus,
  answerStatus: initialAnswerStatus,
  status: 'preparation',
  attemptId: null,
  answers: [],
  result: {
    elapsedTime: 0,
    total: 1,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_QUESTIONS_START: {
      return updateObject(state, {
        questionsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_QUESTIONS_SUCCEEDED: {
      return updateObject(state, {
        questions: action.payload,
        questionsStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_QUESTIONS_FAILED: {
      return updateObject(state, {
        questionsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.ADD_QUESTION_START: {
      return updateObject(state, {
        questionStatus: {
          loading: true,
          message: null,
          error: null,
        },
        answerStatus: initialAnswerStatus,
      });
    }
    case actionTypes.ADD_QUESTION_SUCCEEDED: {
      const newQuestion = updateObject(action.payload.questionData, {
        id: action.payload.questionId,
        answers: [],
      });
      return updateObject(state, {
        questions: state.questions.concat(newQuestion),
        questionStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
      });
    }
    case actionTypes.ADD_QUESTION_FAILED: {
      return updateObject(state, {
        questionStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.CHANGE_QUESTION_START: {
      return updateObject(state, {
        questionStatus: {
          loading: true,
          message: null,
          error: null,
        },
        answerStatus: initialAnswerStatus,
      });
    }
    case actionTypes.CHANGE_QUESTION_SUCCEEDED: {
      const updatedQuestions = state.questions
        .map(question => (question.id === action.payload.questionId ?
          updateObject(question, action.payload.questionData) : question));
      return updateObject(state, {
        questions: updatedQuestions,
        questionStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
      });
    }
    case actionTypes.CHANGE_QUESTION_FAILED: {
      return updateObject(state, {
        questionStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.REMOVE_QUESTION_START: {
      return updateObject(state, {
        questionStatus: {
          loading: true,
          message: null,
          error: null,
        },
        answerStatus: initialAnswerStatus,
      });
    }
    case actionTypes.REMOVE_QUESTION_SUCCEEDED: {
      return updateObject(state, {
        questions: state.questions
          .filter(question => question.id !== action.payload.id),
        questionStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
      });
    }
    case actionTypes.REMOVE_QUESTION_FAILED: {
      return updateObject(state, {
        questionStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.ADD_ANSWER_START: {
      return updateObject(state, {
        answerStatus: {
          loading: true,
          message: null,
          error: null,
        },
        questionStatus: initialQuestionStatus,
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
        answerStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
      });
    }
    case actionTypes.ADD_ANSWER_FAILED: {
      return updateObject(state, {
        answerStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.CHANGE_ANSWER_START: {
      return updateObject(state, {
        answerStatus: {
          loading: true,
          message: null,
          error: null,
        },
        questionStatus: initialQuestionStatus,
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
        answerStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
      });
    }
    case actionTypes.CHANGE_ANSWER_FAILED: {
      return updateObject(state, {
        answerStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.REMOVE_ANSWER_START: {
      return updateObject(state, {
        answerStatus: {
          loading: true,
          message: null,
          error: null,
        },
        questionStatus: initialQuestionStatus,
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
        answerStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
      });
    }
    case actionTypes.REMOVE_ANSWER_FAILED: {
      return updateObject(state, {
        answerStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.GENERATE_BLANK_EXERCISES_START: {
      return updateObject(state, {
        blankExercisesStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.GENERATE_BLANK_EXERCISES_SUCCEEDED: {
      return updateObject(state, {
        blankExercisesStatus: {
          loading: false,
          error: null,
        },
        blankExercises: action.payload
          .map((blankExercise, index) => ({ id: index, ...blankExercise })),
      });
    }
    case actionTypes.GENERATE_BLANK_EXERCISES_FAILED: {
      return updateObject(state, {
        blankExercisesStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.TEST_PREPARING: {
      return updateObject(state, {
        status: 'preparing',
      });
    }
    case actionTypes.TEST_PREPARED: {
      return updateObject(state, {
        status: 'prepared',
      });
    }
    case actionTypes.TEST_PREPARE_FAILED: {
      return updateObject(state, {
        status: 'preparation',
      });
    }
    case actionTypes.TEST_STARTING: {
      return updateObject(state, {
        status: 'starting',
      });
    }
    case actionTypes.TEST_STARTED: {
      return updateObject(state, {
        status: 'started',
      });
    }
    case actionTypes.TEST_START_FAILED: {
      return updateObject(state, {
        status: 'prepared',
      });
    }
    case actionTypes.TEST_ATTEMPT_START: {
      return updateObject(state, {
        attemptId: action.payload,
      });
    }
    case actionTypes.TEST_FINISHING: {
      return updateObject(state, {
        status: 'finishing',
      });
    }
    case actionTypes.TEST_FINISHED: {
      const result = updateObject(state.result, action.payload.result);
      const answers = action.payload.answers ? action.payload.answers : [];
      return updateObject(state, {
        status: 'finished',
        answers,
        result,
      });
    }
    case actionTypes.TEST_END: {
      // Cleanup after test end
      return updateObject(state, {
        attemptId: null,
        status: 'preparation',
      });
    }
    case actionTypes.EXERCISE_PREPARED:
      return updateObject(state, {
        ...initialState,
      });
    default:
      return state;
  }
};

export default reducer;
