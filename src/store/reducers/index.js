import { combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';

import infoReducer from './info';
import authReducer from './auth';
import textReducer from './text';
import timingReducer from './timing';
import optionsReducer from './options';
import exerciseReducer from './exercise';
import testReducer from './test';
import manageReducer from './manage';
import profileReducer from './profile';
import statisticsReducer from './statistics';
import feedbackReducer from './feedback';
import bugReportReducer from './bugReport';

export default combineReducers({
  info: infoReducer,
  auth: authReducer,
  text: textReducer,
  timing: timingReducer,
  options: optionsReducer,
  exercise: exerciseReducer,
  test: testReducer,
  manage: manageReducer,
  profile: profileReducer,
  statistics: statisticsReducer,
  feedback: feedbackReducer,
  bugReport: bugReportReducer,
  locale: localeReducer,
});
