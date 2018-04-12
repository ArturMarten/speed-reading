import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

export class ProfileSettings extends Component {
  state = {};
  render() {
    return (
      <Modal size="small" open={this.props.open} closeOnDimmerClick={false} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('profile-settings.modal-header')}</Modal.Header>
        <Modal.Content />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
