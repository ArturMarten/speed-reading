import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getTranslate, setActiveLanguage } from 'react-localize-redux';

/* eslint-disable max-len */
import * as actionCreators from '../store/actions';
import credentials from '../credentials';
import Provider, { store } from './Provider';

// import HomeContainer from '../containers/Home/Home';
import TextEntryContainer from '../containers/TextEntry/TextEntry';
import TextEditorContainer from '../containers/TextEditor/TextEditor';
import TextAnalysisContainer, { TextAnalysis } from '../containers/TextAnalysis/TextAnalysis';
import TextExercisePreparationContainer from '../containers/Exercise/Preparation/TextExercisePreparation';
import TextSelectionContainer from '../containers/TextSelection/TextSelection';
import TextSelectionFilterContainer from '../containers/TextSelection/TextSelectionFilter';
import TextPreviewContainer from '../containers/Exercise/Preview/TextPreview';
import { TextExercise } from '../containers/Exercise/TextExercise/TextExercise';
import HelpExercisePreparationContainer from '../containers/Exercise/Preparation/HelpExercisePreparation';
import { HelpExercise } from '../containers/Exercise/HelpExercise/HelpExercise';
import { SchulteTables } from '../containers/Exercise/Types/SchulteTables/SchulteTables';
import { Concentration } from '../containers/Exercise/Types/Concentration/Concentration';
import { TextExerciseResults } from '../containers/Exercise/Results/TextExerciseResults';
import TextTestEditorContainer from '../containers/TextEntry/TextTestEditor/TextTestEditor';
import TextExerciseQuestionTestContainer, { TextExerciseQuestionTest } from '../containers/Exercise/Test/TextExerciseQuestionTest';
import TextExerciseBlankTestContainer, { TextExerciseBlankTest } from '../containers/Exercise/Test/TextExerciseBlankTest';
import { TestResults } from '../containers/Exercise/Results/TestResults';
import { QuestionTestAnswers } from '../containers/Exercise/TestAnswers/QuestionTestAnswers';
import { BlankTestAnswers } from '../containers/Exercise/TestAnswers/BlankTestAnswers';
import StatisticsContainer from '../containers/Statistics/Statistics';
import RegressionChart from '../components/Statistics/RegressionChart';
import ManageContainer from '../containers/Manage/Manage';
import AuthContainer from '../containers/Auth/Auth';
import ChangePasswordContainer from '../containers/Auth/ChangePassword';
import FeedbackContainer, { Feedback } from '../containers/Feedback/Feedback';
import BugReportContainer, { BugReport } from '../containers/BugReport/BugReport';
import { generateSymbols, generateStringPairs } from '../store/reducers/exercise';

const questions = [
  { id: 0, questionText: 'Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja ... ning läbi aastasadade on seda olnud enam kui küllalt.', answers: [{ id: 1, answerText: 'passiivsus' }, { id: 2, answerText: 'vägivaldsus' }, { id: 3, answerText: 'agressiivsus' }, { id: 4, answerText: 'sõjakus' }] },
  { id: 1, questionText: 'Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna ... .', answers: [{ id: 1, answerText: 'esmaõiguslikkus' }, { id: 2, answerText: 'patriaarhia' }, { id: 3, answerText: 'matriarhaat' }, { id: 4, answerText: 'sugulusjärgus' }] },
  { id: 2, questionText: 'Mosuode ühiskonnas on oluline erinevus, mis teistes ühiskondades on olemas ning, mis teeb neid unikaalseks', answers: [{ id: 1, answerText: 'neil on kombeks n-ö visiitabielu, naine otsustab, millise mehe ta ööseks enda juurde lubab' }, { id: 2, answerText: 'nad ei tunne sõdu, vägistamisi ega mõrvu' }, { id: 3, answerText: 'isad on need, kes kasvatavad lapsi, samas kui naised teevad tööd' }, { id: 4, answerText: 'kummalgi partneril pole abikaasa kohustusi, kuid nad jagavad majapidamist ja lapsi' }] },
  { id: 3, questionText: 'Mis on meeste suurim kohustus mosuode hõmus?', answers: [{ id: 1, answerText: 'toetada naisi majanduslikult' }, { id: 2, answerText: 'hoolitseda laste eest' }, { id: 3, answerText: 'oma öistel "visiitidel" edukalt hakkama saamine' }, { id: 4, answerText: 'pere valitsemine' }] },
  { id: 4, questionText: 'Millel põhinevad muoso hõimu inimeste vahelised suhted?', answers: [{ id: 1, answerText: 'armastusel' }, { id: 2, answerText: 'poliitikal' }, { id: 3, answerText: 'majanduslikul heaolul' }, { id: 4, answerText: 'sotsiaalsel survel' }] },
];

const blankExercises = [
  { id: 0, text: ['Üks selline on ', 'BLANK', ', mis loodi 1960-ndatel täiskasvanute keeleõppeks.'], answer: 'TPR-meetod' },
  { id: 1, text: ['Lapsed õpivad', 'BLANK', ' üldjuhul linnulennult, samas kui täiskasvanu võibki jääda oma emakeele vangiks,” tõdeb Petar Hodulov, kes õpetab Eesti massaaži- ja teraapiakoolis\nmuuhulgas ka inglise keelt.'], answer: 'võõrkeelt' },
  { id: 2, text: ['', 'BLANK', ' õppimine sõltub tema meelest paljuski sellest, kuidas inimene​ ​saab​ ​hakkama​ ​häbitundega​ ​–​ ​eksida​ ​tuleb​ ​ju​ ​omajagu.'], answer: 'Võõrkeele' },
  { id: 3, text: ['Liigutused saavad täiskasvanud õppijad suuresti​ ​ise​ ​välja​ ​mõelda.​ ​Kui​ ​üldse​ ', 'BLANK', ' ​ei​ ​ole,​ ​siis​ ​õpetaja​ ​aitab.'], answer: 'inspiratsiooni' },
  { id: 4, text: ['Nii tekib ', 'BLANK', ' lause „Stomach breaks down food” juures.'], answer: 'tõrge' },
  { id: 5, text: ['Kidneys get ', 'BLANK', ' of waste products?'], answer: 'rid' },
  { id: 6, text: ['„Mul oli väga lõbus,” võtab ', 'BLANK', ' vaos hoidev Liis Metusala (44) tunni hiljem kokku.'], answer: 'emotsioone' },
  { id: 7, text: ['„Hea ', 'BLANK', ' on, hästi praktiline ja käed küljes.'], answer: 'energia' },
];

store.dispatch(setActiveLanguage('ee'));
store.dispatch(actionCreators.login(credentials.admin.username, credentials.admin.password));
setTimeout(() => store.dispatch(actionCreators.selectText(1, store.getState().auth.token)), 3000);


const { textOptions, exerciseOptions, speedOptions } = store.getState().options;

// store.dispatch(setActiveLanguage('gb'));
const translate = getTranslate(store.getState().locale);

addDecorator(story => <Provider story={story()} />);

/*
// Breaks with .pdf file import
storiesOf('Home', module)
  .add('Container', () => <HomeContainer />);
*/

storiesOf('Text entry', module)
  .add('Container', () => <TextEntryContainer />);

storiesOf('Text editor', module)
  .add('Container', () => <TextEditorContainer />);

storiesOf('Text analysis', module)
  .add('Container', () => {
    const { selectedText } = store.getState().text;
    const text = selectedText ? selectedText.plain : '';
    const language = 'estonian';
    store.dispatch(actionCreators.analyzeText({ text, language }));
    return <TextAnalysisContainer open />;
  })
  .add('Component', () => (
    <TextAnalysis
      open
      analyzeStatus={{
        loading: false,
      }}
      analysis={{
        characterCount: 2695,
        wordCount: 516,
        sentenceCount: 31,
        averageWordLength: 5.22,
        wordLengthClassRating: 3,
        averageSentenceLengthInWords: 16.65,
        averageSentenceLengthInCharacters: 86.94,
        sentenceLengthClassRating: 12,
        wordLengths: [],
        sentenceLengths: [],
        wordTypeCounts: [],
      }}
      translate={translate}
    />
  ));

storiesOf('Text exercise preparation', module)
  .add('Reading test container', () => {
    store.dispatch(actionCreators.selectExercise('readingTest'));
    return (
      <TextExercisePreparationContainer
        type="readingTest"
        onProceed={action('clicked')}
      />);
  })
  .add('Reading aid container', () => {
    store.dispatch(actionCreators.selectExercise('readingAid'));
    return (
      <TextExercisePreparationContainer
        type="readingAid"
        onProceed={action('clicked')}
      />);
  })
  .add('Scrolling container', () => {
    store.dispatch(actionCreators.selectExercise('scrolling'));
    return (
      <TextExercisePreparationContainer
        type="scrolling"
        onProceed={action('clicked')}
      />);
  })
  .add('Disappearing container', () => {
    store.dispatch(actionCreators.selectExercise('disappearing'));
    return (
      <TextExercisePreparationContainer
        type="disappearing"
        onProceed={action('clicked')}
      />);
  })
  .add('Word groups container', () => {
    store.dispatch(actionCreators.selectExercise('wordGroups'));
    return (
      <TextExercisePreparationContainer
        type="wordGroups"
        onProceed={action('clicked')}
      />);
  });

storiesOf('Text selection', module)
  .add('Container', () => <TextSelectionContainer open />);

storiesOf('Text selection filter', module)
  .add('Container', () => {
    store.dispatch(actionCreators.fetchTexts(store.getState().auth.token));
    store.dispatch(actionCreators.fetchTextCollections());
    return (
      <TextSelectionFilterContainer
        open
        filter={{
          collectionIds: [],
          keywords: [],
          complexityEquality: 'from',
          complexityRating: 0,
          authors: [],
          questionsAuthors: [],
          language: 'estonian',
        }}
        textCount={0}
        onFilterChange={action('filter changed')}
        onFilterClear={action('filter cleared')}
      />);
  });

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
      onExerciseStart={action('exercise started')}
      translate={translate}
    />
  ));

storiesOf('Help exercise preparation', module)
  .add('Container', () => {
    store.dispatch(actionCreators.selectExercise('concentration'));
    return (
      <HelpExercisePreparationContainer
        type="concentration"
        onProceed={action('clicked')}
      />);
  });

storiesOf('Help exercise', module)
  .add('Schulte tables component', () => (
    <HelpExercise
      type="schulteTables"
      timerState={{
        started: true,
        paused: false,
        stopped: false,
      }}
      onExerciseStart={action('exercise started')}
    />))
  .add('Concentration component', () => (
    <HelpExercise
      type="concentration"
      timerState={{
        started: true,
        paused: false,
        stopped: false,
      }}
      onExerciseStart={action('exercise started')}
    />
  ));

const symbols = generateSymbols(25, 'numbers');
storiesOf('Schulte tables', module)
  .add('Component', () => (
    <SchulteTables
      symbols={symbols}
      exerciseOptions={exerciseOptions}
      textOptions={textOptions}
      speedOptions={speedOptions}
    />));

const stringPairs = generateStringPairs(20, 8, 'concentration-mixed');
storiesOf('Concentration', module)
  .add('Component', () => (
    <Concentration
      stringPairs={stringPairs}
      exerciseOptions={exerciseOptions}
      textOptions={textOptions}
      speedOptions={speedOptions}
      timerState={{}}
    />));

storiesOf('Text exercise results', module)
  .add('Component', () => (
    <TextExerciseResults
      open
      translate={translate}
      result={{
        elapsedTime: 224200,
        wpm: 306,
        cps: 35,
      }}
      selectedText={store.getState().text.selectedText}
    />));

storiesOf('Text test editor', module)
  .add('Container', () => <TextTestEditorContainer open readingTextId={9} />);

storiesOf('Text exercise question test', module)
  .add('Container', () => <TextExerciseQuestionTestContainer />)
  .add('Component', () => (
    <TextExerciseQuestionTest
      translate={translate}
      questions={questions}
      selectedText={{}}
      onTestPrepare={action('preparation')}
      testStatus="started"
    />));

storiesOf('Text exercise blank test', module)
  .add('Container', () => <TextExerciseBlankTestContainer />)
  .add('Component', () => (
    <TextExerciseBlankTest
      translate={translate}
      blankExercises={blankExercises}
      selectedText={{}}
      onTestPrepare={action('preparation')}
      testStatus="started"
    />));

storiesOf('Test results', module)
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
        testResult: 4 / 7,
        comprehensionResult: 3 / 7,
        cpm: 231,
      }}
      selectedText={store.getState().text.selectedText}
    />));

storiesOf('Question test answers', module)
  .add('Component', () => (
    <QuestionTestAnswers
      testAttemptId={92}
      translate={translate}
    />));

storiesOf('Blank test answers', module)
  .add('Component', () => (
    <BlankTestAnswers
      blankExercises={blankExercises}
      answers={['tpr-meetod', 'keelt', 'Keele', 'inspiratsiooni', '', 'rid', 'tundeid']}
      translate={translate}
    />));

storiesOf('Statistics', module)
  .add('Container', () => <StatisticsContainer />);

storiesOf('RegressionChart', module)
  .add('Time scale with no data', () => (
    <RegressionChart
      title={translate('regression-chart.reading-speed-trend')}
      xLabel={translate('regression-chart.date')}
      yLabel={translate('regression-chart.speed-wpm')}
      legendTitles={[translate('regression-chart.reading-speed')]}
      width={1000}
      height={400}
      data={[]}
      xField="date"
      yFields={['wpm']}
      dataStrokeColor={['#4C4CFF']}
      dataFillColor={['#9999FF']}
      dataLineColor={['#0000FF']}
      translate={translate}
    />
  ))
  .add('Time scale with one value', () => (
    <RegressionChart
      title={translate('regression-chart.reading-speed-trend')}
      xLabel={translate('regression-chart.date')}
      yLabel={translate('regression-chart.speed-wpm')}
      legendTitles={[translate('regression-chart.reading-speed')]}
      width={1000}
      height={400}
      data={[
        { date: new Date(new Date() - (6 ** 11)), wpm: 185 },
      ]}
      xField="date"
      yFields={['wpm']}
      dataStrokeColor={['#4C4CFF']}
      dataFillColor={['#9999FF']}
      dataLineColor={['#0000FF']}
      translate={translate}
    />
  ))
  .add('Time scale with two values', () => (
    <RegressionChart
      title={translate('regression-chart.reading-speed-trend')}
      xLabel={translate('regression-chart.date')}
      yLabel={translate('regression-chart.speed-wpm')}
      legendTitles={[translate('regression-chart.reading-speed')]}
      width={1000}
      height={400}
      data={[
        { date: new Date(new Date() - (6 ** 11)), wpm: 185 },
        { date: new Date(new Date() - (4 ** 10)), wpm: 192 },
      ]}
      xField="date"
      yFields={['wpm']}
      dataStrokeColor={['#4C4CFF']}
      dataFillColor={['#9999FF']}
      dataLineColor={['#0000FF']}
      translate={translate}
    />
  ));

storiesOf('Manage', module)
  .add('Container', () => <ManageContainer />);

storiesOf('Auth', module)
  .add('Login container', () => <AuthContainer open />)
  .add('Change password container', () => <ChangePasswordContainer open />);

storiesOf('Feedback', module)
  .add('Container', () => <FeedbackContainer open />)
  .add('Component', () => <Feedback open feedbackStatus={{ loading: false, error: null, message: null }} translate={translate} />)
  .add('Component submitting', () => <Feedback open feedbackStatus={{ loading: true, error: null, message: null }} translate={translate} />)
  .add('Component submitted', () => <Feedback open feedbackStatus={{ loading: false, error: null, message: 'Submitted' }} translate={translate} />);

storiesOf('Bug report', module)
  .add('Container', () => <BugReportContainer open />)
  .add('Component', () => <BugReport open bugReportStatus={{ loading: false, error: null, message: null }} translate={translate} />)
  .add('Component submitting', () => <BugReport open bugReportStatus={{ loading: true, error: null, message: null }} translate={translate} />)
  .add('Component submitted', () => <BugReport open bugReportStatus={{ loading: false, error: null, message: 'Submitted' }} translate={translate} />);
