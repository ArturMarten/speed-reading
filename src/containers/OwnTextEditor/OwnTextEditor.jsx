import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { stopPropagation } from '../../shared/utility';
import TextEditor from '../TextEditor/TextEditor';
import TextAnalysis from '../TextAnalysis/TextAnalysis';

const initialState = {
  textAnalysisOpened: false,
};

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

  textAnalysisToggleHandler = (event) => {
    stopPropagation(event);
    if (!this.state.textAnalysisOpened) {
      const textEditorComponent = this.textEditorRef.getWrappedInstance();
      const text = textEditorComponent.getPlainText();
      const textData = {
        text,
      };
      this.props.onAnalyzeText(textData);
      const textAnalysisComponent = this.textAnalysisRef.getWrappedInstance();
      textAnalysisComponent.setText(text);
    }
    this.setState({ textAnalysisOpened: !this.state.textAnalysisOpened });
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
            type="button"
            onClick={this.textAnalysisToggleHandler}
          >
            {this.props.translate('own-text-editor.analyze-text')}
          </Button>
          <TextAnalysis
            ref={(ref) => { this.textAnalysisRef = ref; }}
            open={this.state.textAnalysisOpened}
            onClose={this.textAnalysisToggleHandler}
          />
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

const mapDispatchToProps = dispatch => ({
  onAnalyzeText: (textData) => {
    dispatch(actionCreators.analyzeText(textData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OwnTextEditor);
