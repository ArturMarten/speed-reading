import React, { Component } from 'react';
import { Input, Button, Table } from 'semantic-ui-react';

class ExerciseInputOption extends Component {
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
      this.props.updateValue(correctedValue);
    }
    this.setValue(correctedValue);
  }

  setValue = (newValue) => {
    this.setState({ value: newValue });
  }

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
  }

  decreaseHandler = () => {
    this.changeValue(this.state.value - this.props.step);
  }

  increaseHandler = () => {
    this.changeValue(this.state.value + this.props.step);
  }

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
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  blurHandler = () => {
    this.onSubmit();
  }

  render() {
    return (
      <Table.Row verticalAlign="middle">
        <Table.Cell>
          {this.props.name}
        </Table.Cell>
        <Table.Cell>
          <Button.Group size="mini" fluid basic>
            <Button
              icon="minus"
              disabled={this.state.value <= this.props.min}
              onClick={this.decreaseHandler}
            />
            <Button
              icon="plus"
              disabled={this.state.value >= this.props.max}
              onClick={this.increaseHandler}
            />
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
        <Table.Cell>
          {this.props.unit}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ExerciseInputOption;
