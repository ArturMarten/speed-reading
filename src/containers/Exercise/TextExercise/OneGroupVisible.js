import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../../../store/actions';

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

export class OneGroupVisible extends Component {
  constructor(props) {
    super(props);
    this.cursorState = {...initialState};
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
      // Exercise paused
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
    const canvas = this.shownCanvas;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = this.props.fontSize + 'pt Calibri';
    const lineHeight = 30;
    context.fillText(this.props.wordGroups[this.cursorState.counter], this.cursorState.linePosition, lineHeight * this.cursorState.line + 20);
  }

  nextGroup() {
    // Calculate next word group new line position
    const canvas = this.shownCanvas;
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
    return (
      <canvas ref={(ref) => this.shownCanvas = ref } width={this.props.width} height={450} />
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.exercise.text,
  wordGroups: state.exercise.wordGroups,
  width: state.exercise.textOptions.width,
  fontSize: state.exercise.textOptions.fontSize,
  fixation: state.exercise.exerciseOptions.fixation,
  started: state.exercise.started,
  resetted: state.exercise.resetted
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.exerciseSelected(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OneGroupVisible);
