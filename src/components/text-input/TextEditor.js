import React, {Component} from 'react';
import {Editor, RichUtils} from 'draft-js';
import {Container, Segment, Header, Message, Button, Icon} from 'semantic-ui-react';

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
      <Container style={{marginTop: '4em'}} textAlign='left'>
        <Header as='h2'>{this.props.translate('text-editor.title')}</Header>
        <p>{this.props.translate('text-editor.description')}</p>
        <Message warning>
          <Message.Header>{this.props.translate('text-editor.warning-title')}</Message.Header>
          <p>{this.props.translate('text-editor.warning-content')}</p>
        </Message>
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
        <Button positive floated='right'
          loading={this.props.textSaveStatus === 'Saving'}
          disabled={this.props.textSaveStatus === 'Saving'}
          onClick={() => this.props.onSaveText()}>
          {this.props.textSaveStatus === 'Saved' ?
            <Icon fitted name='checkmark' size='large' style={{opacity: 1}} /> :
            <Icon fitted name='save' size='large' style={{opacity: 1}} />}
          {this.props.translate('text-editor.save')}
        </Button>
      </Container>
    );
  }
}

export default TextEditor;
