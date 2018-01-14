import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import {Route} from 'react-router-dom';

import Home from './Home';
import TopMenuContainer from '../containers/TopMenuContainer';
import TextEditorContainer from '../containers/text-input/TextEditorContainer';
import ExerciseMenuContainer from '../containers/ExerciseMenuContainer';
import ReadingContainer from '../containers/exercise/ReadingContainer';
import ReadingWithStyleContainer from '../containers/exercise/ReadingWithStyleContainer';
import OneGroupVisibleContainer from '../containers/exercise/OneGroupVisibleContainer';
import DisappearingContainer from '../containers/exercise/DisappearingContainer';

const App = ({history}) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <TopMenuContainer />
        <Route exact path='/' component={Home} />
        <Route path='/text-entry' component={TextEditorContainer} />
        <Route exact path='/exercise' component={ExerciseMenuContainer} />
        <Route path='/exercise/reading-test' component={ReadingContainer} />
        <Route path='/exercise/reading-with-style-test' component={ReadingWithStyleContainer} />
        <Route path='/exercise/word-groups' component={OneGroupVisibleContainer} />
        <Route path='/exercise/disappearing-text' component={DisappearingContainer} />
      </div>
    </ConnectedRouter>
  );
};

App.propTypes = {
  history: PropTypes.object.isRequired
};

export default App;
