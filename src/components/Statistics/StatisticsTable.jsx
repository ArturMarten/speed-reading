import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon, Popup } from 'semantic-ui-react';

import HelpPopup from '../HelpPopup/HelpPopup';
import { sortByColumn, formatMilliseconds } from '../../shared/utility';
import { getExerciseById } from '../../store/reducers/exercise';

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
            {['readingExercises', 'readingTest', 'readingAid', 'scrolling', 'disappearing', 'wordGroups'].indexOf(this.props.exercise) !== -1 ?
              <Fragment>
                <Table.HeaderCell sorted={column === 'readingAttempt' ? direction : null} onClick={this.sortHandler('readingAttempt')}>
                  {this.props.translate('statistics-table.reading-attempt')}
                  <HelpPopup
                    position="top center"
                    content={this.props.translate('statistics-table.reading-attempt-description')}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'wpm' ? direction : null} onClick={this.sortHandler('wpm')}>
                  {this.props.translate('statistics-table.reading-speed')}
                  <br />
                  {`(${this.props.translate('statistics-table.wpm')})`}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'testResult' ? direction : null} onClick={this.sortHandler('testResult')}>
                  {this.props.translate('statistics-table.test-result')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'comprehensionResult' ? direction : null} onClick={this.sortHandler('comprehensionResult')}>
                  {this.props.translate('statistics-table.comprehension-result')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'cpm' ? direction : null} onClick={this.sortHandler('cpm')}>
                  {this.props.translate('statistics-table.comprehension-speed')}
                  <br />
                  {`(${this.props.translate('statistics-table.wpm')})`}
                </Table.HeaderCell>
              </Fragment> : null}
            {this.props.exercise === 'schulteTables' ?
              <Fragment>
                <Table.HeaderCell sorted={column === 'elapsedTime' ? direction : null} onClick={this.sortHandler('elapsedTime')}>
                  {this.props.translate('statistics-table.elapsed-time')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'spm' ? direction : null} onClick={this.sortHandler('spm')}>
                  {this.props.translate('statistics-table.spm')}
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
                  {this.props.translate(`exercises.title-${getExerciseById(attempt.exerciseId)}`)}
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
              {['readingExercises', 'readingTest', 'readingAid', 'scrolling', 'disappearing', 'wordGroups'].indexOf(this.props.exercise) !== -1 ?
                <Fragment>
                  <Table.Cell collapsing>
                    {attempt.readingAttempt ? attempt.readingAttempt : this.props.translate('statistics.own-text')}
                  </Table.Cell>
                  <Table.Cell>
                    {attempt.wpm}
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
                    negative={attempt.cpm === null}
                  >
                    {attempt.cpm}
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
                    negative={!attempt.spm}
                  >
                    {attempt.spm !== null ? attempt.spm :
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
    wpm: PropTypes.number,
    spm: PropTypes.number,
  })).isRequired,
  translate: PropTypes.func.isRequired,
};

export default StatisticsTable;
