import React, { Component } from 'react';
import { Table, Dropdown, Popup, Icon } from 'semantic-ui-react';

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
  }

  selectionChangeHandler = (event, data) => {
    const updatedValue = data.value;
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

export default ExerciseSelectOption;
