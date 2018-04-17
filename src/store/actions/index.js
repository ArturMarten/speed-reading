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
  prepareTest,
  startTest,
  finishTest,
  endTest,
} from './test';

export {
  authLogin,
  authLogout,
  authCheckState,
  changePassword,
} from './auth';

export {
  fetchTextCollections,
  fetchTexts,
  selectText,
  unselectText,
  saveText,
} from './text';

export {
  fetchUsers,
  addUser,
  changeUser,
  fetchGroups,
  addGroup,
  changeGroup,
} from './manage';

export { fetchUserProfile } from './profile';

export { fetchExerciseStatistics } from './statistics';

export { sendFeedback } from './feedback';

export { sendBugReport } from './bugReport';
