import React, {Component} from 'react';
import { Editor, EditorState, SelectionState, Modifier, getVisibleSelectionRect } from 'draft-js';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';

const styleMap = {
  'HIDDEN': {
    visibility: 'hidden'
  },
  'VISIBLE': {
    visibility: 'visible'
  }
};

const hiddenStyle = 'HIDDEN';

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
    //this.refs.text.scrollTop = scrollTop + 1;
  }
  
  oneGroupVisibleState() {
    let contentState = this.props.exercise.editorState.getCurrentContent();
    if(this.props.exercise.started) {
      let firstBlock = contentState.getFirstBlock();
      contentState = Modifier.removeInlineStyle(
        contentState, 
        this.props.exercise.selection, 
        hiddenStyle
      );
    }
    return EditorState.createWithContent(contentState);
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