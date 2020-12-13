import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Grid, Statistic, Transition, Icon, Rating, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { formatMilliseconds } from '../../../shared/utility';
import AchievementUpdates from '../../Achievements/AchievementUpdates';

export class TextExerciseResults extends Component {
  state = {
    scroll: true,
    interestingnessRating: 0,
  };

  componentDidMount() {
    setTimeout(this.scrollAchievements.bind(this), 2000);
  }

  scrollAchievements() {
    if (this.achievementsRef) {
      const currentScrollTop = this.achievementsRef.scrollTop;
      this.achievementsRef.scrollTop = currentScrollTop + 1;
      if (currentScrollTop === this.achievementsRef.scrollTop) {
        this.setState({ scroll: false });
        return;
      }
    }
    if (this.state.scroll) {
      setTimeout(this.scrollAchievements.bind(this), 50);
    }
  }

  onRateHandler = (event, data) => {
    this.setState({
      interestingnessRating: data.rating,
    });
  };

  onEndHandler = () => {
    if (this.state.interestingnessRating) {
      this.props.onRate(this.state.interestingnessRating);
    }
    this.props.onEnd();
  };

  onProceedHandler = () => {
    if (this.state.interestingnessRating) {
      this.props.onRate(this.state.interestingnessRating);
    }
    this.props.onProceed();
  };

  render() {
    return (
      <Modal open={this.props.open} size="tiny">
        <Modal.Header>{this.props.translate('text-exercise-results.modal-header')}</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={5}>
                <Transition animation="tada" duration={3000} transitionOnMount>
                  <Icon name="winner" size="massive" color="yellow" />
                </Transition>
              </Grid.Column>
              <Grid.Column width={11} textAlign="center">
                <Statistic size="small" color="black">
                  <Statistic.Value>{formatMilliseconds(this.props.result.elapsedTime)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.elapsed-time')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="green">
                  <Statistic.Value>{this.props.result.wordsPerMinute}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.words-per-minute')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="blue">
                  <Statistic.Value>{this.props.result.charactersPerSecond}</Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-exercise-results.characters-per-second')}
                  </Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
            <div
              ref={(ref) => {
                this.achievementsRef = ref;
              }}
              onMouseEnter={() => {
                this.setState({ scroll: false });
              }}
              style={{ width: '100%', maxHeight: '190px', overflow: 'auto' }}
            >
              <AchievementUpdates />
            </div>
            {this.props.selectedText.id ? (
              <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }} stretched>
                <Grid.Column width={6} textAlign="right">
                  <span>
                    <b>{this.props.translate('text-exercise-results.rate-text-interestingness')}</b>
                    {` (${this.props.translate('text-exercise-results.optional')})`}
                  </span>
                </Grid.Column>
                <Grid.Column width={10} verticalAlign="middle">
                  <Popup
                    trigger={
                      <Rating
                        icon="star"
                        clearable
                        maxRating={10}
                        rating={this.state.interestingnessRating}
                        onRate={this.onRateHandler}
                      />
                    }
                    position="top center"
                    content={this.props.translate('text-exercise-results.rate-text-interestingness-description')}
                  />
                </Grid.Column>
              </Grid.Row>
            ) : null}
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.onEndHandler} content={this.props.translate('text-exercise-results.end')} />
          <Button positive onClick={this.onProceedHandler}>
            {this.props.translate('text-exercise-results.proceed')}
            <Icon name="chevron right" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  result: state.exercise.result,
  selectedText: state.text.selectedText,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseResults);
