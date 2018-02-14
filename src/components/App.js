import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import {Route} from 'react-router-dom';
import './App.css';

import Aux from '../hoc/Auxiliary';
import HomeContainer from '../containers/HomeContainer';
import TextEditorContainer from '../containers/text-input/TextEditorContainer';
import ExerciseMenuContainer from '../containers/ExerciseMenuContainer';
import StatisticsContainer from '../containers/statistics/StatisticsContainer';
import TextExerciseContainer from '../containers/exercise/TextExerciseContainer';
import ResponsiveContainer from '../containers/ResponsiveContainer';

const App = ({history}) => {
  return (
    <ConnectedRouter history={history}>
      <Aux>
        <ResponsiveContainer>
          <Route exact path='/' component={HomeContainer} />
          <Route path='/text-entry' component={TextEditorContainer} />
          <Route exact path='/exercise' component={ExerciseMenuContainer} />
          <Route path='/exercise/reading-test' render={() => <TextExerciseContainer type='reading' />} />
          <Route path='/exercise/word-groups' render={() => <TextExerciseContainer type='wordGroup' />} />
          <Route path='/exercise/disappearing-text' render={() => <TextExerciseContainer type='disappearing' />} />
          <Route path='/statistics' component={StatisticsContainer} />
        </ResponsiveContainer>
      </Aux>
    </ConnectedRouter>
  );
};

App.propTypes = {
  history: PropTypes.object.isRequired
};

export default App;
