import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ErrorMessage from '../../Message/ErrorMessage';

export class GroupEditor extends Component {
  state = {
    name: '',
    touched: false,
    valid: false,
    submitted: false,
  }

  componentDidMount() {
    if (this.props.group) {
      this.setGroup(this.props.group);
    }
    setTimeout(() => {
      this.inputRef.focus();
      const { inputRef } = this.inputRef;
      const { length } = inputRef.value;
      inputRef.setSelectionRange(length, length);
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.groupStatus.loading && !this.props.groupStatus.loading && this.props.groupStatus.error === null) {
      this.props.onClose();
    }
  }

  setGroup(group) {
    this.setState({
      name: group.name,
      valid: true,
    });
  }

  addGroupHandler = () => {
    const group = {
      name: this.state.name,
    };
    this.props.onAddGroup(group);
    this.setState({ submitted: true });
  }

  changeGroupHandler = () => {
    const group = {
      name: this.state.name,
    };
    this.props.onChangeGroup(this.props.group.id, group);
    this.setState({ submitted: true });
  }

  groupInputChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      valid: data.value.trim() !== '',
      name: data.value,
    });
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      if (this.props.group) {
        this.changeGroupHandler(event, {});
      } else {
        this.addGroupHandler(event, {});
      }
    }
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="tiny"
        closeIcon
      >
        <Modal.Header>
          {this.props.group ?
            this.props.translate('group-editor.modal-header-change') :
            this.props.translate('group-editor.modal-header-new')}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action
            ref={(ref) => { this.inputRef = ref; }}
            value={this.state.group}
            onChange={this.groupInputChangeHandler}
            onKeyPress={this.keyPressHandler}
            placeholder={this.props.group ?
              this.props.translate('group-editor.insert-changed-placeholder') :
              this.props.translate('group-editor.insert-new-placeholder')}
          />
          {this.props.groupStatus.error && this.state.submitted ?
            <ErrorMessage
              error={this.props.groupStatus.error}
            /> : null}
        </Modal.Content>
        <Modal.Actions>
          {this.props.group ?
            <Button
              primary
              loading={this.props.groupStatus.loading}
              disabled={!this.state.touched || !this.state.valid || this.props.groupStatus.loading}
              content={this.props.translate('group-editor.change-group')}
              onClick={this.changeGroupHandler}
            /> :
            <Button
              positive
              loading={this.props.groupStatus.loading}
              disabled={!this.state.touched || !this.state.valid || this.props.groupStatus.loading}
              content={this.props.translate('group-editor.add-group')}
              onClick={this.addGroupHandler}
            />
          }
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  groupStatus: state.group.groupStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAddGroup: (group) => {
    dispatch(actionCreators.addGroup(group));
  },
  onChangeGroup: (groupId, group) => {
    dispatch(actionCreators.changeGroup(groupId, group));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupEditor);
