import React, {Component} from 'react';
import { Editor, EditorState, SelectionState, Modifier, getVisibleSelectionRect } from 'draft-js';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';

const styleMap = {
  'HIDE': {
    visibility: 'hidden'
  },
  'VISIBLE': {
    visibility: 'visible'
  }
};

class OneGroupVisible extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.onExerciseSelect('wordGroup');
  }

  componentDidUpdate() {
    const scrollTop = this.refs.text.scrollTop;
    //console.log('Updating! ScrollTop: ' + scrollTop);
    this.refs.text.scrollTop = scrollTop + 1;
  }
  
  oneGroupVisibleState() {
    let contentState = this.props.exercise.editorState.getCurrentContent();
    let firstBlock = contentState.getFirstBlock();

    let oneGroupVisibleState = EditorState.createWithContent(
      Modifier.applyInlineStyle(
        contentState, 
        this.props.exercise.selection, 
        'VISIBLE'
      )
    );

    return oneGroupVisibleState;
  }

  render() {
    return(
      <div className="one-group">
        <TextOptionsContainer />
        <TimingContainer />
        <div className="text" style={{...this.props.exercise.options}} ref="text">
          <Editor 
            editorState = {this.oneGroupVisibleState()}
            readOnly = {true}
            customStyleMap={styleMap}
          />
        </div>
      </div>
    );
  }
};

export default OneGroupVisible;