import {combineReducers} from 'redux';
import {localeReducer} from 'react-localize-redux';

import ExerciseReducer from './ExerciseReducer';

export default combineReducers({
  exercise: ExerciseReducer,
  locale: localeReducer
});
