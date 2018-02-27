import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal, Form, Button, Rating} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

export class Feedback extends Component {

  onSubmit = () => {
    this.props.onSubmit({});
  }

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
          <Button positive onClick={this.onSubmit}>
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
  onSubmit: () => {}
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
