import React from 'react';
import {ConnectedRouter} from 'connected-react-router';

import DebuggingContainer from '../containers/DebuggingContainer';
import MenuContainer from '../containers/MenuContainer';
import AppHeader from './AppHeader';
import TextEditorContainer from '../containers/TextEditorContainer';
import ExerciseMenuContainer from '../containers/ExerciseMenuContainer';
import ReadingContainer from '../containers/exercise/ReadingContainer';
import OneGroupVisibleContainer from '../containers/exercise/OneGroupVisibleContainer';
import DisappearingContainer from '../containers/exercise/DisappearingContainer';

import {
  Route
} from 'react-router-dom';

const App = ({history}) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <DebuggingContainer />
        <MenuContainer />
        <AppHeader />
        <Route path='/textEntry' component={TextEditorContainer} />
        <Route path='/exercise' component={ExerciseMenuContainer} />
        <Route path='/exercise/reading' component={ReadingContainer} />
        <Route path='/exercise/wordGroup' component={OneGroupVisibleContainer} />
        <Route path='/exercise/disappearing' component={DisappearingContainer} />
      </div>
    </ConnectedRouter>
  );
};

App.propTypes = {
  history: React.PropTypes.object.isRequired
};

export default App;
