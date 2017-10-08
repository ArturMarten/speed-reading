import React from 'react';
import {ConnectedRouter} from 'connected-react-router';
import {Route} from 'react-router-dom';
import {Container} from 'semantic-ui-react';

import Home from './Home';
import TopMenuContainer from '../containers/TopMenuContainer';
import TextEditorContainer from '../containers/TextEditorContainer';
import ExerciseMenuContainer from '../containers/ExerciseMenuContainer';
import ReadingContainer from '../containers/exercise/ReadingContainer';
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
        <Route path='/exercise/word-groups' component={OneGroupVisibleContainer} />
        <Route path='/exercise/disappearing-text' component={DisappearingContainer} />
      </div>
    </ConnectedRouter>
  );
};

App.propTypes = {
  history: React.PropTypes.object.isRequired
};

export default App;
