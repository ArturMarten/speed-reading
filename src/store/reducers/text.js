import { convertFromRaw } from 'draft-js';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  selectedText: null,
  savingText: false,
  fetchingTexts: false,
  fetchingCollections: false,
  selecting: false,
  texts: [],
  collections: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TEXT_SAVE_START: {
      return updateObject(state, {
        savingText: true,
      });
    }
    case actionTypes.TEXT_SAVE_SUCCEEDED: {
      return updateObject(state, {
        savingText: false,
      });
    }
    case actionTypes.FETCH_TEXT_COLLECTIONS_START: {
      return updateObject(state, {
        fetchingCollections: true,
      });
    }
    case actionTypes.FETCH_TEXT_COLLECTIONS_SUCCEEDED: {
      return updateObject(state, {
        collections: action.payload,
        fetchingCollections: false,
      });
    }
    case actionTypes.FETCH_TEXT_COLLECTIONS_FAILED: {
      return updateObject(state, {
        fetchingCollections: false,
      });
    }
    case actionTypes.FETCH_TEXTS_START: {
      return updateObject(state, {
        fetchingTexts: true,
      });
    }
    case actionTypes.FETCH_TEXTS_SUCCEEDED: {
      return updateObject(state, {
        texts: action.payload,
        fetchingTexts: false,
      });
    }
    case actionTypes.FETCH_TEXTS_FAILED: {
      return updateObject(state, {
        fetchingTexts: false,
      });
    }
    case actionTypes.GET_TEXT_START: {
      return updateObject(state, {
        selecting: true,
      });
    }
    case actionTypes.GET_TEXT_SUCCEEDED: {
      const updatedText = updateObject(action.payload, {
        text: convertFromRaw(action.payload.text),
      });
      return updateObject(state, {
        selectedText: updatedText,
        selecting: false,
      });
    }
    case actionTypes.GET_TEXT_FAILED: {
      return updateObject(state, {
        selecting: false,
      });
    }
    case actionTypes.UNSELECT_TEXT: {
      return updateObject(state, {
        selectedText: null,
      });
    }
    default:
      return state;
  }
};

export default reducer;
