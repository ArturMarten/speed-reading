import React, { Component } from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';

import { sortByColumn } from '../../shared/utility';

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
      <Table basic celled selectable compact sortable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={column === 'modification' ? direction : null} onClick={this.sortHandler('modification')}>
              {this.props.translate('statistics-table.modification')}
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'date' ? direction : null} onClick={this.sortHandler('date')}>
              {this.props.translate('statistics-table.date')}
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'readingAttempt' ? direction : null} onClick={this.sortHandler('readingAttempt')}>
              {this.props.translate('statistics-table.reading-attempt')}
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'wpm' ? direction : null} onClick={this.sortHandler('wpm')}>
              {this.props.translate('statistics-table.wpm')}
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'testResult' ? direction : null} onClick={this.sortHandler('testResult')}>
              {this.props.translate('statistics-table.test-result')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedAttempts.map(attempt => (
            <Table.Row key={attempt.id}>
              <Table.Cell collapsing>
                {this.props.translate('statistics-table.default')}
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
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="5">
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
                  {this.props.translate('statistics-table.export-csv')}
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
