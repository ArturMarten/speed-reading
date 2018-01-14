import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import Statistics from '../../components/statistics/Statistics';

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
