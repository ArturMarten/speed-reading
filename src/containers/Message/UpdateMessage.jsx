import React from 'react';
import { Message, Icon, Button } from 'semantic-ui-react';

const UpdateMessage = (props) => (
  <Message style={{ boxShadow: 'none' }} warning icon>
    <Icon name="arrow alternate circle up outline" color="yellow" />
    <Message.Content>
      <Message.Header>{props.translate('message.new-update-title')}</Message.Header>
      {props.translate('message.new-update-description')}
      &nbsp;
      <Button color="green" inverted onClick={props.onUpdate} content={props.translate('message.update')} />
    </Message.Content>
  </Message>
);

export default UpdateMessage;
