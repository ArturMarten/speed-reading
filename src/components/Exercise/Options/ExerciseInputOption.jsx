import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Table } from 'semantic-ui-react';

import HelpPopup from '../../HelpPopup/HelpPopup';

const UPDATE_DELAY = 300;

class ExerciseInputOption extends PureComponent {
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

  onSubmit = (value = this.state.value) => {
    const correctedValue = value === '' || value < this.props.min ? this.props.min : value;
    if (correctedValue !== this.props.value) {
      clearTimeout(this.update);
      this.update = setTimeout(() => {
        this.props.updateValue(correctedValue);
      }, UPDATE_DELAY);
    }
    this.setValue(correctedValue);
  };

  setValue = (newValue) => {
    this.setState({ value: newValue });
  };

  changeHandler = (event) => {
    if (/^-?\d*$/.test(event.target.value)) {
      let updatedValue = +event.target.value;
      if (updatedValue > this.props.max) {
        updatedValue = this.props.max;
      }
      if (updatedValue !== this.state.value) {
        this.setValue(updatedValue);
      }
    }
  };

  decreaseHandler = () => {
    this.changeValue(this.state.value - this.props.step);
  };

  increaseHandler = () => {
    this.changeValue(this.state.value + this.props.step);
  };

  changeValue = (newValue) => {
    let updatedValue = this.state.value;
    if (newValue > this.props.max) {
      updatedValue = this.props.max;
    } else if (newValue < this.props.min) {
      updatedValue = this.props.min;
    } else {
      updatedValue = newValue;
    }
    this.onSubmit(updatedValue);
    this.setValue(updatedValue);
  };

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  };

  blurHandler = () => {
    this.onSubmit();
  };

  render() {
    return (
      <Table.Row verticalAlign="middle">
        <Table.Cell>
          {this.props.name}
          <HelpPopup position="right center" content={this.props.description} />
        </Table.Cell>
        <Table.Cell>
          <Button.Group size="mini" fluid basic>
            <Button icon="minus" disabled={this.state.value <= this.props.min} onClick={this.decreaseHandler} />
            <Button icon="plus" disabled={this.state.value >= this.props.max} onClick={this.increaseHandler} />
          </Button.Group>
        </Table.Cell>
        <Table.Cell>
          <Input
            type="text"
            transparent
            value={this.state.value}
            onChange={this.changeHandler}
            onKeyPress={this.keyPressHandler}
            onBlur={this.blurHandler}
          >
            <input style={{ textAlign: 'center' }} size={5} />
          </Input>
        </Table.Cell>
        <Table.Cell>{this.props.unit}</Table.Cell>
      </Table.Row>
    );
  }
}

ExerciseInputOption.defaultProps = {
  description: null,
};

ExerciseInputOption.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  unit: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  updateValue: PropTypes.func.isRequired,
};

export default ExerciseInputOption;
