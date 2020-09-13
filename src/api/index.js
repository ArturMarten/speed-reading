export {
  register,
  login,
  saveToken,
  changePassword,
} from './auth';

export {
  sendBugReport,
  fetchBugReports,
  resolveBugReport,
} from './bugReport';

export {
  startExercise,
  finishExercise,
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
  addTestRating,
  fetchTestQuestionAnswers,
  fetchTestBlankAnswers,
  changeTestBlankAnswer,
  reevaluateTestAttempt,
} from './exerciseTest';

export {
  sendFeedback,
  fetchFeedback,
} from './feedback';

export {
  fetchGroups,
  addGroup,
  changeGroup,
} from './group';

export {
  sendProblemReport,
  fetchProblemReports,
  resolveProblemReport,
} from './problemReport';

export {
  fetchUserProfile,
  saveUserProfile,
} from './profile';

export {
  fetchAchievements,
} from './achievements';

export {
  fetchApplicationStatistics,
  fetchUserExerciseStatistics,
  fetchGroupExerciseStatistics,
} from './statistics';

export {
  saveText,
  fetchTextCollections,
  fetchTexts,
  selectText,
  analyzeText,
  addTextRating,
} from './text';

export {
  fetchUsers,
  addUser,
  changeUser,
} from './user';

export { exportFile } from './utils';
