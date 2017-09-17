import {connect} from 'react-redux';

import TextEditor from '../components/TextEditor';
import { editorStateUpdated } from '../actions';

const mapStateToProps = (state) => ({
  editorState: state.exercise.editorState
});

const mapDispatchToProps = (dispatch) => ({
  onSaveEditorState: (editorState) => {
    dispatch(editorStateUpdated(editorState));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);