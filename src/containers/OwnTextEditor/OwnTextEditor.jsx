import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

// import * as actionCreators from '../../store/actions';
import TextEditor from '../TextEditor/TextEditor';

const initialState = {};

export class OwnTextEditor extends Component {
  state = { ...initialState };

  onSubmit = () => {
    const textEditorComponent = this.textEditorRef.getWrappedInstance();
    const selectedText = {
      plain: textEditorComponent.getPlainText(),
      contentState: textEditorComponent.getRawContent(),
    };
    console.log(selectedText);
  }

  render() {
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('own-text-editor.modal-header')}</Modal.Header>
        <Modal.Content>
          <TextEditor
            ref={(ref) => { this.textEditorRef = ref; }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            disabled
            type="button"
          >
            {this.props.translate('own-text-editor.analyze-complexity')}
          </Button>
          <Popup
            trigger={
              <Button
                positive
                type="button"
                onClick={this.onSubmit}
              >
                {this.props.translate('own-text-editor.use')}
              </Button>
            }
            content={this.props.translate('own-text-editor.not-implemented')}
            position="top center"
            on="hover"
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

export default connect(mapStateToProps, mapDispatchToProps)(OwnTextEditor);
