import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

export class ProfileSettings extends Component {
  state = {};
  render() {
    return (
      <Modal size="small" open={this.props.open} closeOnDimmerClick={false} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('profile-settings.modal-header')}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              id="name-input"
              type="text"
              name="name"
              label={this.props.translate('profile-settings.name')}
              value={this.props.name}
              placeholder={this.props.translate('profile-settings.please-enter-name')}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Popup
            content={this.props.translate('profile-settings.not-implemented')}
            trigger={
              <Button
                positive
                type="button"
              >
                {this.props.translate('profile-settings.save')}
              </Button>
            }
            position="left center"
            on="hover"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  name: state.profile.name,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
