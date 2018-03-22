import React from 'react';
import { Button } from 'semantic-ui-react';

const BLOCK_STYLES = [
  { style: 'header-one', icon: 'header', translate: 'text-editor.header-1' },
  { style: 'header-two', icon: 'header', translate: 'text-editor.header-2' },
  { style: 'header-three', icon: 'header', translate: 'text-editor.header-3' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <Button.Group basic compact style={{ margin: '0 2px 0 2px' }}>
      {BLOCK_STYLES.map((type, index) => (
        <Button
          disabled
          key={type.style}
          title={props.translate(type.translate)}
          active={type.style === blockType}
          onClick={() => props.onToggle(type.style)}
        >
          <b>H{index + 1}</b>
        </Button>))}
    </Button.Group>
  );
};

export default BlockStyleControls;
