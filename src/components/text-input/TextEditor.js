import React, {Component} from 'react';
import {Editor, RichUtils} from 'draft-js';
import {Container, Segment, Header} from 'semantic-ui-react';

import InlineStyleControls from './InlineStyleControls';

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.onTab = this._onTab.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  _onTab(e) {
    // Currently works only with lists
    e.preventDefault();
    this.props.onSaveEditorState(RichUtils.onTab(e, this.props.editorState, 4));
  }

  _toggleInlineStyle(inlineStyle) {
    this.props.onSaveEditorState(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  render() {
    return (
      <div>
        <Container style={{marginTop: '4em'}} textAlign='left'>
          <Header as='h2'>{this.props.translate('text-editor.title')}</Header>
          <p>{this.props.translate('text-editor.description')}</p>
          <Segment compact>
            <Editor
              editorState = {this.props.editorState}
              onChange = {this.props.onSaveEditorState}
            />
          </Segment>
          <Segment compact>
            <InlineStyleControls
              editorState={this.props.editorState}
              onToggle={this.toggleInlineStyle}
              translate={this.props.translate}
            />
            <Editor
              editorState = {this.props.editorState}
              onChange = {this.props.onSaveEditorState}
              onTab={this.onTab}
            />
          </Segment>
        </Container>
      </div>
    );
  }
}

export default TextEditor;
