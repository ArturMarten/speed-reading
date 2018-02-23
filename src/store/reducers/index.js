import {combineReducers} from 'redux';
import {localeReducer} from 'react-localize-redux';

import exerciseReducer from './exercise';
import timingReducer from './timing';
import authReducer from './auth';

export default combineReducers({
  exercise: exerciseReducer,
  timing: timingReducer,
  auth: authReducer,
  locale: localeReducer
});
