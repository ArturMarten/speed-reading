import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Icon, Segment, Loader, Rating } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { sortByColumn } from '../../../shared/utility';

export class ManageFeedback extends Component {
  state = {
    column: null,
    direction: null,
  };

  componentDidMount() {
    if (this.props.users.length === 0) {
      this.props.onFetchUsers(this.props.token);
    }
    if (this.props.feedbackList.length === 0) {
      this.props.onFetchFeedback(this.props.token);
    }
  }

  onRefresh = () => {
    this.props.onFetchUsers(this.props.token);
    this.props.onFetchFeedback(this.props.token);
  }

  getUserEmailById = (userId) => {
    const foundUser = this.props.users.filter(user => user.publicId === userId);
    if (foundUser.length > 0) {
      return foundUser[0].email;
    }
    return '';
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

  render() {
    const { column, direction } = this.state;
    const sortedFeedback = sortByColumn(this.props.feedbackList, column, direction);
    return (
      <Fragment>
        <Button
          positive
          compact
          floated="right"
          loading={this.props.feedbackListStatus.loading}
          disabled={this.props.feedbackListStatus.loading}
          onClick={this.onRefresh}
          style={{ marginBottom: '5px' }}
        >
          <Icon name="refresh" />
          {this.props.translate('manage-feedback.refresh')}
        </Button>
        {this.props.feedbackListStatus.loading ?
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('manage-feedback.fetching-feedback')} />
          </Segment> :
          <Fragment>
            <Table basic celled selectable compact="very" sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing sorted={column === 'date' ? direction : null} onClick={this.sortHandler('date')}>
                    {this.props.translate('manage-feedback.date')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing sorted={column === 'userId' ? direction : null} onClick={this.sortHandler('userId')}>
                    {this.props.translate('manage-feedback.user')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'message' ? direction : null} onClick={this.sortHandler('message')}>
                    {this.props.translate('manage-feedback.message')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    {this.props.translate('manage-feedback.rating')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedFeedback.map(feedback => (
                  <Table.Row key={feedback.id}>
                    <Table.Cell>
                      {new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour12: false,
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(feedback.date)}
                    </Table.Cell>
                    <Table.Cell warning={!feedback.userId}>
                      {feedback.userId ? this.getUserEmailById(feedback.userId) :
                      <Fragment>
                        {this.props.translate('manage-feedback.user-anonymous')}
                      </Fragment>}
                    </Table.Cell>
                    <Table.Cell>
                      {feedback.message}
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <b>{this.props.translate('manage-feedback.functionality-rating')}</b>
                      </div>
                      <Rating
                        disabled
                        icon="star"
                        rating={feedback.functionalityRating}
                        maxRating={5}
                      />
                      <div>
                        <b>{this.props.translate('manage-feedback.usability-rating')}</b>
                      </div>
                      <Rating
                        disabled
                        icon="star"
                        rating={feedback.usabilityRating}
                        maxRating={5}
                      />
                      <div>
                        <b>{this.props.translate('manage-feedback.design-rating')}</b>
                      </div>
                      <Rating
                        disabled
                        icon="star"
                        rating={feedback.designRating}
                        maxRating={5}
                      />
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
  feedbackListStatus: state.feedback.feedbackListStatus,
  feedbackList: state.feedback.feedbackList,
  token: state.auth.token,
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code,
});

const mapDispatchToProps = dispatch => ({
  onFetchUsers: (token) => {
    dispatch(actionCreators.fetchUsers(token));
  },
  onFetchFeedback: (token) => {
    dispatch(actionCreators.fetchFeedback(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageFeedback);
