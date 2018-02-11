import {combineReducers} from 'redux';
import {localeReducer} from 'react-localize-redux';

import exerciseReducer from './exercise';
import authReducer from './auth';

export default combineReducers({
  exercise: exerciseReducer,
  auth: authReducer,
  locale: localeReducer
});
