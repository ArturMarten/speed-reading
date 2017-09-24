import React, {Component} from 'react';
import { Editor, EditorState, Modifier, SelectionState } from 'draft-js';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import ExerciseOptionsContainer from '../../containers/ExerciseOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';

const styleMap = {
  'HIDDEN': {
    visibility: 'hidden'
  },
};

class Disappearing extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.onExerciseSelect('disappearing');
  }

  componentDidUpdate() {
    //const scrollTop = this.refs.text.scrollTop;
    //console.log('Updating! ScrollTop: ' + scrollTop);
    //this.refs.text.scrollTop = scrollTop + 1;
  }

  disappearing() {
    let contentState = this.props.exercise.editorState.getCurrentContent();
    let firstBlock = contentState.getFirstBlock();
    
    let disappearing = EditorState.createWithContent(
      Modifier.applyInlineStyle(
        contentState, 
        new SelectionState({
          anchorKey: firstBlock.getKey(), 
          anchorOffset: 0, 
          focusKey: firstBlock.getKey(), 
          focusOffset: this.props.exercise.position - 1
        }), 
        'HIDDEN'
      )
    );
    return disappearing;
  }

  render() {
    return(
      <div className="disappearing">
        <TextOptionsContainer />
        <ExerciseOptionsContainer />
        <TimingContainer />
        <div className="text" style={{...this.props.exercise.options}} ref="text">
          <Editor 
            editorState = {this.disappearing()}
            readOnly = {true}
            customStyleMap={styleMap}
          />
        </div>
      </div>
    );
  }
};

export default Disappearing;