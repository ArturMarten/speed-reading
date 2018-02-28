import React, { Component } from 'react';
import './StyleButton.css';

class StyleButton extends Component {
  onToggle = (event) => {
    event.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span role="button" tabIndex="0" className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

export default StyleButton;
