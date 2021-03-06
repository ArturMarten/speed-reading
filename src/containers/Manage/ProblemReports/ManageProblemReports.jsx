import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Icon, Segment, Loader, Modal, Image, Dropdown } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import axios from '../../../api/axios-http';
import * as actionCreators from '../../../store/actions';
import { sortByColumn } from '../../../shared/utility';

export class ManageProblemReports extends Component {
  state = {
    column: 'date',
    direction: 'descending',
    screenshotSrc: null,
    screenshotOpen: false,
  };

  componentDidMount() {
    if (this.props.users.length === 0) {
      this.props.onFetchUsers();
    }
    if (this.props.problemReports.length === 0) {
      this.props.onFetchProblemReports();
    }
  }

  onRefresh = () => {
    this.props.onFetchUsers();
    this.props.onFetchProblemReports();
  };

  getUserEmailById = (userId) => {
    const foundUser = this.props.users.filter((user) => user.publicId === userId);
    if (foundUser.length > 0) {
      return foundUser[0].email;
    }
    return '';
  };

  openScreenshotToggle = (screenshotSrc) => () => {
    this.setState({
      screenshotSrc,
      screenshotOpen: !this.state.screenshotOpen,
    });
  };

  sortHandler = (selectedColumn) => () => {
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

  resolvedChangeHandler = (problemReportId, resolved) => {
    this.props.onResolveProblemReport(problemReportId, resolved);
  };

  render() {
    const { column, direction } = this.state;
    const sortedProblemReports = sortByColumn(this.props.problemReports, column, direction);
    const resolvedOptions = [
      { key: 0, value: false, text: this.props.translate('manage-problem-reports.problem-unresolved') },
      { key: 1, value: true, text: this.props.translate('manage-problem-reports.problem-resolved') },
    ];
    const screenshotModal = (
      <Modal open={this.state.screenshotOpen} onClose={this.openScreenshotToggle(null)} closeIcon>
        <Image
          bordered
          centered
          size="huge"
          src={this.state.screenshotSrc}
          alt={this.props.translate('manage-problem-reports.screenshot-alt')}
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
          loading={this.props.problemReportsStatus.loading}
          disabled={this.props.problemReportsStatus.loading}
          onClick={this.onRefresh}
          style={{ marginBottom: '5px' }}
        >
          <Icon name="refresh" />
          {this.props.translate('manage-problem-reports.refresh')}
        </Button>
        {this.props.problemReportsStatus.loading ? (
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader
              active
              indeterminate
              content={this.props.translate('manage-problem-reports.fetching-problem-reports')}
            />
          </Segment>
        ) : (
          <Fragment>
            <Table basic celled selectable compact="very" sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    collapsing
                    sorted={column === 'date' ? direction : null}
                    onClick={this.sortHandler('date')}
                  >
                    {this.props.translate('manage-problem-reports.date')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    collapsing
                    sorted={column === 'userId' ? direction : null}
                    onClick={this.sortHandler('userId')}
                  >
                    {this.props.translate('manage-problem-reports.user')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    collapsing
                    sorted={column === 'resolved' ? direction : null}
                    onClick={this.sortHandler('resolved')}
                  >
                    {this.props.translate('manage-problem-reports.resolved')}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'description' ? direction : null}
                    onClick={this.sortHandler('description')}
                  >
                    {this.props.translate('manage-problem-reports.description')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    {this.props.translate('manage-problem-reports.actions')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedProblemReports.map((problemReport) => (
                  <Table.Row key={problemReport.id}>
                    <Table.Cell>
                      {new Intl.DateTimeFormat(this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour12: false,
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(problemReport.date)}
                    </Table.Cell>
                    <Table.Cell>{this.getUserEmailById(problemReport.userId)}</Table.Cell>
                    <Table.Cell positive={problemReport.resolved} negative={!problemReport.resolved}>
                      <Dropdown
                        selection
                        loading={problemReport.loading}
                        disabled={problemReport.loading}
                        value={problemReport.resolved}
                        onChange={(event, { value }) => this.resolvedChangeHandler(problemReport.id, value)}
                        options={resolvedOptions}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {problemReport.textTitle !== null ? (
                        <div>
                          <b>Teksti pealkiri: </b>
                          {problemReport.textTitle}
                        </div>
                      ) : null}
                      {problemReport.description}
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group compact vertical>
                        {problemReport.screenshotFilename ? (
                          <Button
                            primary
                            content={this.props.translate('manage-problem-reports.screenshot')}
                            onClick={this.openScreenshotToggle(
                              `${axios.defaults.baseURL}submittedScreenshots/${problemReport.screenshotFilename}`,
                            )}
                          />
                        ) : null}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  usersStatus: state.user.usersStatus,
  users: state.user.users,
  problemReportsStatus: state.problemReport.problemReportsStatus,
  problemReports: state.problemReport.problemReports,
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchUsers: () => {
    dispatch(actionCreators.fetchUsers());
  },
  onFetchProblemReports: () => {
    dispatch(actionCreators.fetchProblemReports());
  },
  onResolveProblemReport: (problemReportId, resolved) => {
    dispatch(actionCreators.resolveProblemReport(problemReportId, resolved));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageProblemReports);
