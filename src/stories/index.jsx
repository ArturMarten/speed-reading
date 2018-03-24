import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getTranslate, setActiveLanguage } from 'react-localize-redux';

import Provider, { store } from './Provider';

import HomeContainer from '../containers/Home/Home';
import TextEntryContainer from '../containers/TextEntry/TextEntry';
import TextEditorContainer from '../containers/TextEditor/TextEditor';
import TextExercisePreparationContainer from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextSelectionContainer from '../containers/TextSelection/TextSelection';
import TextPreviewContainer from '../containers/Exercise/Preview/TextPreview';
import { TextExercise } from '../containers/Exercise/TextExercise/TextExercise';
import TextExerciseResultsContainer, { TextExerciseResults } from '../containers/Exercise/Container/TextExerciseResults';
import TextTestEditorContainer from '../containers/TextEntry/TextTestEditor/TextTestEditor';
import TextExerciseTestContainer from '../containers/Exercise/Test/TextExerciseTest';
import TestResultsContainer, { TestResults } from '../containers/Exercise/Container/TestResults';
import StatisticsContainer from '../containers/Statistics/Statistics';
import ManageContainer from '../containers/Manage/Manage';
import AuthContainer from '../containers/Auth/Auth';
import FeedbackContainer, { Feedback } from '../containers/Feedback/Feedback';

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

store.dispatch(setActiveLanguage('ee'));
// store.dispatch(setActiveLanguage('gb'));
const translate = getTranslate(store.getState().locale);
addDecorator(story => <Provider story={story()} />);

storiesOf('Home', module)
  .add('Container', () => <HomeContainer />);

storiesOf('Text entry', module)
  .add('Container', () => <TextEntryContainer />);

storiesOf('Text editor', module)
  .add('Container', () => <TextEditorContainer />);

storiesOf('Preparation', module)
  .add('Container', () => <TextExercisePreparationContainer type="wordGroup" onProceed={action('clicked')} />);

storiesOf('Text selection', module)
  .add('Container', () => <TextSelectionContainer open />);

storiesOf('Text preview', module)
  .add('Container', () => <TextPreviewContainer />);

storiesOf('Text exercise', module)
  .add('Container', () => (
    <TextExercise
      type="readingTest"
      timerState={{
        started: false,
        paused: false,
        stopped: false,
      }}
    />
  ));

storiesOf('Text exercise results', module)
  .add('Container', () => <TextExerciseResultsContainer open />)
  .add('Component', () => (
    <TextExerciseResults
      open
      translate={translate}
      result={{
        elapsedTime: 224200,
        wpm: 306,
        cps: 35,
      }}
    />));

storiesOf('Text test editor', module)
  .add('Container', () => <TextTestEditorContainer open readingTextId={9} />);

storiesOf('Text exercise test', module)
  .add('Container', () => <TextExerciseTestContainer />);

storiesOf('Test results', module)
  .add('Container', () => <TestResultsContainer open />)
  .add('Component', () => (
    <TestResults
      open
      translate={translate}
      result={{
        elapsedTime: 124200,
        total: 7,
        correct: 5,
        incorrect: 2,
      }}
    />));

storiesOf('Statistics', module)
  .add('Container', () => <StatisticsContainer />);

storiesOf('Manage', module)
  .add('Container', () => <ManageContainer />);

storiesOf('Auth', module)
  .add('Container', () => <AuthContainer open />);

storiesOf('Feedback', module)
  .add('Container', () => <FeedbackContainer open />)
  .add('Component', () => <Feedback open translate={translate} />)
  .add('Component submitting', () => <Feedback open loading sent={false} translate={translate} />)
  .add('Component submitted', () => <Feedback open loading={false} sent translate={translate} />);
