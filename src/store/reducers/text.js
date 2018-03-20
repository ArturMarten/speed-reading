import { convertFromRaw } from 'draft-js';
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

/*
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
*/

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
