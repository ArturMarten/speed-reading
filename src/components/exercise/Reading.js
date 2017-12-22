import React, {Component} from 'react';
import {Container, Grid, Segment} from 'semantic-ui-react';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import ExerciseOptionsContainer from '../../containers/ExerciseOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;
const START_DELAY = 400;
const LINE_BREAK_DELAY = 400;

let update = null;

const initialState = {
  pageNumber: 0,
  lineNumber: 0,
  lines: [],
  linePosition: 0,
  lineLengthInPixels: 0,
  characterWidth: 0,
  lineHeight: 30,
  lineBreak: false,
  pageBreak: false,
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
    } else if (!previous.resetted && this.props.resetted) {
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

  componentWillUnmount() {
    if (update) clearTimeout(update);
  }

  renderCanvas() {
    const canvas = this.refs.shownCanvas;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this.refs.baseCanvas, 0, 0);
    context.fillStyle='rgba(0, 255, 0, 0.9)';
    context.fillRect(
      (this.cursorState.linePosition * this.cursorState.characterWidth) - 2,
      this.cursorState.lineNumber * 30 + 22, this.cursorState.characterWidth + 2, 3
    );
  }

  nextCharacter() {
    if(!this.cursorState.end) {
      this.cursorState.linePosition = this.cursorState.linePosition + 1;
      if (this.cursorState.lineLengthInPixels - (this.cursorState.characterWidth * this.cursorState.linePosition) <= 1) {
        if (this.cursorState.lineNumber + 1 > this.props.lineCount) {
          this.cursorState.pageNumber = this.cursorState.pageNumber + 1;
          this.cursorState.linePosition = 0;
          this.cursorState.lineNumber = 0;
          this.pageBreak = true;
          console.log('Page break!');
        } else if (this.cursorState.lines[this.cursorState.lineNumber + 1]) {
          // New line
          this.cursorState.lineBreak = true;
          this.cursorState.linePosition = 0;
          this.cursorState.lineNumber = this.cursorState.lineNumber + 1;
          this.calculatePixelsLengths(this.refs.baseCanvas.getContext('2d'));
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
    let context = canvas.getContext('2d');
    const maxWidth = this.props.width;
    context.textBaseline = 'top';
    context.font = this.props.fontSize + 'pt Calibri';
    context.clearRect(0, 0, canvas.width, canvas.height);
    const words = this.props.text.split(' ');
    this.cursorState.lines = this.calculateWordLines(context, words, maxWidth);
    this.drawLines(context, this.cursorState.lines, this.cursorState.pageNumber, this.props.lineCount, this.cursorState.lineHeight);
    // calculate update interval from wpm
    const timeInSeconds = (words.length/this.props.wpm) * 60;
    this.updateInterval = (timeInSeconds/this.props.text.length) * 1000;
    if (this.cursorState.lines[this.cursorState.lineNumber]) {
      this.calculatePixelsLengths(context);
    }
  }

  calculateWordLines(context, words, maxWidth) {
    let line = '';
    let lines = [];
    words.forEach((word) => {
      const testLine = line + word + ' ';
      const testWidth = context.measureText(testLine).width;
      if (testWidth > maxWidth) {
        // New line
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    return lines;
  }

  drawLines(context, lines, pageNumber, maxLines, lineHeight) {
    const x = 0;
    let y = 0;
    const startIndex = pageNumber * maxLines;
    const endIndex = Math.min(lines.length, (pageNumber + 1) * maxLines);
    for (let i = startIndex; i < endIndex; i++) {
      context.fillText(lines[i], x, y);
      y += lineHeight;
    }
  }

  calculatePixelsLengths(context) {
    this.cursorState.lineLengthInPixels = context.measureText(this.cursorState.lines[this.cursorState.lineNumber]).width;
    this.cursorState.characterWidth = (this.cursorState.lineLengthInPixels/this.cursorState.lines[this.cursorState.lineNumber].length) * 1;
  }
  /*
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
        console.log(this.cursorState.lines.length);
        console.log(this.props.lineCount);
        if (this.cursorState.lines.length >= this.props.lineCount) {
          console.log('Page break');
        } else {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
      }
      else {
        line = testLine;
      }
    }
    this.cursorState.lines.push(line);
    context.fillText(line, x, y);
  }
  */
  render() {
    return(
      <div>
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
                <div style={{padding: TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px ' +
                                      TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px'}}>
                  <canvas ref='shownCanvas' width={this.props.width} height={this.props.lineCount * this.cursorState.lineHeight} />
                  <canvas ref='baseCanvas' width={this.props.width} height={this.props.lineCount * this.cursorState.lineHeight}
                    style={{display: 'none'}}
                  />
                  <div>Page {this.cursorState.pageNumber + 1} of {Math.ceil(this.cursorState.lines.length/this.props.lineCount)}</div>
                </div>
              </Segment>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Reading;
