import ExerciseReducer from './ExerciseReducer';

import {combineReducers} from 'redux';

export default combineReducers({
  exercise: ExerciseReducer
});