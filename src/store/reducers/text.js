import { convertFromRaw } from 'draft-js';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  selectedText: null,
  texts: [],
  collections: [],
  analysis: null,
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
  analyzeStatus: {
    loading: false,
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
      const updatedText = updateObject(action.payload.text, {
        contentState: convertFromRaw(action.payload.text.contentState),
      });
      return updateObject(state, {
        selectedText: updateObject(state.selectedText, {
          ...updatedText,
        }),
        textStatus: {
          loading: false,
          message: action.payload.message,
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
        contentState: convertFromRaw(action.payload.contentState),
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
        analysis: null,
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
    case actionTypes.SELECT_OWN_TEXT_START: {
      return updateObject(state, {
        selectStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.SELECT_OWN_TEXT_SUCCEEDED: {
      const updatedText = updateObject(action.payload, {
        contentState: convertFromRaw(action.payload.contentState),
        keywords: [],
      });
      return updateObject(state, {
        selectedText: updatedText,
        selectStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.SELECT_OWN_TEXT_FAILED: {
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
        analysis: null,
      });
    }
    case actionTypes.ANALYZE_TEXT_START: {
      return updateObject(state, {
        analysis: null,
        analyzeStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.ANALYZE_TEXT_SUCCEEDED: {
      const analysis = action.payload;
      const { wordLengths, sentenceLengthsInWords, wordTypeCounts } = analysis;

      const updatedWordLengths = [];
      Object.keys(wordLengths).sort((a, b) => a - b).forEach((wordLength, index) => {
        updatedWordLengths.push({
          id: index,
          x: +wordLength,
          y: wordLengths[wordLength],
        });
      });

      const updatedSentenceLengthsInWords = [];
      Object.keys(sentenceLengthsInWords).sort((a, b) => a - b).forEach((sentenceLength, index) => {
        updatedSentenceLengthsInWords.push({
          id: index,
          x: +sentenceLength,
          y: sentenceLengthsInWords[sentenceLength],
        });
      });

      const updatedWordTypeCounts = [];
      Object.keys(wordTypeCounts).forEach((wordType, index) => {
        updatedWordTypeCounts.push({
          id: index,
          x: wordType,
          y: wordTypeCounts[wordType],
        });
      });

      const updatedAnalysis = updateObject(analysis, {
        wordLengths: updatedWordLengths,
        sentenceLengthsInWords: updatedSentenceLengthsInWords,
        wordTypeCounts: updatedWordTypeCounts,
      });

      return updateObject(state, {
        analysis: updatedAnalysis,
        analyzeStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.ANALYZE_TEXT_FAILED: {
      return updateObject(state, {
        analysis: null,
        analyzeStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
