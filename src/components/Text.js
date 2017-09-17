import React from 'react';
import { Editor } from 'draft-js';

const styleMap = {
  'HIDE': {
    visibility: 'hidden'
  },
};

const Text = (props) => {
  return(
    <div className="text">
      <Editor 
        editorState = {props.editorState}
        readOnly = {true}
        customStyleMap={styleMap}
      />
    </div>
  );
};

export default Text;