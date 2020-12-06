import { ContentState, convertFromHTML } from 'draft-js';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Button, Grid, Icon, Segment } from 'semantic-ui-react';
import { splitIntoWordGroups } from '../../../utils/TextUtils';
import { Disappearing } from '../Types/Disappearing/Disappearing';
import { ReadingAid } from '../Types/ReadingAid/ReadingAid';
import { ReadingTest } from '../Types/ReadingTest/ReadingTest';
import { Scrolling } from '../Types/Scrolling/Scrolling';
import { WordGroups } from '../Types/WordGroups/WordGroups';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

const CANVAS_HEIGHT = 400;

const blocksFromHTML = convertFromHTML(
  '<p><b>Lorem ipsum dolor sit amet</b></p><p>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc pulvinar sapien et ligula ullamcorper malesuada. Mauris cursus mattis molestie a iaculis at erat. Purus gravida quis blandit turpis cursus in hac. Placerat orci nulla pellentesque dignissim enim. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Lacus luctus accumsan tortor posuere. Ut sem nulla pharetra diam. Quisque egestas diam in arcu cursus euismod. Vitae semper quis lectus nulla at volutpat diam.</p><p>Lacus vel facilisis volutpat est velit egestas dui id ornare. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Nunc id cursus metus aliquam eleifend mi. A diam maecenas sed enim ut. Est lorem ipsum dolor sit amet consectetur.</p>',
);
const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

const selectedText = {
  characterCount: 801,
  wordCount: 122,
  sentenceCount: 15,
  contentState,
};

let wordGroups = splitIntoWordGroups(contentState.getPlainText(''), 15);

const initialTimerState = {
  started: false,
  paused: false,
  resetted: false,
  stopped: false,
};

export class TextExercisePreview extends Component {
  state = {
    show: false,
    timerState: initialTimerState,
    restarting: false,
  };

  componentDidMount() {
    wordGroups = splitIntoWordGroups(contentState.getPlainText(''), this.props.exerciseOptions.groupCharacterCount);
    this.startExercise();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.textOptions !== this.props.textOptions ||
      prevProps.exerciseOptions !== this.props.exerciseOptions ||
      prevProps.modification !== this.props.modification
    ) {
      if (prevProps.exerciseOptions.groupCharacterCount !== this.props.groupCharacterCount) {
        wordGroups = splitIntoWordGroups(contentState.getPlainText(''), this.props.exerciseOptions.groupCharacterCount);
      }
      this.restart();
    } else if (!prevState.restarting && this.state.restarting) {
      this.resetExercise();
    } else if (!this.state.timerState.started) {
      this.startExercise();
    }
  }

  toggleClickHandler = () => {
    this.setState({ show: !this.state.show, restarting: !this.state.show });
  };

  restart = () => {
    this.setState({ restarting: true });
  };

  startExercise = () => {
    this.setState({ timerState: { ...this.state.timerState, started: true } });
  };

  resetExercise = () => {
    this.setState({ timerState: initialTimerState, restarting: false });
  };

  render() {
    const canvasWidth = Math.min(this.props.textOptions.width, window.innerWidth - 30);
    const exercise = ((type) => {
      switch (type) {
        case 'readingTest':
          return (
            <ReadingTest
              canvasHeight={CANVAS_HEIGHT - 40}
              canvasWidth={canvasWidth}
              selectedText={selectedText}
              textOptions={this.props.textOptions}
              translate={this.props.translate}
            />
          );
        case 'readingAid':
          return (
            <ReadingAid
              canvasHeight={CANVAS_HEIGHT}
              canvasWidth={canvasWidth}
              selectedText={selectedText}
              timerState={this.state.timerState}
              onExerciseFinish={this.restart}
              textOptions={this.props.textOptions}
              exerciseOptions={this.props.exerciseOptions}
              speedOptions={this.props.speedOptions}
              translate={this.props.translate}
            />
          );
        case 'scrolling':
          return (
            <Scrolling
              selectedText={selectedText}
              canvasWidth={canvasWidth}
              timerState={this.state.timerState}
              onExerciseFinish={this.restart}
              textOptions={this.props.textOptions}
              exerciseOptions={this.props.exerciseOptions}
              speedOptions={this.props.speedOptions}
            />
          );
        case 'disappearing':
          return (
            <Disappearing
              canvasHeight={CANVAS_HEIGHT}
              canvasWidth={canvasWidth}
              selectedText={selectedText}
              timerState={this.state.timerState}
              onExerciseFinish={this.restart}
              textOptions={this.props.textOptions}
              exerciseOptions={this.props.exerciseOptions}
              speedOptions={this.props.speedOptions}
              translate={this.props.translate}
            />
          );
        case 'wordGroups':
          return (
            <WordGroups
              canvasHeight={CANVAS_HEIGHT}
              canvasWidth={canvasWidth}
              modification={this.props.modification}
              selectedText={selectedText}
              wordGroups={wordGroups}
              timerState={this.state.timerState}
              onExerciseFinish={this.restart}
              textOptions={this.props.textOptions}
              exerciseOptions={this.props.exerciseOptions}
              speedOptions={this.props.speedOptions}
            />
          );
        default:
          return (
            <ReadingTest
              canvasHeight={CANVAS_HEIGHT - 40}
              canvasWidth={canvasWidth}
              selectedText={selectedText}
              textOptions={this.props.textOptions}
              translate={this.props.translate}
            />
          );
      }
    })(this.props.exerciseType);
    return (
      <Grid container centered>
        <Grid.Row style={{ paddingBottom: 0 }}>
          <Button basic fluid compact onClick={this.toggleClickHandler}>
            <Icon name={this.state.show ? 'chevron up' : 'chevron down'} style={{ opacity: 1 }} />
            {this.state.show
              ? this.props.translate('text-exercise-preview.hide')
              : this.props.translate('text-exercise-preview.show')}
          </Button>
        </Grid.Row>
        <Grid.Row style={{ marginBottom: '1em' }}>
          {this.state.show ? (
            <Segment compact>
              <div
                style={{
                  padding: `${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px ${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px`,
                }}
              >
                {!this.state.restarting ? exercise : null}
              </div>
            </Segment>
          ) : null}
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  modification: state.exercise.modification,
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  speedOptions: state.options.speedOptions,
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps, null)(TextExercisePreview);
