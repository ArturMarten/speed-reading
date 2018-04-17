import React, { Component } from 'react';
import { Table, Checkbox, Popup, Icon } from 'semantic-ui-react';

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
          {this.props.description ?
            <Popup
              trigger={<Icon name="question circle outline" />}
              position="right center"
              content={this.props.description}
            /> : null}
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

export default ExerciseCheckOption;
