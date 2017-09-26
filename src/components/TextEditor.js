import React from 'react';
import {Editor} from 'draft-js';
import {Container, Segment, Header} from 'semantic-ui-react';

const TextEditor = (props) => {
  return(
    <div>
      <Container style={{ marginTop: '5em' }} textAlign='left'>
        <Header as='h2'>Text entry</Header>
        <p>Here you can add your own texts for exercises</p>
        <Segment compact>
          <Editor 
            editorState = {props.editorState}
            onChange = {props.onSaveEditorState}
          />
        </Segment>
      </Container>
    </div>
  );
};

export default TextEditor;