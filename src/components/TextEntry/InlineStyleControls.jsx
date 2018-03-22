import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const INLINE_STYLES = [
  { style: 'BOLD', icon: 'bold', translate: 'text-editor.bold' },
  { style: 'ITALIC', icon: 'italic', translate: 'text-editor.italic' },
];

const InlineStyleControls = (props) => {
  const { editorState } = props;
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <Button.Group basic compact style={{ margin: '0 2px 0 2px' }}>
      {INLINE_STYLES.map(type => (
        <Button
          key={type.style}
          title={props.translate(type.translate)}
          active={currentStyle.has(type.style)}
          onClick={() => props.onToggle(type.style)}
        >
          <Icon name={type.icon} />
        </Button>))}
    </Button.Group>
  );
};

export default InlineStyleControls;
