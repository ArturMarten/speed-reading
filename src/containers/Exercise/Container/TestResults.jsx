import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

class TestResults extends Component {
  state = {}

  render() {
    return (
      <Modal open={this.props.open} size="tiny">
        <Modal.Header>{this.props.translate('test-results.modal-header')}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {this.props.translate('test-results.result')}: 80%
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Popup
            trigger={
              <Button
                primary
                icon="lock"
                content={this.props.translate('test-results.check-correct-answers')}
              />
            }
            content={this.props.translate('auth.required')}
            on="hover"
          />
          <Button
            negative
            onClick={this.props.onFinish}
            content={this.props.translate('test-results.finish')}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
