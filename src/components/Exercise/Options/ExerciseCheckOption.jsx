import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox } from 'semantic-ui-react';

import HelpPopup from '../../HelpPopup/HelpPopup';

class ExerciseCheckOption extends Component {
  state = {
    value: false,
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
  }

  changeHandler = (event, data) => {
    const updatedValue = data.checked;
    this.props.updateValue(updatedValue);
    this.setValue(updatedValue);
  }

  render() {
    return (
      <Table.Row verticalAlign="middle">
        <Table.Cell>
          {this.props.name}
          <HelpPopup
            position="right center"
            content={this.props.description}
          />
        </Table.Cell>
        <Table.Cell colSpan={3}>
          <Checkbox
            disabled
            checked={this.state.value}
            onChange={this.changeHandler}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

ExerciseCheckOption.defaultProps = {
  description: null,
};

ExerciseCheckOption.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.bool.isRequired,
  updateValue: PropTypes.func.isRequired,
};

export default ExerciseCheckOption;
