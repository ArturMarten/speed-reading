import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Grid, Pagination, List } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';

const dummyData = [
  { id: 1, questionText: 'Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja............ning läbi aastasadade on seda olnud enam kui küllalt.', answers: [{ id: 1, answerText: 'passiivsus' }, { id: 2, answerText: 'vägivaldsus' }, { id: 3, answerText: 'agressiivsus' }, { id: 4, answerText: 'sõjakus' }] },
  { id: 2, questionText: 'Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna........', answers: [{ id: 1, answerText: 'esmaõiguslikkus' }, { id: 2, answerText: 'patriaarhia' }, { id: 3, answerText: 'matriarhaat' }, { id: 4, answerText: 'sugulusjärgus' }] },
  { id: 3, questionText: 'Mosuode ühiskonnas on oluline erinevus, mis teistes ühiskondades on olemas ning,  mis teeb neid unikaalseks', answers: [{ id: 1, answerText: 'neil on kombeks n-ö visiitabielu, naine otsustab, millise mehe ta ööseks enda juurde lubab' }, { id: 2, answerText: 'nad ei tunne sõdu, vägistamisi ega mõrvu' }, { id: 3, answerText: 'isad on need, kes kasvatavad lapsi, samas kui naised teevad tööd' }, { id: 4, answerText: 'kummalgi partneril pole abikaasa kohustusi, kuid nad jagavad majapidamist ja lapsi' }] },
  { id: 4, questionText: 'Mis on meeste suurim kohustus mosuode hõmus?', answers: [{ id: 1, answerText: 'toetada naisi majanduslikult' }, { id: 2, answerText: 'hoolitseda laste eest' }, { id: 3, answerText: 'oma öistel "visiitidel" edukalt hakkama saamine' }, { id: 4, answerText: 'pere valitsemine' }] },
  { id: 5, questionText: 'Millel põhinevad muoso hõimu inimeste vahelised suhted?', answers: [{ id: 1, answerText: 'armastusel' }, { id: 2, answerText: 'poliitikal' }, { id: 3, answerText: 'majanduslikul heaolul' }, { id: 4, answerText: 'sotsiaalsel survel' }] },
];

export class TextExerciseTest extends Component {
  state = {
    selectedQuestion: dummyData[0],
    answers: [],
    loading: false,
  };

  componentDidMount() {
    this.props.onTestPrepare();
  }

  onQuestionChange = (event, data) => {
    this.setState({ selectedQuestion: dummyData[data.activePage - 1] });
  }

  onAnswerChange = (questionId, answerId) => {
    const updatedAnswers = this.state.answers.slice();
    updatedAnswers[questionId - 1] = answerId;
    this.setState({ answers: updatedAnswers });
  }

  onTestStartHandler = () => {
    this.props.onTestStart();
  }

  onTestFinishHandler = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.onTestFinish();
    }, 1500);
  }

  render() {
    const answers = this.state.selectedQuestion.answers.map(answer => (
      <List.Item
        key={answer.id}
        active={this.state.answers[this.state.selectedQuestion.id - 1] === answer.id}
        onClick={() => this.onAnswerChange(this.state.selectedQuestion.id, answer.id)}
      >
        <List.Content>
          <List.Description>
            {answer.answerText}
          </List.Description>
        </List.Content>
      </List.Item>
    ));

    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2" content={this.props.translate('text-exercise-test.title')} />
        <p>{this.props.translate('text-exercise-test.description')}</p>
        {this.props.started ?
          <Grid>
            <Grid.Row centered>
              <Header as="h4" content={this.state.selectedQuestion.questionText} />
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column mobile={16} computer={12}>
                <List selection ordered animated verticalAlign="middle" color="blue">
                  {answers}
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Pagination
                ariaLabel="Questions"
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                nextItem={{
                  ariaLabel: this.props.translate('text-exercise-test.next-question'),
                  content: this.props.translate('text-exercise-test.next-question'),
                }}
                prevItem={{
                  ariaLabel: this.props.translate('text-exercise-test.previous-question'),
                  content: this.props.translate('text-exercise-test.previous-question'),
                }}
                boundaryRange={1}
                siblingRange={1}
                ellipsisItem="..."
                onPageChange={this.onQuestionChange}
                totalPages={dummyData.length}
              />
            </Grid.Row>
          </Grid> : null}
        {this.props.started ?
          <Button
            negative
            onClick={this.onTestFinishHandler}
            loading={this.state.loading}
            floated="right"
            disabled={this.props.finished}
          >{this.props.translate('text-exercise-test.finish-test')}
          </Button> :
          <Button
            positive
            onClick={this.onTestStartHandler}
            floated="right"
          >{this.props.translate('text-exercise-test.start-test')}
          </Button>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  started: state.test.started,
  finished: state.test.finished,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onTestPrepare: () => {
    dispatch(actionCreators.prepareTest());
  },
  onTestStart: () => {
    dispatch(actionCreators.startTest());
  },
  onTestFinish: () => {
    dispatch(actionCreators.finishTest());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseTest);
