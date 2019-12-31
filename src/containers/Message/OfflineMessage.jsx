import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

const OfflineMessage = (props) => (
  <Message style={{ boxShadow: 'none', textAlign: 'center' }} info icon>
    <Icon name="power off" color="red" />
    <Message.Content>
      <Message.Header>{props.translate('message.offline-title')}</Message.Header>
      {props.translate('message.offline-description')}
    </Message.Content>
  </Message>
);

export default OfflineMessage;
