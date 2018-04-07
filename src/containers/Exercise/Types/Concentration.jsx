import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import './Concentration.css';

const initialState = {
  selectedIndex: 0,
  answers: [],
};

export class Concentration extends Component {
  state = { ...initialState };

  componentDidMount() {
    document.addEventListener('keypress', this.keyPressHandler);
    document.addEventListener('keyup', this.keyUpHandler);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stringPairs !== this.props.stringPairs) {
      this.resetExercise();
    } else if (!prevProps.timerState.resetted && this.props.timerState.resetted) {
      this.resetExercise();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.keyPressHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  resetExercise = () => {
    this.setState({ ...initialState });
  }

  keyPressHandler = (event) => {
    const { keyCode } = event;
    const key = String.fromCharCode(keyCode);
    if (key === '+') {
      this.answerSelectHandler(true)();
    } else if (key === '-') {
      this.answerSelectHandler(false)();
    }
  }

  keyUpHandler = (event) => {
    const { key } = event;
    switch (key) {
      case 'Backspace': {
        this.setState({
          answers: Object.assign(
            [...this.state.answers],
            { [this.state.selectedIndex]: undefined },
            { [this.state.selectedIndex - 1]: undefined },
          ),
          selectedIndex: Math.max(0, this.state.selectedIndex - 1),
        });
        break;
      }
      case 'ArrowUp': {
        this.setState({
          selectedIndex: Math.max(0, this.state.selectedIndex - 1),
        });
        break;
      }
      case 'ArrowDown': {
        this.setState({
          selectedIndex: Math.min(this.state.selectedIndex + 1, this.props.stringPairs.length - 1),
        });
        break;
      }
      case 'ArrowLeft': {
        this.answerSelectHandler(false)();
        break;
      }
      case 'ArrowRight': {
        this.answerSelectHandler(true)();
        break;
      }
      default: {
        break;
      }
    }
  }

  answerSelectHandler = (answer, answerIndex) => () => {
    const index = answerIndex !== undefined ? answerIndex : this.state.selectedIndex;
    const nextIndex = Math.min(Math.max(index + 1, this.state.selectedIndex), this.props.stringPairs.length - 1);
    this.setState({
      answers: Object.assign([...this.state.answers], { [index]: answer }),
      selectedIndex: nextIndex,
    });
  }

  render() {
    return (
      <div className="concentration-grid" style={{ fontFamily: this.props.textOptions.font, fontSize: this.props.textOptions.fontSize }}>
        {this.props.stringPairs.map((row, index) => (
          <div
            key={Math.random()}
            className={`concentration-row ${index === this.state.selectedIndex ? 'selected' : ''}`}
          >
            <div className="concentration-left">{row[0]}</div>
            <div className="concentration-spacing" style={{ width: `${this.props.exerciseOptions.columnSpacing}px` }} />
            <div className="concentration-right">{row[1]}</div>
            <div className="concentration-choices">
              <Button.Group size="tiny">
                <Button
                  compact
                  icon="minus"
                  color={this.state.answers[index] === false ? 'red' : null}
                  onClick={this.answerSelectHandler(false, index)}
                />
                <Button
                  compact
                  icon="plus"
                  color={this.state.answers[index] === true ? 'green' : null}
                  onClick={this.answerSelectHandler(true, index)}
                />
              </Button.Group>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stringPairs: state.exercise.stringPairs,
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Concentration);
