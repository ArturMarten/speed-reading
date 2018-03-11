import React, { Fragment } from 'react';
import { Label } from 'semantic-ui-react';

const TextCounter = (props) => {
  const plainText = props.editorState.getCurrentContent().getPlainText('');

  const regex = /(?:\r\n|\r|\n)/g;

  const charString = plainText.replace(regex, '').trim();
  const characterCount = charString.length;

  const wordString = plainText.replace(regex, ' ').trim();
  const wordArray = wordString.match(/\S+/g);
  const wordCount = wordArray ? wordArray.length : 0;

  const sentenceArray = plainText.match(/\s+[^.!?]*[.!?]/g);
  const sentenceCount = sentenceArray ? sentenceArray.length : 0;
  return (
    <Fragment>
      <Label as="a">
        {props.translate('text-editor.characters')}
        <Label.Detail>{characterCount}</Label.Detail>
      </Label>
      <Label as="a">
        {props.translate('text-editor.words')}
        <Label.Detail>{wordCount}</Label.Detail>
      </Label>
      <Label as="a">
        {props.translate('text-editor.sentences')}
        <Label.Detail>{sentenceCount}</Label.Detail>
      </Label>
    </Fragment>
  );
};

export default TextCounter;
