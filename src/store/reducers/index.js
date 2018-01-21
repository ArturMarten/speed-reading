import {combineReducers} from 'redux';
import {localeReducer} from 'react-localize-redux';

import exerciseReducer from './exercise';

export default combineReducers({
  exercise: exerciseReducer,
  locale: localeReducer
});
