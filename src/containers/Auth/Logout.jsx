import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actionCreators from '../../store/actions';

class Logout extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  render() {
    return this.props.path !== '/' && <Redirect to="/" />;
  }
}

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  path: state.router.location.pathname,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(actionCreators.logout(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
