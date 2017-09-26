import React from 'react';
import {Editor} from 'draft-js';

const TextEditor = (props) => {
  return(
    <div className="text-editor">
      <Editor 
        editorState = {props.editorState}
        onChange = {props.onSaveEditorState}
      />
    </div>
  );
};

export default TextEditor;