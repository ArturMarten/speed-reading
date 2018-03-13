import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Icon, Header } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

export class ErrorPopup extends Component {
  state = {};
  render() {
    const errorMessage = (() => {
      switch (this.props.errorMessage) {
        case 'Network Error':
          return this.props.translate('error-popup.network-error');
        case 'Authentication missing':
          return this.props.translate('error-popup.authentication-missing');
        case 'User cannot be found':
          return this.props.translate('error-popup.user-not-found');
        case 'Incorrect password':
          return this.props.translate('error-popup.incorrect-password');
        default:
          return this.props.errorMessage;
      }
    })();
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="small"
        closeIcon
      >
        <Modal.Header content={this.props.translate('error-popup.modal-header')} />
        <Modal.Content>
          <Header as="h3">
            <Icon
              fitted
              name="warning circle"
              color="red"
              size="massive"
            />
            <Header.Content>
              {errorMessage}
            </Header.Content>
          </Header>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose}>
            {this.props.translate('error-popup.ok')}
          </Button>
        </Modal.Actions>
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

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPopup);
