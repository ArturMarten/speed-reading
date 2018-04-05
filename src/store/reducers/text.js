import { convertFromRaw } from 'draft-js';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  selectedText: null,
  texts: [],
  collections: [],
  selectStatus: {
    loading: false,
    error: null,
  },
  textsStatus: {
    loading: false,
    error: null,
  },
  collectionsStatus: {
    loading: false,
    error: null,
  },
  textStatus: {
    loading: false,
    message: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_TEXT_START: {
      return updateObject(state, {
        textStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.SAVE_TEXT_SUCCEEDED: {
      return updateObject(state, {
        textStatus: {
          loading: false,
          message: action.payload,
          error: null,
        },
      });
    }
    case actionTypes.SAVE_TEXT_FAILED: {
      return updateObject(state, {
        textStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.FETCH_TEXT_COLLECTIONS_START: {
      return updateObject(state, {
        collectionsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_TEXT_COLLECTIONS_SUCCEEDED: {
      return updateObject(state, {
        collections: action.payload,
        collectionsStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_TEXT_COLLECTIONS_FAILED: {
      return updateObject(state, {
        collectionsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.FETCH_TEXTS_START: {
      return updateObject(state, {
        textsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_TEXTS_SUCCEEDED: {
      return updateObject(state, {
        texts: action.payload,
        textsStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_TEXTS_FAILED: {
      return updateObject(state, {
        textsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.FETCH_READING_TEXT_START: {
      return updateObject(state, {
        selectStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_READING_TEXT_SUCCEEDED: {
      const updatedText = updateObject(action.payload, {
        text: convertFromRaw(action.payload.text),
      });
      return updateObject(state, {
        selectedText: updatedText,
        selectStatus: {
          loading: false,
          error: null,
        },
        textStatus: {
          loading: false,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_READING_TEXT_FAILED: {
      return updateObject(state, {
        selectStatus: {
          loading: true,
          error: action.payload,
        },
      });
    }
    case actionTypes.UNSELECT_TEXT: {
      return updateObject(state, {
        selectedText: null,
        selectStatus: {
          loading: false,
          error: null,
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
