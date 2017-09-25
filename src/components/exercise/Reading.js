import React, {Component} from 'react';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import ExerciseOptionsContainer from '../../containers/ExerciseOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;
const START_DELAY = 300;
const LINE_BREAK_DELAY = 300;

let update = null;

const initialState = {
  line: 0,
  lines: [],
  linePosition: 0,
  characterWidth: 0,
  lineLength: 0,
  lineBreak: false,
  end: false
};

class Reading extends Component {
  constructor(props) {
    super(props);
    this.cursorState = {...initialState};
  }

  componentWillMount() {
    this.props.onExerciseSelect('reading');
  }

  componentDidMount() {
    this.renderText();
    this.renderCanvas();
  }

  componentDidUpdate(previous) {
    if (!previous.started && this.props.started) {
      // Exercise started
      update = setTimeout(() => this.nextCharacter(), START_DELAY);
    } else if(!previous.resetted && this.props.resetted) {
      // Exercise resetted
      clearTimeout(update);
      this.cursorState = {...initialState};
      this.renderText();
      this.renderCanvas();
    } else if (previous.started && !this.props.started) {
      // Exercise stopped
      clearTimeout(update);
    } else {
      // Text/exercise options or text changed
      this.renderText();
      this.renderCanvas();
    }
  }

  renderCanvas() {
    const canvas = this.refs.shownCanvas;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.refs.baseCanvas, 0, 0);
    ctx.fillStyle='rgba(0, 255, 0, 0.9)';
    ctx.fillRect(this.cursorState.linePosition - 2, this.cursorState.line * 30 + 22, this.cursorState.characterWidth + 2, 3);
  }

  nextCharacter() {
    if(!this.cursorState.end) {
      this.cursorState.linePosition = this.cursorState.linePosition + this.cursorState.characterWidth;
      if (this.cursorState.lineLength - this.cursorState.linePosition <= 1) {
        // New line
        if (this.cursorState.lines[this.cursorState.line + 1]) {
          this.cursorState.linePosition = 0;
          this.cursorState.line = this.cursorState.line + 1;
          this.cursorState.lineLength = this.refs.baseCanvas.getContext('2d').measureText(this.cursorState.lines[this.cursorState.line]).width;        
          this.cursorState.characterWidth = (this.cursorState.lineLength/this.cursorState.lines[this.cursorState.line].length) * 1;
          this.cursorState.lineBreak = true;
          this.renderCanvas();
          update = setTimeout(() => this.nextCharacter(), LINE_BREAK_DELAY);
        } else {
          this.cursorState.end = true;
          this.renderCanvas();
          console.log('Text end reached!');
        }
      } else {
        if (this.cursorState.lineBreak) {
          this.renderCanvas();
          update = setTimeout(() => this.nextCharacter(), this.updateInterval);
          this.cursorState.lineBreak = false;
        } else {
          this.renderCanvas();
          update = setTimeout(() => this.nextCharacter(), this.updateInterval);
        }
      }
    }
  }

  renderText() {
    const canvas = this.refs.baseCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxWidth = this.props.width;
    const lineHeight = 30;
    const x = (canvas.width - maxWidth) / 2;
    const y = 20;
    ctx.font = this.props.fontSize + 'pt Calibri';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.wrapText(ctx, this.props.text, x, y, maxWidth, lineHeight);
    if (this.cursorState.lines[this.cursorState.line]) {
      this.cursorState.lineLength = ctx.measureText(this.cursorState.lines[this.cursorState.line]).width;
      this.cursorState.characterWidth = (this.cursorState.lineLength/this.cursorState.lines[this.cursorState.line].length) * 1;
    }
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    this.cursorState.lines = [];
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.cursorState.lines.push(line);
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    this.cursorState.lines.push(line);
    context.fillText(line, x, y);
    // calculate update interval from wpm
    const timeInSeconds = (words.length/this.props.wpm)*60;
    this.updateInterval = (timeInSeconds/text.split('').length)*1000;
  }

  render() {
    return(
      <div className='reading'>
        <TextOptionsContainer />
        <ExerciseOptionsContainer />
        <TimingContainer />
        <div className='text' style={{padding: TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px ' + TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px'}}>
          <canvas ref='shownCanvas' width={this.props.width} height={450} />
          <canvas ref='baseCanvas' width={this.props.width} height={450} 
            style={{display: 'none'}}
          />
        </div>
      </div>
    );
  }
};

export default Reading;