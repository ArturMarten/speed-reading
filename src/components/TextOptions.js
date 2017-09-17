import React, {Component} from 'react';


class TextOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.options.width.replace('%', ''),
      fontSize: props.options.fontSize.replace('px', '')
    }
  }
  handleWidthChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      this.setState({width: event.target.value});
    }
  }

  handleFontSizeChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      this.setState({fontSize: event.target.value});
    }
  }

  handleKeyPress(event) {
    if(event.key == 'Enter' && this.state.width != '' && this.state.fontSize != '') {
      this.props.onSubmit({width: this.state.width + '%', fontSize: this.state.fontSize + 'px'});
    }
  }

  render() {
    return(
      <div className="text-options">
        <div className="text-options-width">
          <span>Text width </span>
          <input
            type='number'
            value={this.state.width}
            onChange={this.handleWidthChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            style={{ width: '30px' }}
          />
          <span>%</span>
        </div>
        <div className="text-options-font-size">
          <span>Font size </span>
          <input
            type='number'
            value={this.state.fontSize}
            onChange={this.handleFontSizeChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            style={{ width: '30px' }}
          />
          <span>px</span>
        </div>
      </div>
    );
  }
}

export default TextOptions;