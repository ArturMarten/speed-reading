import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Editor, RichUtils} from 'draft-js';
import {Container, Segment, Header, Message, Button, Icon} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import InlineStyleControls from '../../components/TextEntry/InlineStyleControls';

export class TextEntry extends Component {

  onTab = (event) => {
    // Currently works only with lists
    event.preventDefault();
    this.props.onSaveEditorState(RichUtils.onTab(event, this.props.editorState, 4));
  }

  toggleInlineStyle = (inlineStyle) => {
    this.props.onSaveEditorState(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  render() {
    return (
      <Container style={{marginTop: '4vh'}} textAlign='left'>
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
          onClick={this.props.onSaveText}>
          {this.props.textSaveStatus === 'Saved' ?
            <Icon fitted name='checkmark' size='large' style={{opacity: 1}} /> :
            <Icon fitted name='save' size='large' style={{opacity: 1}} />}
          {this.props.translate('text-editor.save')}
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  editorState: state.text.editorState,
  textSaveStatus: state.text.textSaveStatus,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSaveEditorState: (editorState) => {
    dispatch(actionCreators.editorStateUpdated(editorState));
  },
  onSaveText: () => {
    dispatch(actionCreators.storeText());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEntry);
