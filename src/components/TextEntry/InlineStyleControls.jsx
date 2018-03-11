import React from 'react';
import StyleButton from './StyleButton';
import TextCounter from './TextCounter';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD', translate: 'text-editor.bold' },
  { label: 'Italic', style: 'ITALIC', translate: 'text-editor.italic' },
//  { label: 'Underline', style: 'UNDERLINE' },
//  { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="DraftEditor-controls">
      {INLINE_STYLES.map(type =>
        (<StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={props.translate(type.translate)}
          onToggle={props.onToggle}
          style={type.style}
        />))}
      <TextCounter
        translate={props.translate}
        editorState={props.editorState}
      />
    </div>
  );
};

export default InlineStyleControls;
