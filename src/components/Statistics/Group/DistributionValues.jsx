import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'semantic-ui-react';

function findUserNameByPublicId(users, publicId, translate) {
  const foundUser = users.find((user) => user.publicId === publicId);
  if (foundUser) {
    return `${foundUser.firstName ? foundUser.firstName : ''} ${foundUser.lastName ? foundUser.lastName : ''} <${
      foundUser.email
    }>`;
  }
  if (publicId) return publicId;
  return translate('distribution.unknown');
}

function DistributionValues(props) {
  const { data, onClose, translate } = props;
  const values = data.sort((a, b) => a.value - b.value);
  const users = useSelector((state) => state.user.users);
  return (
    <Modal open size="small" onClose={onClose} closeIcon>
      <Modal.Header>{translate('distribution.values-title')}</Modal.Header>
      <Modal.Content scrolling>
        <Table basic celled selectable compact="very" sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{translate('distribution.user')}</Table.HeaderCell>
              <Table.HeaderCell>{translate('distribution.value')}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {values.map(({ userId, value }, index) => (
              <Table.Row key={`${index} ${userId} ${value}`}>
                <Table.Cell>{findUserNameByPublicId(users, userId, translate)}</Table.Cell>
                <Table.Cell>{value.toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={onClose} content={translate('distribution.close')} />
      </Modal.Actions>
    </Modal>
  );
}

export default DistributionValues;
