import { EditorState, ContentState, Modifier, SelectionState, CompositeDecorator, convertToRaw, getVisibleSelectionRect } from 'draft-js';
import ReactDOM from 'react-dom';
import WordGroup from '../components/WordGroup';

import {
  START_REQUESTED,
  STOP_REQUESTED,
  RESET_REQUESTED,
  TICK,
  EDITOR_STATE_UPDATED,
  TEXT_OPTIONS_UPDATED,
  EXERCISE_OPTIONS_UPDATED,
  EXERCISE_SELECTED,
  FIXATION_UPDATED
} from '../actions';

const text = `Lorem ipsum dolor sit amet, praesent torquent dictum vel augue proin at, sollicitudin orci rhoncus semper, arcu et ut accumsan metus amet, mauris tellus tortor, magna imperdiet erat. Vel leo est velit tellus tellus, aliquet in, vestibulum ut erat, mi arcu elit arcu et amet. Elit orci hymenaeos accumsan sed sem ac, nec augue arcu sed in id, ac proin. Lacus aliquam diam pulvinar, neque mauris elementum eu, mauris auctor vestibulum amet turpis. Nunc sem aenean nec elit, elementum nulla, mauris est cillum et.`;

// Word grouping
const character_count = 15;
const sentenceRegex = /[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g;
const commaRegex = /[^,]+[\,]+|[^,]+$/g;
const wordRegex = RegExp('(.{1,' + character_count + '}(\\s|$))\\s*', 'g');

Array.prototype.flatMap = function(lambda) { 
  return Array.prototype.concat.apply([], this.map(lambda)); 
};

const splitIntoWordGroups = (text, character_count) => {
  return text.length > character_count ? splitWithPeriod(text, character_count) : [text]
}

// First split groups at "."
const splitWithPeriod = (text, character_count) => {
  return text.match(sentenceRegex).flatMap((sentence) => sentence.length > character_count ? splitWithComma(sentence, character_count) : sentence.trim())
}

// Then split groups at ","
const splitWithComma = (sentence, character_count) => {
  return sentence.match(commaRegex).flatMap((words) => words.length > character_count ? splitWords(words, character_count) : words.trim())
}

// Finally, split groups at " "
const splitWords = (words, character_count) => {
  return words.match(wordRegex).map((group) => group.trim());
}

const wordGroups = splitIntoWordGroups(text, character_count);

let wordGroupContent = ContentState.createFromText(text);
let counter = 0;
wordGroupContent = wordGroupContent.createEntity('TOKEN', 'IMMUTABLE');
wordGroups.forEach((group, index) => {
  let length = group.length;
  index === wordGroups.length ? length = group.length - 1 : ''
  wordGroupContent = Modifier.applyEntity(wordGroupContent, 
    new SelectionState({
      anchorKey: wordGroupContent.getFirstBlock().getKey(), 
      anchorOffset: counter, 
      focusKey: wordGroupContent.getFirstBlock().getKey(),
      focusOffset: counter + length - 1
    }), wordGroupContent.getLastCreatedEntityKey()
  );
  counter = counter + length;
});

const getEntityStrategy = (mutability) => {
  return (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return contentState.getEntity(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('IMMUTABLE'),
    component: WordGroup,
    props: {style: {marginRight: '50px'}}
  }
]);

const normalContent = ContentState.createFromText(text);
const firstBlock = normalContent.getFirstBlock();
const emptySelection = new SelectionState({
  anchorKey: firstBlock.getKey(), 
  anchorOffset: 0, 
  focusKey: firstBlock.getKey(), 
  focusOffset: 0
})

const words = firstBlock.getText().split(' ');

const initialState = {
  started: false,
  finished: false,
  resetted: false,
  type: '',
  counter: 0,
  position: 0,
  editorState: EditorState.createWithContent(normalContent),
//editorState: EditorState.createWithContent(wordGroupContent, decorator),
  text: text,
  wordGroups: wordGroups,
  words: words,
  selection: emptySelection,
  exerciseOptions: {
    wpm: 200,
    fixation: 200
  },
  textOptions: {
    width: 500,
    fontSize: 16
  }
};

const hiddenStyle = 'HIDDEN';

const ExerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_REQUESTED: {
      console.log('Started!');
      let contentState = state.editorState.getCurrentContent();
      switch(state.type) {
        case 'wordGroup': {
          // Keep hidden
          break;
        }
        default:
          const firstBlock = contentState.getFirstBlock();
          const lastBlock = contentState.getLastBlock();
          contentState = Modifier.removeInlineStyle(
            contentState, 
            new SelectionState({
              anchorKey: firstBlock.getKey(), 
              anchorOffset: 0, 
              focusKey: lastBlock.getKey(), 
              focusOffset: lastBlock.getLength()
            }), 
            hiddenStyle
          );
          break;
      }

      return {
        ...state, 
        started: true,
        resetted: false,
        editorState: EditorState.createWithContent(contentState, decorator)
      }
    }
    case STOP_REQUESTED: {
      console.log('Stopped!');
      let contentState = state.editorState.getCurrentContent();
      const firstBlock = contentState.getFirstBlock();
      const lastBlock = contentState.getLastBlock();
      contentState = Modifier.applyInlineStyle(
        contentState, 
        new SelectionState({
          anchorKey: firstBlock.getKey(), 
          anchorOffset: 0, 
          focusKey: lastBlock.getKey(), 
          focusOffset: lastBlock.getLength()
        }), 
        hiddenStyle
      );
      return {
        ...state, 
        started: false,
        editorState: EditorState.createWithContent(contentState, decorator)
      }
    }
    case RESET_REQUESTED: {
      console.log('Resetted!');
      let contentState = state.editorState.getCurrentContent();
      const firstBlock = contentState.getFirstBlock();
      const lastBlock = contentState.getLastBlock();
      contentState = Modifier.applyInlineStyle(
        contentState, 
        new SelectionState({
          anchorKey: firstBlock.getKey(), 
          anchorOffset: 0, 
          focusKey: lastBlock.getKey(), 
          focusOffset: lastBlock.getLength()
        }), 
        hiddenStyle
      );
      return {
        ...state, 
        started: false,
        resetted: true,
        finished: false,
        editorState: EditorState.createWithContent(contentState, decorator),       
        counter: 0,
        position: 0,
        selection: emptySelection
      }
    }
    case EDITOR_STATE_UPDATED: {
      return {
        ...state,
        editorState: action.payload,
      }
    }
    case TICK: {
      //console.log('Tick!');
      let contentState = state.editorState.getCurrentContent();
      const firstBlock = contentState.getFirstBlock();
      let newState = {...state};
      newState.counter = state.counter + 1;
      switch(state.type) {
        case 'reading': {
          break;
        }
        case 'wordGroup': {
          let newPosition = state.position;
          if (wordGroups[state.counter]) {
            newPosition = state.position + wordGroups[state.counter].length;
          }
          const wordGroupSelection = new SelectionState({
            anchorKey: firstBlock.getKey(), 
            anchorOffset: state.position, 
            focusKey: firstBlock.getKey(), 
            focusOffset: newPosition - 1
          });
          newState.position = newPosition
          newState.selection = wordGroupSelection;
          const selectedText = EditorState.forceSelection(state.editorState, wordGroupSelection);
          newState.editorState = selectedText;
          break;
        }
        case 'disappearing': {
          let newPosition = state.position;
          if (words[state.counter]) {
            newPosition = state.position + words[state.counter].length + 1;
          }
          const wordSelection = new SelectionState({
            anchorKey: firstBlock.getKey(), 
            anchorOffset: state.position, 
            focusKey: firstBlock.getKey(), 
            focusOffset: newPosition - 1
          });
          newState.position = newPosition
          newState.selection = wordSelection;
          const selectedText = EditorState.forceSelection(state.editorState, wordSelection);
          newState.editorState = selectedText;
          break;
        }
        default:
          console.error('Unknown exercise type!');
          break;
      }
      if (newState.position >= firstBlock.getLength()) {
        newState.finished = true;
      }
      //console.log(getVisibleSelectionRect(window));
      return {
        ...newState
      }
    }
    case TEXT_OPTIONS_UPDATED: {
      return {
        ...state,
        textOptions: Object.assign(state.textOptions, action.payload)
      }
    }
    case EXERCISE_OPTIONS_UPDATED: {
      return {
        ...state,
        exerciseOptions: Object.assign(state.exerciseOptions, action.payload)
      }
    }
    case EXERCISE_SELECTED: {
      let editorState = state.editorState;
      let contentState = state.editorState.getCurrentContent();
      const firstBlock = contentState.getFirstBlock();
      let allInvisibleState = Modifier.applyInlineStyle(
        contentState, 
        new SelectionState({
          anchorKey: firstBlock.getKey(), 
          anchorOffset: 0, 
          focusKey: firstBlock.getKey(), 
          focusOffset: firstBlock.getLength()
        }), 
        hiddenStyle
      );
      editorState = EditorState.createWithContent(allInvisibleState);
      
      return {
        ...state,
        type: action.payload,
        editorState: editorState
      }
    }
    case FIXATION_UPDATED: {
      return {
        ...state,
        fixation: action.payload
      }
    }
    default:
      return state;
  }
}

export default ExerciseReducer;