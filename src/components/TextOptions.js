import React, {Component} from 'react';
import {Label, Input, Button} from 'semantic-ui-react';

const MIN_TEXT_WIDTH = 400;
const MAX_TEXT_WIDTH = 1000;
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 25;

class TextOptions extends Component {
  constructor(props) {
    super(props);
    this.state = props.options;
  }

  handleWidthChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_TEXT_WIDTH) {
        this.setState({width: MAX_TEXT_WIDTH});
      } else {
        this.setState({width: +event.target.value});
      }
    }
  }

  handleFontSizeChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_FONT_SIZE) {
        this.setState({fontSize: MAX_FONT_SIZE});
      } else {
        this.setState({fontSize: +event.target.value});
      }
    }
  }

  handleKeyPress(event) {
    if(event.key == 'Enter') {
      this.submitOptions();
    }
  }

  handleBlur(event) {
    this.submitOptions();
  }

  submitOptions() {
    const correctedOptions = {
      width: this.state.width === '' || this.state.width < MIN_TEXT_WIDTH ? MIN_TEXT_WIDTH : this.state.width,
      fontSize: this.state.fontSize === '' || this.state.fontSize < MIN_FONT_SIZE ? MIN_FONT_SIZE : this.state.fontSize,
    }
    if (this.props.options.width !== correctedOptions.width || this.props.options.fontSize !== correctedOptions.fontSize) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  render() {
    return(
      <div>
        <div>
          {'Text width '}
          <Button icon='minus' size='mini' />
          <Input 
            type='text'
            inverted
            size='small'
            value={this.state.width}
            onChange={this.handleWidthChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{ width: '58px' }}
          />
          <Button icon='plus' size='mini' />
          {' px'}
        </div>
        <div>
          {'Font size '}
          <Button icon='minus' size='mini' />
          <Input 
            type='text'
            inverted
            size='small'
            value={this.state.fontSize}
            onChange={this.handleFontSizeChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{ width: '42px' }}
          />
          <Button icon='plus' size='mini' />
          {' pt'}
        </div>
      </div>
    );
  }
}

export default TextOptions;