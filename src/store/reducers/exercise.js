import * as actionTypes from '../actions/actionTypes';
import {EditorState, ContentState, convertFromHTML} from 'draft-js';
import {splitIntoWordGroups} from '../../utils/TextUtils';

// eslint-disable-next-line
const text = 'Lorem ipsum dolor sit amet, praesent torquent dictum vel augue proin at, sollicitudin orci rhoncus semper, arcu et ut accumsan metus amet, mauris tellus tortor, magna imperdiet erat. Vel leo est velit tellus tellus, aliquet in, vestibulum ut erat, mi arcu elit arcu et amet. Elit orci hymenaeos accumsan sed sem ac, nec augue arcu sed in id, ac proin. Lacus aliquam diam pulvinar, neque mauris elementum eu, mauris auctor vestibulum amet turpis. Nunc sem aenean nec elit, elementum nulla, mauris est cillum et.';

// eslint-disable-next-line
const blocksFromHTML = convertFromHTML('<p><b>Musuo hõim – kas naiste maailm või meeste paradiis?</b></p><p>Toimetas: Ksenia Kask</p><p>Peamine, mis muutub, on see, et seni kehtinud patriarhaalne võim laguneb ning naiselik energia pääseb valitsema. Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja agressiivsus ning läbi aastasadade on seda olnud enam kui küllalt. Naiselikku energiat iseloomustab hoolitsemine, hoolimine ja kaitsemine, mida meie planeedil oleks hädasti vaja. Kas uskuda maiade ennustusi või mitte, see jääb igaühe enda otsustada, aga Tiibeti mägede varjus Lugu järve ääres elav mosuo hõim võib oma kogukonna ülesehituse osas olla üks näide sellest, kuidas toimib matriarhaat – ühiskond, kus naised otsustavad.</p><p>Mosuo rahvas on väike etniline grupp, kes elab Yunnani ja Sichuani provintsides Hiinas, Tiibeti piiri lähedal. Neid on umbes 40 000 ning enamus elab Lugu järve ääres Himaalaja mägedes. Tuhandeid aastaid ei olnud järvele ligipääsuteed ning lähimasse asulasse reisimine võttis aega enam kui kolm päeva. Nii et inimesed elasid oma elu traditsioonilisel moel ilma välismaailmast tulenevate mõjudeta. Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna matriarhaat. Naised on sageli perepead, pärimine käib naisliini pidi ning ka äriotsuseid langetavad naised. Kuid erinevalt tõelisest matriarhaadist kipub poliitiline võim olema meeste käes.</p><p>Mosuod on mitmes mõttes väga traditsiooniline kultuur. Peredes elab koos mitu põlvkonda, nad tegelevad peamiselt põllumajandusega, valmistavad suurema hulga tarbeesemetest ise ning on toidu kasvatamisel sõltumatud. Naised teevad ise valdava enamuse majapidamistöid, mehed on enamasti vastutavad loomade eest hoolitsemise ja kalastamise eest. Kuid mosuode ühiskonnas on üks oluline erinevus, mis teeb neid unikaalseks: neil on kombeks n-ö visiitabielu, kus naine otsustab, millise mehe ta ööseks enda juurde lubab ning kui kaua ta sellest mehest huvitatud on. Traditsioonilises mõttes ei ole kummalgi partneril abikaasa kohustusi, nad ei jaga majapidamiskohustusi ning lapsed elavad koos ema laiendatud perega.</p>');

const selectedText = {
  content: ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap),
  wordCount: 288
};

const initialState = {
  exerciseState: {
    started: false,
    paused: false,
    resetted: false,
    finished: false
  },
  settingsConfirmed: false,
  started: false,
  finished: false,
  resetted: false,
  type: '',
  editorState: EditorState.createWithContent(ContentState.createFromText(text)),
  text: text,
  selectedText: selectedText,
  wordGroups: splitIntoWordGroups(text, 15),
  words: text.split(' '),
  startTime: 0,
  elapsedTime: 0,
  exerciseOptions: {
    wpm: 300,
    fixation: 150,
    characterCount: 15
  },
  textOptions: {
    font: 'Calibri',
    width: 700,
    lineCount: 5,
    fontSize: 16
  },
  textSaveStatus: 'Unsaved'
};

const exerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_REQUESTED: {
      console.log('Started!');
      return {
        ...state,
        startTime: Date.now(),
        started: true,
        resetted: false,
        exerciseState: {
          ...state.exerciseState,
          started: true,
          resetted: false,
          paused: false
        }
      };
    }
    case actionTypes.PAUSE_REQUESTED: {
      const elapsedTime = state.elapsedTime + (Date.now() - state.startTime);
      console.log('Paused! Elapsed: ' + elapsedTime + 'ms');
      return {
        ...state,
        elapsedTime: elapsedTime,
        started: false,
        exerciseState: {
          ...state.exerciseState,
          paused: true
        }
      };
    }
    case actionTypes.RESET_REQUESTED: {
      console.log('Resetted!');
      return {
        ...state,
        startTime: 0,
        elapsedTime: 0,
        started: false,
        resetted: true,
        finished: false,
        exerciseState: {
          started: false,
          paused: true,
          resetted: true,
          finished: false
        }
      };
    }
    case actionTypes.FINISH_REQUESTED: {
      const elapsedTime = state.elapsedTime + (Date.now() - state.startTime);
      console.log('Finished! Elapsed: ' + elapsedTime + 'ms');
      return {
        ...state,
        elapsedTime: elapsedTime,
        exerciseState: {
          ...state.exerciseState,
          paused: true,
          finished: true
        }
      };
    }
    case actionTypes.EDITOR_STATE_UPDATED: {
      return {
        ...state,
        editorState: action.payload,
        text: action.payload.getCurrentContent().getPlainText('\n').replace(/\n/g, ''),
        content: action.payload.getCurrentContent()
      };
    }
    case actionTypes.TEXT_OPTIONS_UPDATED: {
      return {
        ...state,
        textOptions: {...action.payload}
      };
    }
    case actionTypes.EXERCISE_OPTIONS_UPDATED: {
      const wordGroups =
        state.exerciseOptions.characterCount === action.payload.characterCount ?
        state.wordGroups : splitIntoWordGroups(text, action.payload.characterCount);
      return {
        ...state,
        exerciseOptions: {...action.payload},
        wordGroups: wordGroups
      };
    }
    case actionTypes.EXERCISE_SELECTED: {
      console.log('Exercise selected: ' + action.payload);
      return {
        ...state,
        type: action.payload,
        exerciseState: {
          started: false,
          paused: false,
          resetted: false,
          finished: false
        },
        elapsedTime: 0
      };
    }
    case actionTypes.TEXT_SAVE_REQUESTED: {
      return {
        ...state,
        textSaveStatus: 'Saving'
      };
    }
    case actionTypes.TEXT_SAVE_SUCCEEDED: {
      return {
        ...state,
        textSaveStatus: 'Saved'
      };
    }
    default:
      return state;
  }
};

export default exerciseReducer;
