import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal, Form, Button, Rating} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

export class Feedback extends Component {
  render() {
    return(
      <Modal size='small' open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>{this.props.translate('feedback.modal-header')}</Modal.Header>
        <Modal.Content>
          <Form>
            <Rating icon='heart' defaultRating={3} maxRating={5} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive>
            {this.props.translate('feedback.send')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
