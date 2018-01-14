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
        <Container style={{marginTop: '5em'}} textAlign='left'>
          <Header as='h2'>Text entry</Header>
          <p>Here you can add your own texts for exercises</p>
          <Segment compact>
            <Editor
              editorState = {this.props.editorState}
              onChange = {this.props.onSaveEditorState}
            />
          </Segment>
          <p>Here you can add your own texts for exercises with styling</p>
          <Segment compact>
            <InlineStyleControls
              editorState={this.props.editorState}
              onToggle={this.toggleInlineStyle}
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
