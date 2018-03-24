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
  prepareExercise,
  startExercise,
  finishExercise,
} from './exercise';

export {
  fetchQuestions,
  addQuestion,
  changeQuestion,
  removeQuestion,
  addAnswer,
  changeAnswer,
  removeAnswer,
  prepareTest,
  startTest,
  finishTest,
} from './test';

export {
  authLogin,
  authLogout,
  authCheckState,
} from './auth';

export {
  fetchTextCollections,
  fetchTexts,
  selectText,
  unselectText,
  storeText,
} from './text';

export {
  fetchUsers,
  addUser,
  changeUser,
  fetchGroups,
  addGroup,
  changeGroup,
} from './manage';

export { sendFeedback } from './feedback';
