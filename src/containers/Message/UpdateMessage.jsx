import React from 'react';
import { Message, Icon, Button, Popup } from 'semantic-ui-react';

const UpdateMessage = (props) => (
  <Message style={{ boxShadow: 'none', textAlign: 'center' }} warning icon>
    <Icon name="arrow alternate circle up outline" color="yellow" />
    <Message.Content>
      <Message.Header>{props.translate('message.new-update-title')}</Message.Header>
      <p>{props.translate('message.new-update-description')}</p>
      <Popup
        content={props.translate('message.update-popup')}
        position="bottom center"
        trigger={<Button color="green" inverted onClick={props.onUpdate} content={props.translate('message.update')} />}
      ></Popup>
    </Message.Content>
  </Message>
);

export default UpdateMessage;
