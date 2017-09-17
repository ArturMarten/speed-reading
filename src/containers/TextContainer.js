import Text from '../components/Text';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  editorState: state.exercise.editorState
});

export default connect(mapStateToProps, undefined)(Text);