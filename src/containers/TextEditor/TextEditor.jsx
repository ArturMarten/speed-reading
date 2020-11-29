import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { getTranslate } from 'react-localize-redux';

import './TextEditor.css';
import InlineStyleControls from '../../components/TextEntry/InlineStyleControls';
import BlockStyleControls from '../../components/TextEntry/BlockStyleControls';
import TextCounter from '../../components/TextEntry/TextCounter';

export class TextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    spellCheck: false,
  };

  getPlainText = () => {
    const contentState = this.state.editorState.getCurrentContent();
    return contentState.getPlainText('');
  };

  getRawContent = () => {
    const contentState = this.state.editorState.getCurrentContent();
    return convertToRaw(contentState);
  };

  setContent = (contentState) => {
    this.setState({ editorState: EditorState.createWithContent(contentState) });
  };

  clearContent = () => {
    this.setState({ editorState: EditorState.createEmpty() });
  };

  toggleInlineStyle = (inlineStyle) => {
    const updatedEditorState = RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle);
    this.setState({ editorState: updatedEditorState });
  };

  toggleBlockType = (blockType) => {
    const updatedEditorState = RichUtils.toggleBlockType(this.state.editorState, blockType);
    this.setState({ editorState: updatedEditorState });
  };

  toggleSpellCheck = () => {
    this.setState({ spellCheck: !this.state.spellCheck });
  };

  render() {
    return (
      <>
        <div className="DraftEditor-controls">
          <InlineStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleInlineStyle}
            translate={this.props.translate}
          />
          <BlockStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
            translate={this.props.translate}
          />
          <Button
            basic
            compact
            style={{ margin: '2px 2px' }}
            active={this.state.spellCheck}
            content={this.props.translate('text-editor.spell-check')}
            onClick={this.toggleSpellCheck}
          />
          <TextCounter editorState={this.state.editorState} translate={this.props.translate} />
        </div>
        <Editor
          editorState={this.state.editorState}
          onChange={(editorState) => this.setState({ editorState })}
          spellCheck={this.state.spellCheck}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TextEditor);
