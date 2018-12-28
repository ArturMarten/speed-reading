import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
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

  componentDidUpdate(prevProps) {
    if (prevProps.selectStatus.loading && !this.props.selectStatus.loading && this.props.selectStatus.error === null) {
      this.props.onClose();
    }
  }

  onSubmit = () => {
    const textEditorComponent = this.textEditorRef;
    const selectedText = {
      language: 'estonian',
      plainText: textEditorComponent.getPlainText(),
      contentState: textEditorComponent.getRawContent(),
    };
    this.props.onOwnTextSelect(selectedText);
  }

  textAnalysisToggleHandler = (event) => {
    stopPropagation(event);
    if (!this.state.textAnalysisOpened) {
      const textEditorComponent = this.textEditorRef;
      const text = textEditorComponent.getPlainText();
      const textData = {
        language: 'estonian',
        text,
      };
      this.props.onAnalyzeText(textData);
      const textAnalysisComponent = this.textAnalysisRef;
      textAnalysisComponent.setText(text);
    }
    this.setState({ textAnalysisOpened: !this.state.textAnalysisOpened });
  }

  render() {
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>
          {this.props.translate('own-text-editor.modal-header')}
        </Modal.Header>
        {/*
        <Message
          warning
          icon="warning sign"
          header={this.props.translate('own-text-editor.issues')}
        />
        */}
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
          <Button
            positive
            type="button"
            onClick={this.onSubmit}
            loading={this.props.selectStatus.loading}
            disabled={this.props.selectStatus.loading}
          >
            {this.props.translate('own-text-editor.use')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  selectStatus: state.text.selectStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAnalyzeText: (textData) => {
    dispatch(actionCreators.analyzeText(textData));
  },
  onOwnTextSelect: (textData) => {
    dispatch(actionCreators.selectOwnText(textData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OwnTextEditor);
