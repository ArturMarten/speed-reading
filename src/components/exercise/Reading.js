import React, {Component} from 'react';
import { Editor } from 'draft-js';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';

const styleMap = {
  'HIDE': {
    visibility: 'hidden'
  },
};

class Reading extends Component {
  constructor(props) {
    super(props);
    this.totalPages = 1;
    this.currentPage = 1;
  }

  componentWillMount() {
    this.props.onExerciseSelect('reading');
  }

  componentDidUpdate() {
    const scrollTop = this.refs.text.scrollTop;
    //console.log('Updating! ScrollTop: ' + scrollTop);
    this.refs.text.scrollTop = scrollTop + 1;

    // Current page and total pages calculations
    this.totalPages = Math.ceil(this.refs.text.scrollHeight / this.refs.text.clientHeight);
    this.currentPage = this.refs.text.scrollTop ===  this.refs.text.scrollHeight - this.refs.text.clientHeight ? this.totalPages : Math.ceil(this.refs.text.scrollTop / this.refs.text.clientHeight);
  }

  render() {
    return(
      <div className="reading">
        <TextOptionsContainer />
        <TimingContainer />
        <div className="text" style={{...this.props.exercise.options}} ref="text">
          <Editor 
            editorState = {this.props.exercise.editorState}
            readOnly = {true}
            customStyleMap={styleMap}
          />
        </div>
        {this.props.exercise.started ? 'Pages: ' + this.currentPage + '/' + this.totalPages : ''}
      </div>
    );
  }
};

export default Reading;