import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown } from 'semantic-ui-react';

import HelpPopup from '../../HelpPopup/HelpPopup';

class ExerciseSelectOption extends Component {
  state = {
    value: '',
  };

  componentDidMount() {
    this.setValue(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value && this.state.value !== this.props.value) {
      this.setValue(this.props.value);
    }
  }

  setValue = (newValue) => {
    this.setState({ value: newValue });
  };

  selectionChangeHandler = (event, data) => {
    const updatedValue = data.value;
    this.props.updateValue(updatedValue);
    this.setValue(updatedValue);
  };

  render() {
    return (
      <Table.Row verticalAlign="middle">
        <Table.Cell>
          {this.props.name}
          <HelpPopup position="right center" content={this.props.description} />
        </Table.Cell>
        <Table.Cell colSpan={3}>
          <Dropdown
            fluid
            selection
            scrolling
            value={this.state.value}
            options={this.props.options}
            onChange={this.selectionChangeHandler}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

ExerciseSelectOption.defaultProps = {
  description: null,
};

ExerciseSelectOption.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any,
      text: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  updateValue: PropTypes.func.isRequired,
};

export default ExerciseSelectOption;
