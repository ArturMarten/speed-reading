import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextEditor from '../../components/text-input/TextEditor';
import {editorStateUpdated} from '../../actions';

const mapStateToProps = (state) => ({
  editorState: state.exercise.editorState,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSaveEditorState: (editorState) => {
    dispatch(editorStateUpdated(editorState));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
