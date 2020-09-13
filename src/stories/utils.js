import { getTranslate, localeReducer, initialize, addTranslation } from 'react-localize-redux';
import translations from '../assets/translations.locale.json';

const state = {
  languages: [],
  translations: {},
  options: {},
};

const initializeAction = initialize(['ee', 'gb'], { defaultLanguage: 'ee' });
const initState = localeReducer(state, initializeAction);
const updatedState = localeReducer(initState, addTranslation(translations));
export const translate = getTranslate(updatedState);

export default translate;
