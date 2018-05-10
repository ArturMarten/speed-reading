import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Grid, Icon, Segment, Loader } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import axios from '../../../axios-http';

export class TestAnswers extends Component {
  state = {
    loading: true,
    testQuestionAnswers: [],
  };
  componentDidMount() {
    // console.log(navigator.userAgent, navigator.platform);
    axios.get(`/testQuestionAnswers?testAttemptId=${this.props.testAttemptId}`)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          testQuestionAnswers: response.data,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          testQuestionAnswers: [],
        });
      });
  }
  render() {
    return (
      <Container style={{ marginTop: '3vh', marginBottom: '10vh' }}>
        <Header as="h2">
          {this.props.translate('test-answers.header')}
        </Header>
        {this.state.loading ?
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('test-answers.loading')} />
          </Segment> :
          <Grid verticalAlign="middle">
            {this.state.testQuestionAnswers.map((testQuestionAnswer, testQuestionAnswerIndex) => (
              <Fragment key={testQuestionAnswer.id}>
                <Grid.Row
                  style={{
                    paddingTop: '0.2rem',
                    paddingBottom: '0.2rem',
                    marginTop: '1rem',
                    marginBottom: '0.2rem',
                  }}
                >
                  <Grid.Column width={16}>
                    {`${testQuestionAnswerIndex + 1}. ${testQuestionAnswer.questionText}`}
                  </Grid.Column>
                </Grid.Row>
                {this.state.testQuestionAnswers[testQuestionAnswerIndex].answers.map((answer, answerIndex) => {
                  let color = null;
                  if (testQuestionAnswer.answerId !== null && testQuestionAnswer.answerId === answer.id) {
                    if (answer.correct) {
                      color = 'rgb(217, 234, 211)';
                    } else {
                      color = 'rgb(244, 204, 204)';
                    }
                  }
                  return (
                    <Grid.Row
                      key={answer.id}
                      style={{
                        paddingTop: '0',
                        paddingBottom: '0',
                        marginTop: '0.2rem',
                        marginBottom: '0.2rem',
                        minHeight: '2rem',
                        background: color,
                      }}
                    >
                      <Grid.Column mobile={1} tablet={1} computer={1} textAlign="center">
                        {answer.correct ?
                          <Icon
                            fitted
                            name="check"
                            size="large"
                            color={answer.correct ? 'green' : 'grey'}
                          /> : null}
                      </Grid.Column>
                      <Grid.Column mobile={10} tablet={13} computer={15}>
                        {`${String.fromCharCode(65 + answerIndex)} ) ${answer.answerText}`}
                      </Grid.Column>
                    </Grid.Row>);
                })}
              </Fragment>
            ))}
          </Grid>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TestAnswers);
