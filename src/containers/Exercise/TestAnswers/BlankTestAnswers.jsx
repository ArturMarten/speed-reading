import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Grid } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

export class BlankTestAnswers extends Component {
  state = {};
  render() {
    return (
      <Container style={{ marginTop: '3vh', marginBottom: '10vh' }}>
        <Header as="h2">
          {this.props.translate('blank-test-answers.header')}
        </Header>
        <Grid verticalAlign="middle">
          {this.props.blankExercises.map((blankExercise, blankExerciseIndex) => (
            <Fragment key={blankExercise.id}>
              <Grid.Row
                style={{
                  paddingTop: '0.2rem',
                  paddingBottom: '0.2rem',
                  marginTop: '1rem',
                  marginBottom: '0.2rem',
                }}
                columns={1}
              >
                <Grid.Column>
                  <Header as="h3">
                    {`${blankExerciseIndex + 1}. ${blankExercise.text[0]} `}
                    {this.props.answers[blankExerciseIndex] &&
                    this.props.answers[blankExerciseIndex].toLowerCase() !== blankExercise.answer.toLowerCase() ?
                      <span>
                        <span style={{ color: 'rgb(204, 0, 0)', textDecoration: 'line-through' }}>
                          {`${this.props.answers[blankExerciseIndex]}`}
                        </span>
                        {' '}
                      </span> : null}
                    <span style={{ color: 'rgb(106, 168, 79)' }}>
                      {blankExercise.answer}
                    </span>
                    {` ${blankExercise.text[2]}`}
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Fragment>
          ))}
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  blankExercises: state.test.blankExercises,
  answers: state.test.answers,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BlankTestAnswers);
