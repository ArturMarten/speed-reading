import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getTranslate, setActiveLanguage } from 'react-localize-redux';

/* eslint-disable max-len */
import * as actionCreators from '../store/actions';
import Provider, { store } from './Provider';

import HomeContainer from '../containers/Home/Home';
import TextEntryContainer from '../containers/TextEntry/TextEntry';
import TextEditorContainer from '../containers/TextEditor/TextEditor';
import TextExercisePreparationContainer from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextSelectionContainer from '../containers/TextSelection/TextSelection';
import TextPreviewContainer from '../containers/Exercise/Preview/TextPreview';
import { TextExercise } from '../containers/Exercise/TextExercise/TextExercise';
import { HelpExercise } from '../containers/Exercise/HelpExercise/HelpExercise';
import { SchulteTables } from '../containers/Exercise/Types/SchulteTables';
import { Concentration } from '../containers/Exercise/Types/Concentration';
import TextExerciseResultsContainer, { TextExerciseResults } from '../containers/Exercise/Results/TextExerciseResults';
import TextTestEditorContainer from '../containers/TextEntry/TextTestEditor/TextTestEditor';
import TextExerciseTestContainer from '../containers/Exercise/Test/TextExerciseTest';
import TestResultsContainer, { TestResults } from '../containers/Exercise/Results/TestResults';
import StatisticsContainer from '../containers/Statistics/Statistics';
import ManageContainer from '../containers/Manage/Manage';
import AuthContainer from '../containers/Auth/Auth';
import ChangePasswordContainer from '../containers/Auth/ChangePassword';
import FeedbackContainer, { Feedback } from '../containers/Feedback/Feedback';
import { generateSymbols, generateStringPairs } from '../store/reducers/exercise';

/*
const dummyData = [
  { id: 1, questionText: 'Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja............ning läbi aastasadade on seda olnud enam kui küllalt.', answers: [{ id: 1, answerText: 'passiivsus' }, { id: 2, answerText: 'vägivaldsus' }, { id: 3, answerText: 'agressiivsus' }, { id: 4, answerText: 'sõjakus' }] },
  { id: 2, questionText: 'Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna........', answers: [{ id: 1, answerText: 'esmaõiguslikkus' }, { id: 2, answerText: 'patriaarhia' }, { id: 3, answerText: 'matriarhaat' }, { id: 4, answerText: 'sugulusjärgus' }] },
  { id: 3, questionText: 'Mosuode ühiskonnas on oluline erinevus, mis teistes ühiskondades on olemas ning,  mis teeb neid unikaalseks', answers: [{ id: 1, answerText: 'neil on kombeks n-ö visiitabielu, naine otsustab, millise mehe ta ööseks enda juurde lubab' }, { id: 2, answerText: 'nad ei tunne sõdu, vägistamisi ega mõrvu' }, { id: 3, answerText: 'isad on need, kes kasvatavad lapsi, samas kui naised teevad tööd' }, { id: 4, answerText: 'kummalgi partneril pole abikaasa kohustusi, kuid nad jagavad majapidamist ja lapsi' }] },
  { id: 4, questionText: 'Mis on meeste suurim kohustus mosuode hõmus?', answers: [{ id: 1, answerText: 'toetada naisi majanduslikult' }, { id: 2, answerText: 'hoolitseda laste eest' }, { id: 3, answerText: 'oma öistel "visiitidel" edukalt hakkama saamine' }, { id: 4, answerText: 'pere valitsemine' }] },
  { id: 5, questionText: 'Millel põhinevad muoso hõimu inimeste vahelised suhted?', answers: [{ id: 1, answerText: 'armastusel' }, { id: 2, answerText: 'poliitikal' }, { id: 3, answerText: 'majanduslikul heaolul' }, { id: 4, answerText: 'sotsiaalsel survel' }] },
];
*/

store.dispatch(setActiveLanguage('ee'));
store.dispatch(actionCreators.authLogin('***ADMIN_EMAIL***', '***ADMIN_PASSWORD***'));
store.dispatch(actionCreators.selectText(18));

const { textOptions, exerciseOptions, speedOptions } = store.getState().options;

// store.dispatch(setActiveLanguage('gb'));
const translate = getTranslate(store.getState().locale);
addDecorator(story => <Provider story={story()} />);

storiesOf('Home', module)
  .add('Container', () => <HomeContainer />);

storiesOf('Text entry', module)
  .add('Container', () => <TextEntryContainer />);

storiesOf('Text editor', module)
  .add('Container', () => <TextEditorContainer />);

storiesOf('Text exercise preparation', module)
  .add('Container', () => <TextExercisePreparationContainer type="wordGroups" onProceed={action('clicked')} />);

storiesOf('Text selection', module)
  .add('Container', () => <TextSelectionContainer open />);

storiesOf('Text preview', module)
  .add('Container', () => <TextPreviewContainer />);

storiesOf('Reading exercise', module)
  .add('Reading test component', () => (
    <TextExercise
      type="readingTest"
      timerState={{
        started: true,
        paused: false,
        stopped: false,
      }}
      selectedText={store.getState().text.selectedText}
    />
  ));

storiesOf('Help exercise', module)
  .add('Schulte tables component', () =>
    (<HelpExercise
      type="schulteTables"
      timerState={{
        started: true,
        paused: false,
        stopped: false,
      }}
    />))
  .add('Concentration component', () => (
    <HelpExercise
      type="concentration"
      timerState={{
        started: true,
        paused: false,
        stopped: false,
      }}
    />
  ));

const symbols = generateSymbols(25, 'numbers');
storiesOf('Schulte tables', module)
  .add('Component', () =>
    (<SchulteTables
      symbols={symbols}
      exerciseOptions={exerciseOptions}
      textOptions={textOptions}
      speedOptions={speedOptions}
    />));

const stringPairs = generateStringPairs(20, 7, 'concentration-numbers-only');
storiesOf('Concentration', module)
  .add('Component', () =>
    (<Concentration
      stringPairs={stringPairs}
      exerciseOptions={exerciseOptions}
      textOptions={textOptions}
      speedOptions={speedOptions}
      timerState={{}}
    />));

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
        correct: 4,
        incorrect: 2,
        unanswered: 1,
      }}
    />));

storiesOf('Statistics', module)
  .add('Container', () => <StatisticsContainer />);

storiesOf('Manage', module)
  .add('Container', () => <ManageContainer />);

storiesOf('Auth', module)
  .add('Login container', () => <AuthContainer open />)
  .add('Change password container', () => <ChangePasswordContainer open />);

storiesOf('Feedback', module)
  .add('Container', () => <FeedbackContainer open />)
  .add('Component', () => <Feedback open translate={translate} />)
  .add('Component submitting', () => <Feedback open loading sent={false} translate={translate} />)
  .add('Component submitted', () => <Feedback open loading={false} sent translate={translate} />);
