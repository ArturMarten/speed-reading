import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { localeReducer } from 'react-localize-redux';

import authReducer from './auth';
import textReducer from './text';
import timingReducer from './timing';
import optionsReducer from './options';
import exerciseReducer from './exercise';
import exerciseTestReducer from './exerciseTest';
import groupReducer from './group';
import userReducer from './user';
import profileReducer from './profile';
import statisticsReducer from './statistics';
import feedbackReducer from './feedback';
import problemReportReducer from './problemReport';
import bugReportReducer from './bugReport';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    text: textReducer,
    timing: timingReducer,
    options: optionsReducer,
    exercise: exerciseReducer,
    exerciseTest: exerciseTestReducer,
    group: groupReducer,
    user: userReducer,
    profile: profileReducer,
    statistics: statisticsReducer,
    feedback: feedbackReducer,
    problemReport: problemReportReducer,
    bugReport: bugReportReducer,
    locale: localeReducer,
  });

export default createRootReducer;
