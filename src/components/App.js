import React from 'react';
import {Route} from 'react-router-dom';
import './App.css';

import ResponsiveContainer from '../containers/ResponsiveContainer';
import HomeContainer from '../containers/HomeContainer';
import TextEditorContainer from '../containers/text-input/TextEditorContainer';
import ExerciseMenuContainer from '../containers/ExerciseMenuContainer';
import StatisticsContainer from '../containers/statistics/StatisticsContainer';
import TextExerciseContainer from '../containers/exercise/TextExerciseContainer';

const App = () => {
  return (
    <ResponsiveContainer>
      <Route exact path='/' component={HomeContainer} />
      <Route path='/text-entry' component={TextEditorContainer} />
      <Route exact path='/exercise' component={ExerciseMenuContainer} />
      <Route path='/exercise/reading-test' render={() => <TextExerciseContainer type='reading' />} />
      <Route path='/exercise/word-groups' render={() => <TextExerciseContainer type='wordGroup' />} />
      <Route path='/exercise/disappearing-text' render={() => <TextExerciseContainer type='disappearing' />} />
      <Route path='/statistics' component={StatisticsContainer} />
    </ResponsiveContainer>
  );
};

export default App;
