import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextEditor from '../../components/text-input/TextEditor';
import * as actionCreators from '../../store/actions';

const mapStateToProps = (state) => ({
  editorState: state.exercise.editorState,
  translate: getTranslate(state.locale),
  textSaveStatus: state.exercise.textSaveStatus
});

const mapDispatchToProps = (dispatch) => ({
  onSaveEditorState: (editorState) => {
    dispatch(actionCreators.editorStateUpdated(editorState));
  },
  onSaveText: () => {
    dispatch(actionCreators.storeText());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
