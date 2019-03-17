import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
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

  onTab = (event) => {
    // Currently works only with lists
    event.preventDefault();
    const updatedEditorState = RichUtils.onTab(event, this.state.editorState, 4);
    this.setState({ editorState: updatedEditorState });
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
      <Fragment>
        {/*
          <Message warning attached style={{ margin: 0 }}>
            <Message.Header>{this.props.translate('text-editor.warning-title')}</Message.Header>
            <p>{this.props.translate('text-editor.warning-content')}</p>
          </Message>
        */}
        <Segment style={{ margin: 0 }}>
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
            onTab={this.onTab}
            spellCheck={this.state.spellCheck}
          />
        </Segment>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true },
)(TextEditor);
