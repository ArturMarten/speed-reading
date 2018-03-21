import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';

export class GroupEditor extends Component {
  state = {
    name: '',
    touched: false,
    valid: false,
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

  setGroup(group) {
    this.setState({
      name: group.name,
      valid: true,
    });
  }

  addGroupHandler = (event, data) => {
    const group = {
      name: this.state.name,
    };
    this.props.onAddGroup(group, this.props.token);
    this.props.onClose(event, data);
  }

  changeGroupHandler = (event, data) => {
    const group = {
      name: this.state.name,
    };
    this.props.onChangeGroup(this.props.group.id, group, this.props.token);
    this.props.onClose(event, data);
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
        </Modal.Content>
        <Modal.Actions>
          {this.props.group ?
            <Button
              primary
              disabled={!this.state.touched || !this.state.valid}
              content={this.props.translate('group-editor.change-group')}
              onClick={this.changeGroupHandler}
            /> :
            <Button
              positive
              disabled={!this.state.touched || !this.state.valid}
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
  token: state.auth.token,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAddGroup: (group, token) => {
    dispatch(actionCreators.addGroup(group, token));
  },
  onChangeGroup: (groupId, group, token) => {
    dispatch(actionCreators.changeGroup(groupId, group, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupEditor);
