import React, { Component, Fragment } from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';

import { sortByColumn, formatMilliseconds } from '../../shared/utility';

export class StatisticsTable extends Component {
  state = {
    column: null,
    direction: null,
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
    const sortedAttempts = sortByColumn(this.props.data, column, direction);
    return (
      <Table basic celled selectable compact sortable singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={column === 'modification' ? direction : null} onClick={this.sortHandler('modification')}>
              {this.props.translate('statistics-table.modification')}
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'date' ? direction : null} onClick={this.sortHandler('date')}>
              {this.props.translate('statistics-table.attempt-date')}
            </Table.HeaderCell>
            {['readingTest', 'readingAid', 'disappearing', 'wordGroups'].indexOf(this.props.exercise) !== -1 ?
              <Fragment>
                <Table.HeaderCell sorted={column === 'readingAttempt' ? direction : null} onClick={this.sortHandler('readingAttempt')}>
                  {this.props.translate('statistics-table.reading-attempt')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'wpm' ? direction : null} onClick={this.sortHandler('wpm')}>
                  {this.props.translate('statistics-table.wpm')}
                </Table.HeaderCell>
                <Table.HeaderCell sorted={column === 'testResult' ? direction : null} onClick={this.sortHandler('testResult')}>
                  {this.props.translate('statistics-table.test-result')}
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
            <Table.Row key={attempt.id}>
              <Table.Cell collapsing>
                {this.props.translate(`modification.${attempt.modification}`)}
              </Table.Cell>
              <Table.Cell>{
                new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour12: false,
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(attempt.date)}
              </Table.Cell>
              {['readingTest', 'readingAid', 'disappearing', 'wordGroups'].indexOf(this.props.exercise) !== -1 ?
                <Fragment>
                  <Table.Cell collapsing textAlign="center">
                    {attempt.readingAttempt}
                  </Table.Cell>
                  <Table.Cell>
                    {attempt.wpm}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.testResult || attempt.testResult === 0}
                    warning={attempt.testResult > 0 && attempt.testResult < 70}
                    positive={attempt.testResult >= 70}
                  >
                    {attempt.testResult ? `${attempt.testResult}%` :
                      this.props.translate('statistics-table.test-missing')}
                  </Table.Cell>
                </Fragment> : null}
              {this.props.exercise === 'schulteTables' ?
                <Fragment>
                  <Table.Cell
                    negative={!attempt.elapsedTime}
                  >
                    {attempt.elapsedTime ? formatMilliseconds(attempt.elapsedTime) :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.spm}
                  >
                    {attempt.spm ? attempt.spm :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                </Fragment> : null}
              {this.props.exercise === 'concentration' ?
                <Fragment>
                  <Table.Cell
                    negative={!attempt.elapsedTime}
                  >
                    {attempt.elapsedTime ? formatMilliseconds(attempt.elapsedTime) :
                      this.props.translate('statistics-table.not-recorded')}
                  </Table.Cell>
                  <Table.Cell
                    negative={!attempt.exerciseResult || attempt.exerciseResult < 50}
                    warning={attempt.exerciseResult >= 50 && attempt.exerciseResult < 90}
                    positive={attempt.testResult >= 90}
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
              <Menu floated="right" pagination>
                <Menu.Item as="a" icon>
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item as="a">1</Menu.Item>
                <Menu.Item as="a" icon>
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
              <Menu floated="right">
                <Menu.Item as="a" icon disabled>
                  {this.props.translate('statistics-table.export')}
                  <Icon name="download" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default StatisticsTable;
