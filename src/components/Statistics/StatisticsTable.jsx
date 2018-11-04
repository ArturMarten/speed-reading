import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon, Popup } from 'semantic-ui-react';

import HelpPopup from '../HelpPopup/HelpPopup';
import { sortByColumn, formatMilliseconds } from '../../shared/utility';

const readingExercises = [
  'readingExercises',
  'readingTest',
  'readingAid',
  'scrolling',
  'disappearing',
  'wordGroups',
];

export class StatisticsTable extends Component {
  state = {
    column: 'date',
    direction: 'descending',
  };

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
    const { data } = this.props;
    const sortedAttempts = sortByColumn(data, column, direction);
    return (
      <Table basic celled selectable compact="very" sortable singleLine>
        <Table.Header>
          <Table.Row>
            {this.props.exercise === 'readingExercises' ?
              <Table.HeaderCell sorted={column === 'exerciseId' ? direction : null} onClick={this.sortHandler('exerciseId')}>
                {this.props.translate('statistics-table.exercise')}
              </Table.HeaderCell> : null}
            <Table.HeaderCell sorted={column === 'modification' ? direction : null} onClick={this.sortHandler('modification')}>
              {this.props.translate('statistics-table.modification')}
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'date' ? direction : null} onClick={this.sortHandler('date')}>
              {this.props.translate('statistics-table.attempt-date')}
            </Table.HeaderCell>
            {readingExercises.indexOf(this.props.exercise) !== -1 ?
              <Fragment>
                <Table.HeaderCell sorted={column === 'userReadingAttemptCount' ? direction : null} onClick={this.sortHandler('userReadingAttemptCount')}>
                  {this.props.translate('statistics-table.reading-attempt')}
                  <HelpPopup
                    position="top center"
                    content={this.props.translate('statistics-table.reading-attempt-description')}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'wordsPerMinute' ? direction : null} onClick={this.sortHandler('wordsPerMinute')}>
                  {this.props.translate('statistics-table.reading-speed')}
                  <br />
                  {`(${this.props.translate('statistics-table.words-per-minute')})`}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'testResult' ? direction : null} onClick={this.sortHandler('testResult')}>
                  {this.props.translate('statistics-table.test-result')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'comprehensionResult' ? direction : null} onClick={this.sortHandler('comprehensionResult')}>
                  {this.props.translate('statistics-table.comprehension-level')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'comprehensionPerMinute' ? direction : null} onClick={this.sortHandler('comprehensionPerMinute')}>
                  {this.props.translate('statistics-table.comprehension-speed')}
                  <br />
                  {`(${this.props.translate('statistics-table.words-per-minute')})`}
                </Table.HeaderCell>
              </Fragment> : null}
            {this.props.exercise === 'schulteTables' ?
              <Fragment>
                <Table.HeaderCell sorted={column === 'elapsedTime' ? direction : null} onClick={this.sortHandler('elapsedTime')}>
                  {this.props.translate('statistics-table.elapsed-time')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'symbolsPerMinute' ? direction : null} onClick={this.sortHandler('symbolsPerMinute')}>
                  {this.props.translate('statistics-table.symbolsPerMinute')}
                </Table.HeaderCell>
              </Fragment> : null}
            {this.props.exercise === 'concentration' ?
              <Fragment>
                <Table.HeaderCell sorted={column === 'elapsedTime' ? direction : null} onClick={this.sortHandler('elapsedTime')}>
                  {this.props.translate('statistics-table.elapsed-time')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'exerciseResult' ? direction : null} onClick={this.sortHandler('exerciseResult')}>
                  {this.props.translate('statistics-table.exercise-result')}
                </Table.HeaderCell>
              </Fragment> : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedAttempts.map(attempt => (
            <Table.Row key={attempt.id} title={attempt.readingTextTitle ? attempt.readingTextTitle : null}>
              {this.props.exercise === 'readingExercises' ?
                <Table.Cell>
                  {this.props.translate(`exercises.title-${attempt.exercise}`)}
                </Table.Cell> : null}
              <Table.Cell collapsing>
                {this.props.translate(`modification.${attempt.modification}`)}
              </Table.Cell>
              <Table.Cell>
                {new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour12: false,
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(attempt.date)}
              </Table.Cell>
              {readingExercises.indexOf(this.props.exercise) !== -1 ?
                <Fragment>
                  <Table.Cell collapsing>
                    {attempt.userReadingAttemptCount ? attempt.userReadingAttemptCount : this.props.translate('statistics.own-text')}
                  </Table.Cell>
                  <Table.Cell>
                    {attempt.wordsPerMinute}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.testResult || attempt.testResult === 0}
                    warning={attempt.testResult > 0 && attempt.testResult < 70}
                    positive={attempt.testResult >= 70}
                  >
                    {attempt.testResult !== null ? `${attempt.testResult}%` :
                      this.props.translate('statistics-table.test-missing')}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.comprehensionResult || attempt.comprehensionResult === 0}
                    warning={attempt.comprehensionResult > 0 && attempt.comprehensionResult < 70}
                    positive={attempt.comprehensionResult >= 70}
                  >
                    {attempt.comprehensionResult !== null ? `${attempt.comprehensionResult}%` :
                      null}
                  </Table.Cell>
                  <Table.Cell
                    negative={attempt.comprehensionPerMinute === null}
                  >
                    {attempt.comprehensionPerMinute}
                  </Table.Cell>
                </Fragment> : null}
              {this.props.exercise === 'schulteTables' ?
                <Fragment>
                  <Table.Cell
                    negative={!attempt.elapsedTime}
                  >
                    {attempt.elapsedTime !== null ? formatMilliseconds(attempt.elapsedTime) :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.symbolsPerMinute}
                  >
                    {attempt.symbolsPerMinute !== null ? attempt.symbolsPerMinute :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                </Fragment> : null}
              {this.props.exercise === 'concentration' ?
                <Fragment>
                  <Table.Cell
                    negative={!attempt.elapsedTime}
                  >
                    {attempt.elapsedTime !== null ? formatMilliseconds(attempt.elapsedTime) :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.exerciseResult || attempt.exerciseResult < 50}
                    warning={attempt.exerciseResult >= 50 && attempt.exerciseResult < 90}
                    positive={attempt.exerciseResult >= 90}
                  >
                    {attempt.exerciseResult !== null ? `${attempt.exerciseResult}%` :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                </Fragment> : null}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="10">
              <Popup
                content={this.props.translate('statistics.not-implemented')}
                position="left center"
                on="hover"
                trigger={
                  <Menu floated="right">
                    <Menu.Item as="a" icon>
                      {this.props.translate('statistics-table.export')}
                      <Icon name="download" />
                    </Menu.Item>
                  </Menu>
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

StatisticsTable.propTypes = {
  exercise: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired,
    wordsPerMinute: PropTypes.number,
    symbolsPerMinute: PropTypes.number,
  })).isRequired,
  translate: PropTypes.func.isRequired,
};

export default StatisticsTable;
