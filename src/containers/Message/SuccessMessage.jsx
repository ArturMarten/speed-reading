import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { translateSuccess } from '../../shared/utility';

class SuccessMessage extends Component {
  state = {
    visible: true,
  };
  componentDidUpdate(prevProps) {
    if (prevProps.message === null && this.props.message !== null) {
      this.onVisibleToggle(true);
      if (this.props.timeout) {
        setTimeout(() => this.onVisibleToggle(false), this.props.timeout);
      }
    }
  }

  onVisibleToggle = (toggle) => {
    this.setState({ visible: toggle });
  }

  dismissHandler = () => {
    this.onVisibleToggle(false);
  }

  render() {
    const {
      translate,
      icon,
      message,
      timeout,
      dispatch,
      ...rest
    } = this.props;
    return (
      this.state.visible ?
        <Message
          success
          icon={icon ? <Icon name={icon} style={{ fontSize: '1.2em' }} /> : null}
          onDismiss={this.dismissHandler}
          header={translateSuccess(translate, message)}
          {...rest}
        /> : null
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps, null)(SuccessMessage);
