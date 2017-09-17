import React from 'react';

const WordGroup = (props) => {
  return (
    <span data-offset-key={props.offsetkey} style={props.style}>
      {props.children}
    </span>
  );
};

export default WordGroup;