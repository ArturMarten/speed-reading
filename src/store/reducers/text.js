import { EditorState, ContentState, convertFromHTML, convertFromRaw } from 'draft-js';
import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject } from '../../shared/utility';

// eslint-disable-next-line max-len
const text = 'Lorem ipsum dolor sit amet, praesent torquent dictum vel augue proin at, sollicitudin orci rhoncus semper, arcu et ut accumsan metus amet, mauris tellus tortor, magna imperdiet erat. Vel leo est velit tellus tellus, aliquet in, vestibulum ut erat, mi arcu elit arcu et amet. Elit orci hymenaeos accumsan sed sem ac, nec augue arcu sed in id, ac proin. Lacus aliquam diam pulvinar, neque mauris elementum eu, mauris auctor vestibulum amet turpis. Nunc sem aenean nec elit, elementum nulla, mauris est cillum et.';

// eslint-disable-next-line max-len
const blocksFromHTML = convertFromHTML('<p><b>Musuo hõim – kas naiste maailm või meeste paradiis?</b></p><p>Toimetas: Ksenia Kask</p><p>Peamine, mis muutub, on see, et seni kehtinud patriarhaalne võim laguneb ning naiselik energia pääseb valitsema. Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja agressiivsus ning läbi aastasadade on seda olnud enam kui küllalt. Naiselikku energiat iseloomustab hoolitsemine, hoolimine ja kaitsemine, mida meie planeedil oleks hädasti vaja. Kas uskuda maiade ennustusi või mitte, see jääb igaühe enda otsustada, aga Tiibeti mägede varjus Lugu järve ääres elav mosuo hõim võib oma kogukonna ülesehituse osas olla üks näide sellest, kuidas toimib matriarhaat – ühiskond, kus naised otsustavad.</p><p>Mosuo rahvas on väike etniline grupp, kes elab Yunnani ja Sichuani provintsides Hiinas, Tiibeti piiri lähedal. Neid on umbes 40 000 ning enamus elab Lugu järve ääres Himaalaja mägedes. Tuhandeid aastaid ei olnud järvele ligipääsuteed ning lähimasse asulasse reisimine võttis aega enam kui kolm päeva. Nii et inimesed elasid oma elu traditsioonilisel moel ilma välismaailmast tulenevate mõjudeta. Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna matriarhaat. Naised on sageli perepead, pärimine käib naisliini pidi ning ka äriotsuseid langetavad naised. Kuid erinevalt tõelisest matriarhaadist kipub poliitiline võim olema meeste käes.</p><p>Mosuod on mitmes mõttes väga traditsiooniline kultuur. Peredes elab koos mitu põlvkonda, nad tegelevad peamiselt põllumajandusega, valmistavad suurema hulga tarbeesemetest ise ning on toidu kasvatamisel sõltumatud. Naised teevad ise valdava enamuse majapidamistöid, mehed on enamasti vastutavad loomade eest hoolitsemise ja kalastamise eest. Kuid mosuode ühiskonnas on üks oluline erinevus, mis teeb neid unikaalseks: neil on kombeks n-ö visiitabielu, kus naine otsustab, millise mehe ta ööseks enda juurde lubab ning kui kaua ta sellest mehest huvitatud on. Traditsioonilises mõttes ei ole kummalgi partneril abikaasa kohustusi, nad ei jaga majapidamiskohustusi ning lapsed elavad koos ema laiendatud perega.</p>');

const selectedText = {
  text: ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap),
  wordCount: 288,
  title: 'Musuo hõim – kas naiste maailm või meeste paradiis?',
  author: 'Teadmata',
};

const initialState = {
  editorState: EditorState.createWithContent(ContentState.createFromText(text)),
  text,
  selectedText,
  wordGroups: splitIntoWordGroups(text, 15),
  words: text.split(' '),
  fetching: false,
  selecting: false,
  texts: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EDITOR_STATE_UPDATED: {
      return updateObject(state, {
        editorState: action.payload,
        text: action.payload.getCurrentContent().getPlainText('\n').replace(/\n/g, ''),
        content: action.payload.getCurrentContent(),
      });
    }
    case actionTypes.TEXT_SAVE_REQUESTED: {
      return updateObject(state, {
        textSaveStatus: 'Saving',
      });
    }
    case actionTypes.TEXT_SAVE_SUCCEEDED: {
      return updateObject(state, {
        textSaveStatus: 'Saved',
      });
    }
    case actionTypes.FETCH_TEXTS_START: {
      return updateObject(state, {
        fetching: true,
      });
    }
    case actionTypes.FETCH_TEXTS_SUCCEEDED: {
      return updateObject(state, {
        texts: action.texts,
        fetching: false,
      });
    }
    case actionTypes.FETCH_TEXTS_FAILED: {
      return updateObject(state, {
        fetching: false,
      });
    }
    case actionTypes.GET_TEXT_START: {
      return updateObject(state, {
        selecting: true,
      });
    }
    case actionTypes.GET_TEXT_SUCCEEDED: {
      const updatedText = updateObject(action.text, {
        text: convertFromRaw(action.text.text),
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
    default:
      return state;
  }
};

export default reducer;
