import { combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';

import authReducer from './auth';
import textReducer from './text';
import timingReducer from './timing';
import optionsReducer from './options';
import exerciseReducer from './exercise';
import testReducer from './test';
import manageReducer from './manage';
import feedbackReducer from './feedback';

export default combineReducers({
  auth: authReducer,
  text: textReducer,
  timing: timingReducer,
  options: optionsReducer,
  exercise: exerciseReducer,
  test: testReducer,
  manage: manageReducer,
  feedback: feedbackReducer,
  locale: localeReducer,
});
