import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { translateError } from '../../shared/utility';

class ErrorMessage extends Component {
  state = {
    visible: true,
  };
  componentDidUpdate(prevProps) {
    if (prevProps.error === null && this.props.error !== null) {
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
      error,
      timeout,
      dispatch,
      ...rest
    } = this.props;
    return (
      this.state.visible ?
        <Message
          error
          icon={icon ? <Icon name={icon} style={{ fontSize: '1.2em' }} /> : null}
          onDismiss={this.dismissHandler}
          header={translateError(translate, error)}
          {...rest}
        /> : null
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps, null)(ErrorMessage);
