import React, {Component} from 'react';
import {Input, Button} from 'semantic-ui-react';

const MIN_TEXT_WIDTH = 500;
const MAX_TEXT_WIDTH = 1000;
const MIN_TEXT_LINE_COUNT = 5;
const MAX_TEXT_LINE_COUNT = 50;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;

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

  increaseWidth() {
    this.changeWidth(this.state.width + 50);
  }

  decreaseWidth() {
    this.changeWidth(this.state.width - 50);
  }

  changeWidth(newValue) {
    let newWidth = this.state.width;
    if (newValue > MAX_TEXT_WIDTH) {
      newWidth = MAX_TEXT_WIDTH;
    } else if (newValue < MIN_TEXT_WIDTH) {
      newWidth = MIN_TEXT_WIDTH;
    } else {
      newWidth = newValue;
    }
    this.props.onSubmit({...this.state, width: newWidth});
    this.setState({width: newWidth});
  }

  handleLineCountChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_TEXT_LINE_COUNT) {
        this.setState({lineCount: MAX_TEXT_LINE_COUNT});
      } else {
        this.setState({lineCount: +event.target.value});
      }
    }
  }

  increaseLineCount() {
    this.changeLineCount(this.state.lineCount + 1);
  }

  decreaseLineCount() {
    this.changeLineCount(this.state.lineCount - 1);
  }

  changeLineCount(newValue) {
    let newLineCount = this.state.lineCount;
    if (newValue > MAX_TEXT_LINE_COUNT) {
      newLineCount = MAX_TEXT_LINE_COUNT;
    } else if (newValue < MIN_TEXT_LINE_COUNT) {
      newLineCount = MIN_TEXT_LINE_COUNT;
    } else {
      newLineCount = newValue;
    }
    this.props.onSubmit({...this.state, lineCount: newLineCount});
    this.setState({lineCount: newLineCount});
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

  increaseFontSize() {
    this.changeFontSize(this.state.fontSize + 1);
  }

  decreaseFontSize() {
    this.changeFontSize(this.state.fontSize - 1);
  }

  changeFontSize(newValue) {
    let newFontSize = this.state.fontSize;
    if (newValue > MAX_FONT_SIZE) {
      newFontSize = MAX_FONT_SIZE;
    } else if (newValue < MIN_FONT_SIZE) {
      newFontSize = MIN_FONT_SIZE;
    } else {
      newFontSize = newValue;
    }
    this.props.onSubmit({...this.state, fontSize: newFontSize});
    this.setState({fontSize: newFontSize});
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.submitOptions();
    }
  }

  handleBlur(event) {
    this.submitOptions();
  }

  submitOptions() {
    const correctedOptions = {
      width: this.state.width === '' || this.state.width < MIN_TEXT_WIDTH ? MIN_TEXT_WIDTH : this.state.width,
      lineCount: this.state.lineCount === '' || this.state.lineCount < MIN_TEXT_LINE_COUNT ? MIN_TEXT_LINE_COUNT : this.state.lineCount,
      fontSize: this.state.fontSize === '' || this.state.fontSize < MIN_FONT_SIZE ? MIN_FONT_SIZE : this.state.fontSize
    };
    if (this.props.options.width !== correctedOptions.width
     || this.props.options.lineCount !== correctedOptions.lineCount
     || this.props.options.fontSize !== correctedOptions.fontSize) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  render() {
    return (
      <div>
        <div>
          {this.props.translate('text-options.text-width') + ' '}
          <Button icon='minus' size='mini' onClick={this.decreaseWidth.bind(this)} />
          <Button icon='plus' size='mini' onClick={this.increaseWidth.bind(this)} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.width}
            onChange={this.handleWidthChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{width: '58px'}}
          />
          {' ' + this.props.translate('text-options.px')}
        </div>
        <div>
          {this.props.translate('text-options.line-count') + ' '}
          <Button disabled icon='minus' size='mini' onClick={this.decreaseLineCount.bind(this)} />
          <Button disabled icon='plus' size='mini' onClick={this.increaseLineCount.bind(this)} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.lineCount}
            onChange={this.handleLineCountChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{width: '58px'}}
          />
          {' ' + this.props.translate('text-options.lines')}
        </div>
        <div>
          {this.props.translate('text-options.font-size') + ' '}
          <Button icon='minus' size='mini' onClick={this.decreaseFontSize.bind(this)} />
          <Button icon='plus' size='mini' onClick={this.increaseFontSize.bind(this)} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.fontSize}
            onChange={this.handleFontSizeChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{width: '42px'}}
          />
          {' ' + this.props.translate('text-options.pt')}
        </div>
      </div>
    );
  }
}

export default TextOptions;
