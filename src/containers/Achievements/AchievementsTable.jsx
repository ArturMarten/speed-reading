import React from 'react';
import { Table } from 'semantic-ui-react';

function findUserNameByPublicId(users, publicId) {
  const foundUser = users.find((user) => user.publicId === publicId);
  if (foundUser) {
    return `${foundUser.firstName ? foundUser.firstName : ''} ${foundUser.lastName ? foundUser.lastName : ''} <${
      foundUser.email
    }>`;
  }
  return publicId;
}

function findUserGroupNameByPublicId(users, groups, publicId) {
  const foundUser = users.find((user) => user.publicId === publicId);
  if (foundUser) {
    const foundGroup = groups.find((group) => group.id === foundUser.groupId);
    if (foundGroup) {
      return foundGroup.name;
    }
  }
  return 'Puudub';
}

function AchievementsTable(props) {
  const { users, groups, userAchievements } = props;
  const mappedUserAchievements = userAchievements
    ? userAchievements.map(({ achievements, publicId, groupId }) => ({
        ...achievements,
        publicId,
        groupId,
      }))
    : [];
  const sortedAchievements = mappedUserAchievements.sort((a, b) => {
    if (!a.points && a.points !== 0) {
      return 1;
    }
    if (!b.points && b.points !== 0) {
      return -1;
    }
    return b.points - a.points;
  });
  return (
    <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
      <Table basic celled selectable compact="very" sortable singleLine unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Kasutaja</Table.HeaderCell>
            <Table.HeaderCell>Grupp</Table.HeaderCell>
            <Table.HeaderCell>Punktid</Table.HeaderCell>
            <Table.HeaderCell>Unikaalsed</Table.HeaderCell>
            <Table.HeaderCell>Päeva (unikaalsed)</Table.HeaderCell>
            <Table.HeaderCell>Nädala (unikaalsed)</Table.HeaderCell>
            <Table.HeaderCell>Kuu (unikaalsed)</Table.HeaderCell>
            <Table.HeaderCell>Üldised</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedAchievements.map((achievements) => (
            <Table.Row key={achievements.publicId}>
              <Table.Cell>{findUserNameByPublicId(users, achievements.publicId)}</Table.Cell>
              <Table.Cell>{findUserGroupNameByPublicId(users, groups, achievements.publicId)}</Table.Cell>
              <Table.Cell>{achievements.points || achievements.points === 0 ? achievements.points : 'null'}</Table.Cell>
              <Table.Cell>{achievements.unique ? achievements.unique.points : 'null'}</Table.Cell>
              <Table.Cell>
                {achievements.daily ? `${achievements.daily.points} (${achievements.daily.uniquePoints})` : 'null'}
              </Table.Cell>
              <Table.Cell>
                {' '}
                {achievements.weekly ? `${achievements.weekly.points} (${achievements.weekly.uniquePoints})` : 'null'}
              </Table.Cell>
              <Table.Cell>
                {' '}
                {achievements.monthly
                  ? `${achievements.monthly.points} (${achievements.monthly.uniquePoints})`
                  : 'null'}
              </Table.Cell>
              <Table.Cell>{achievements.progress ? achievements.progress.points : 'null'}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default AchievementsTable;
