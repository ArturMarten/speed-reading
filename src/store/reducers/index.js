import {combineReducers} from 'redux';
import {localeReducer} from 'react-localize-redux';

import authReducer from './auth';
import textReducer from './text';
import timingReducer from './timing';
import optionsReducer from './options';
import exerciseReducer from './exercise';

export default combineReducers({
  auth: authReducer,
  text: textReducer,
  timing: timingReducer,
  options: optionsReducer,
  exercise: exerciseReducer,
  locale: localeReducer
});
