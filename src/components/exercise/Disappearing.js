import React, {Component} from 'react';
import {Container, Grid, Segment} from 'semantic-ui-react';

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

class Disappearing extends Component {
  constructor(props) {
    super(props);
    this.cursorState = {...initialState};
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.props.width;
    this.offscreenCanvas.height = 400;
  }

  componentWillMount() {
    this.props.onExerciseSelect('disappearing');
  }

  componentDidMount() {
    this.renderText();
    this.refs.shownCanvas.getContext('2d').drawImage(this.offscreenCanvas, 0, 0);
  }

  componentDidUpdate(previous) {
    if (!previous.started && this.props.started) {
      // Exercise started
      update = setTimeout(() => this.nextCharacter(), START_DELAY);
    } else if (!previous.resetted && this.props.resetted) {
      // Exercise resetted
      clearTimeout(update);
      this.cursorState = {...initialState};
      this.renderText();
      const canvas = this.refs.shownCanvas;
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.refs.shownCanvas.getContext('2d').drawImage(this.offscreenCanvas, 0, 0);
    } else if (previous.started && !this.props.started) {
      // Exercise stopped
      clearTimeout(update);
    } else {
      // Text/exercise options or text changed
      this.renderText();
    }
  }

  componentWillUnmount() {
    if (update) clearTimeout(update);
  }

  renderCanvas() {
    const canvas = this.refs.shownCanvas;
    let context = canvas.getContext('2d');
    context.fillStyle='rgba(0, 255, 0, 0.9)';
    context.clearRect(this.cursorState.linePosition - 2, this.cursorState.line * 30, this.cursorState.characterWidth + 2, 30);
  }

  nextCharacter() {
    this.renderCanvas();
    if(!this.cursorState.end) {
      this.cursorState.linePosition = this.cursorState.linePosition + this.cursorState.characterWidth;
      if (this.cursorState.lineLength - this.cursorState.linePosition <= 1) {
        // New line
        if (this.cursorState.lines[this.cursorState.line + 1]) {
          this.cursorState.linePosition = 0;
          this.cursorState.line = this.cursorState.line + 1;
          this.cursorState.lineLength = this.offscreenCanvas.getContext('2d').measureText(this.cursorState.lines[this.cursorState.line]).width;
          this.cursorState.characterWidth = (this.cursorState.lineLength/this.cursorState.lines[this.cursorState.line].length) * 1;
          this.cursorState.lineBreak = true;
          update = setTimeout(() => this.nextCharacter(), LINE_BREAK_DELAY);
        } else {
          this.cursorState.end = true;
          console.log('Text end reached!');
        }
      } else {
        if (this.cursorState.lineBreak) {
          update = setTimeout(() => this.nextCharacter(), this.updateInterval);
          this.cursorState.lineBreak = false;
        } else {
          update = setTimeout(() => this.nextCharacter(), this.updateInterval);
        }
      }
    }
  }

  renderText() {
    const context = this.offscreenCanvas.getContext('2d');
    const maxWidth = this.props.width;
    const lineHeight = 30;
    const x = (this.offscreenCanvas.width - maxWidth) / 2;
    const y = 20;
    context.font = this.props.fontSize + 'pt Calibri';
    context.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    this.wrapText(context, this.props.text, x, y, maxWidth, lineHeight);
    if (this.cursorState.lines[this.cursorState.line]) {
      this.cursorState.lineLength = context.measureText(this.cursorState.lines[this.cursorState.line]).width;
      this.cursorState.characterWidth = (this.cursorState.lineLength/this.cursorState.lines[this.cursorState.line].length) * 1;
    }
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    this.cursorState.lines = [];
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.cursorState.lines.push(line);
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
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
        <Container style={{marginTop: '14px'}}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width={12}>
                <TextOptionsContainer />
                <ExerciseOptionsContainer />
              </Grid.Column>
              <Grid.Column textAlign='center' width={4}>
                <TimingContainer />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Segment compact>
                <div className='text' style={{padding: TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px ' +
                                                       TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px'}}>
                  <canvas ref='shownCanvas' width={this.props.width} height={450} />
                </div>
              </Segment>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Disappearing;
