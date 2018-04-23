import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

export class HelpPopup extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        {this.props.content ?
          <Popup
            trigger={<Icon name="question circle outline" />}
            {...this.props}
          /> : null}
      </Fragment>
    );
  }
}

HelpPopup.defaultProps = {
  content: null,
  position: 'top left',
};

HelpPopup.propTypes = {
  content: PropTypes.string,
  position: PropTypes.string,
};

export default HelpPopup;
