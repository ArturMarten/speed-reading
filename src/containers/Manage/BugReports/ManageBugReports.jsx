import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Icon, Segment, Loader, Modal, Image } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import axios from '../../../axios-http';
import * as actionCreators from '../../../store/actions';
import { sortByColumn } from '../../../shared/utility';

export class ManageBugReports extends Component {
  state = {
    column: null,
    direction: null,
    screenshotSrc: null,
    screenshotOpen: false,
  };

  componentDidMount() {
    if (this.props.users.length === 0) {
      this.props.onFetchUsers(this.props.token);
    }
    if (this.props.bugReports.length === 0) {
      this.props.onFetchBugReports(this.props.token);
    }
  }

  onRefresh = () => {
    this.props.onFetchUsers(this.props.token);
    this.props.onFetchBugReports(this.props.token);
  }

  getUserEmailById = (userId) => {
    const foundUser = this.props.users.filter(user => user.publicId === userId);
    if (foundUser.length > 0) {
      return foundUser[0].email;
    }
    return '';
  }

  openScreenshotToggle = screenshotSrc => () => {
    this.setState({
      screenshotSrc,
      screenshotOpen: !this.state.screenshotOpen,
    });
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

  logBugReportInfo = bugReport => () => {
    console.log({
      platform: bugReport.platform,
      userAgent: bugReport.userAgent,
      consoleErrors: bugReport.consoleErrors,
      actions: bugReport.actions,
      state: bugReport.state,
      windowDimensions: bugReport.windowDimensions,
    });
  }

  render() {
    const { column, direction } = this.state;
    const sortedBugReports = sortByColumn(this.props.bugReports, column, direction);
    const screenshotModal = (
      <Modal open={this.state.screenshotOpen} onClose={this.openScreenshotToggle(null)} closeIcon>
        <Image
          bordered
          centered
          size="huge"
          src={this.state.screenshotSrc}
          alt={this.props.translate('manage-bug-reports.screenshot-alt')}
        />
      </Modal>
    );
    return (
      <Fragment>
        {screenshotModal}
        <Button
          positive
          compact
          floated="right"
          loading={this.props.bugReportsStatus.loading}
          disabled={this.props.bugReportsStatus.loading}
          onClick={this.onRefresh}
          style={{ marginBottom: '5px' }}
        >
          <Icon name="refresh" />
          {this.props.translate('manage-bug-reports.refresh')}
        </Button>
        {this.props.bugReportsStatus.loading ?
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('manage-bug-reports.fetching-bug-reports')} />
          </Segment> :
          <Fragment>
            <Table basic celled selectable compact="very" sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing sorted={column === 'date' ? direction : null} onClick={this.sortHandler('date')}>
                    {this.props.translate('manage-bug-reports.date')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing sorted={column === 'userId' ? direction : null} onClick={this.sortHandler('userId')}>
                    {this.props.translate('manage-bug-reports.user')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing sorted={column === 'resolved' ? direction : null} onClick={this.sortHandler('resolved')}>
                    {this.props.translate('manage-bug-reports.resolved')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'description' ? direction : null} onClick={this.sortHandler('description')}>
                    {this.props.translate('manage-bug-reports.description')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedBugReports.map(bugReport => (
                  <Table.Row key={bugReport.id}>
                    <Table.Cell>
                      {new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour12: false,
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(bugReport.date)}
                    </Table.Cell>
                    <Table.Cell>
                      {this.getUserEmailById(bugReport.userId)}
                    </Table.Cell>
                    <Table.Cell positive={bugReport.resolved} negative={!bugReport.resolved}>
                      {bugReport.resolved ?
                        this.props.translate('manage-bug-reports.bug-resolved') :
                        this.props.translate('manage-bug-reports.bug-not-resolved')}
                    </Table.Cell>
                    <Table.Cell>
                      {bugReport.description}
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group compact vertical>
                        <Button
                          primary
                          content={this.props.translate('manage-bug-reports.screenshot')}
                          onClick={this.openScreenshotToggle(`${axios.defaults.baseURL}bugReportScreenshots/${bugReport.screenshotFilename}`)}
                        />
                        <Button
                          positive
                          content={this.props.translate('manage-bug-reports.log-info')}
                          onClick={this.logBugReportInfo(bugReport)}
                        />
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Fragment>}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  usersStatus: state.user.usersStatus,
  users: state.user.users,
  bugReportsStatus: state.bugReport.bugReportsStatus,
  bugReports: state.bugReport.bugReports,
  token: state.auth.token,
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code,
});

const mapDispatchToProps = dispatch => ({
  onFetchUsers: (token) => {
    dispatch(actionCreators.fetchUsers(token));
  },
  onFetchBugReports: (token) => {
    dispatch(actionCreators.fetchBugReports(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageBugReports);
