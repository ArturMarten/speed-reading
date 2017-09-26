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
  counter: 0,
  line: 0,
  lines: [],
  linePosition: 0,
  characterWidth: 0,
  lineLength: 0,
  lineBreak: false,
  end: false
};

class OneGroupVisible extends Component {
  constructor(props) {
    super(props);
    this.cursorState = {...initialState};
  }

  componentWillMount() {
    this.props.onExerciseSelect('wordGroup');
  }

  componentDidMount() {
    this.renderGroup();
  }

  componentDidUpdate(previous) {
    if (!previous.started && this.props.started) {
      // Exercise started
      update = setTimeout(() => this.nextGroup(), START_DELAY);      
    } else if (!previous.resetted && this.props.resetted) {
      // Exercise resetted
      clearTimeout(update);
      this.cursorState = {...initialState};
      this.renderGroup();
    } else if (previous.started && !this.props.started) {
      // Exercise stopped
      clearTimeout(update);
    } else {
      // Text/exercise options or text changed
      this.renderGroup();
    }
  }

  componentWillUnmount() {
    if (update) clearTimeout(update);
  }

  renderGroup() {
    const canvas = this.refs.shownCanvas;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = this.props.fontSize + 'pt Calibri';
    const lineHeight = 30;
    context.fillText(this.props.wordGroups[this.cursorState.counter], this.cursorState.linePosition, lineHeight * this.cursorState.line + 20);
  }

  nextGroup() {
    // Calculate next word group new line position
    const canvas = this.refs.shownCanvas;
    let context = canvas.getContext('2d');
    let maxWidth = canvas.width;
    const previousWordGroupWidth = context.measureText(this.wordGroup).width;
    this.cursorState.linePosition = this.cursorState.linePosition + previousWordGroupWidth;
    if (this.props.wordGroups[this.cursorState.counter + 1]) {
      this.cursorState.counter = this.cursorState.counter + 1;
      this.wordGroup = this.props.wordGroups[this.cursorState.counter];
      const nextWordGroupWidth = context.measureText(this.wordGroup).width;
      if ((this.cursorState.linePosition + nextWordGroupWidth) > maxWidth) {
        this.cursorState.line = this.cursorState.line + 1;
        this.cursorState.linePosition = 0;
        this.renderGroup();
        update = setTimeout(() => this.nextGroup(), LINE_BREAK_DELAY);
      } else {
        this.renderGroup();
        update = setTimeout(() => this.nextGroup(), this.props.fixation);
      }
    }
  }

  render() {
    return(
      <div className='one-group'>
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

export default OneGroupVisible;