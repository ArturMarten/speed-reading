import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Menu, Button, Icon, Segment, Loader } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { sortByColumn } from '../../../shared/utility';
import GroupEditor from './GroupEditor';

export class ManageGroups extends Component {
  state = {
    groupEditorOpened: false,
    column: 'creationDate',
    direction: 'descending',
  };

  componentDidMount() {
    if (this.props.groups.length === 0) {
      this.props.onFetchGroups();
    }
  }

  onRefresh = () => {
    this.props.onFetchGroups();
  }

  sortHandler = selectedColumn => () => {
    const { column, direction } = this.state;
    if (column !== selectedColumn) {
      this.setState({
        column: selectedColumn,
        direction: 'ascending',
      });
    } else {
      this.setState({
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
  };

  groupEditorToggleHandler = () => {
    this.setState({
      groupEditorOpened: !this.state.groupEditorOpened,
    });
  }

  render() {
    const { column, direction } = this.state;
    const sortedGroups = sortByColumn(this.props.groups, column, direction);
    return (
      <Fragment>
        {this.state.groupEditorOpened ?
          <GroupEditor
            open={this.state.groupEditorOpened}
            onClose={this.groupEditorToggleHandler}
          /> : null}
        <Button
          positive
          compact
          floated="right"
          loading={this.props.groupsStatus.loading}
          disabled={this.props.groupsStatus.loading}
          onClick={this.onRefresh}
          style={{ marginBottom: '5px' }}
        >
          <Icon name="refresh" />
          {this.props.translate('manage-groups.refresh')}
        </Button>
        {this.props.groupsStatus.loading ?
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('manage-groups.fetching-groups')} />
          </Segment> :
          <Fragment>
            <Table basic celled selectable compact="very" sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={column === 'id' ? direction : null} onClick={this.sortHandler('id')}>
                    {this.props.translate('manage-groups.group')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'creationDate' ? direction : null} onClick={this.sortHandler('creationDate')}>
                    {this.props.translate('manage-groups.creation-date')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'userCount' ? direction : null} onClick={this.sortHandler('userCount')}>
                    {this.props.translate('manage-groups.user-count')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedGroups.map(group => (
                  <Table.Row key={group.id}>
                    <Table.Cell>
                      {group.name}
                    </Table.Cell>
                    <Table.Cell>{
                      new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }).format(group.creationDate)}
                    </Table.Cell>
                    <Table.Cell>
                      {group.userCount}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="6">
                    <Button
                      positive
                      floated="right"
                      content={this.props.translate('manage-groups.add-group')}
                      onClick={this.groupEditorToggleHandler}
                    />
                    <Menu floated="right" pagination compact>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron left" />
                      </Menu.Item>
                      <Menu.Item as="a">1</Menu.Item>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron right" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Fragment>}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  groupsStatus: state.group.groupsStatus,
  groups: state.group.groups,
  token: state.auth.token,
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code,
});

const mapDispatchToProps = dispatch => ({
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageGroups);
