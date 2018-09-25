export {
  dismissExerciseSettingsInfo,
  dismissSpeedChangeInfo,
} from './info';

export {
  startTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  stopTimer,
} from './timing';

export {
  textOptionUpdated,
  exerciseOptionUpdated,
  speedOptionUpdated,
  resetTextOptions,
  resetExerciseOptions,
} from './options';

export {
  selectExercise,
  changeModification,
  prepareTextExercise,
  prepareHelpExercise,
  startExercise,
  finishReadingExercise,
  finishHelpExercise,
  retryExercise,
  endExercise,
} from './exercise';

export {
  fetchTestEditorQuestions,
  addQuestion,
  changeQuestion,
  removeQuestion,
  addAnswer,
  changeAnswer,
  removeAnswer,
  prepareQuestionTest,
  prepareBlankTest,
  startTest,
  finishQuestionTest,
  finishBlankTest,
  endTest,
} from './test';

export {
  register,
  login,
  logout,
  authCheckState,
  changePassword,
} from './auth';

export {
  fetchTextCollections,
  fetchTexts,
  selectText,
  selectOwnText,
  unselectText,
  saveText,
  analyzeText,
} from './text';

export {
  fetchGroups,
  addGroup,
  changeGroup,
} from './group';

export {
  fetchUsers,
  addUser,
  changeUser,
} from './user';

export { fetchUserProfile } from './profile';

export { fetchExerciseStatistics } from './statistics';

export {
  sendFeedback,
  fetchFeedback,
} from './feedback';

export {
  sendProblemReport,
  fetchProblemReports,
} from './problemReport';

export {
  sendBugReport,
  fetchBugReports,
} from './bugReport';
