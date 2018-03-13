import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input, Grid, Label, Select, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

const dummyData = [
  { id: 1, questionText: 'Mehelikku energiat iseloomustavad ego, sõjad, võistlemine ja............ning läbi aastasadade on seda olnud enam kui küllalt.', answers: [{ id: 1, answerText: 'passiivsus' }, { id: 2, answerText: 'vägivaldsus' }, { id: 3, answerText: 'agressiivsus' }, { id: 4, answerText: 'sõjakus' }] },
  { id: 2, questionText: 'Nende kogukonna organiseeritust on lääne definitsioonide abil keeruline selgitada, kuid kõige enam kasutatakse selle kirjeldamisel sõna........', answers: [{ id: 1, answerText: 'esmaõiguslikkus' }, { id: 2, answerText: 'patriaarhia' }, { id: 3, answerText: 'matriarhaat' }, { id: 4, answerText: 'sugulusjärgus' }] },
  { id: 3, questionText: 'Mosuode ühiskonnas on oluline erinevus, mis teistes ühiskondades on olemas ning,  mis teeb neid unikaalseks', answers: [{ id: 1, answerText: 'neil on kombeks n-ö visiitabielu, naine otsustab, millise mehe ta ööseks enda juurde lubab' }, { id: 2, answerText: 'nad ei tunne sõdu, vägistamisi ega mõrvu' }, { id: 3, answerText: 'isad on need, kes kasvatavad lapsi, samas kui naised teevad tööd' }, { id: 4, answerText: 'kummalgi partneril pole abikaasa kohustusi, kuid nad jagavad majapidamist ja lapsi' }] },
  { id: 4, questionText: 'Mis on meeste suurim kohustus mosuode hõmus?', answers: [{ id: 1, answerText: 'toetada naisi majanduslikult' }, { id: 2, answerText: 'hoolitseda laste eest' }, { id: 3, answerText: 'oma öistel "visiitidel" edukalt hakkama saamine' }, { id: 4, answerText: 'pere valitsemine' }] },
  { id: 5, questionText: 'Millel põhinevad muoso hõimu inimeste vahelised suhted?', answers: [{ id: 1, answerText: 'armastusel' }, { id: 2, answerText: 'poliitikal' }, { id: 3, answerText: 'majanduslikul heaolul' }, { id: 4, answerText: 'sotsiaalsel survel' }] },
];

const questionOptions = [
  { key: 'question', text: 'Question', value: 'question' },
  { key: 'blank', text: 'Blank', value: 'blank' },
];

export class TextTestEditor extends Component {
  state = {}

  onSubmit = () => {
    this.props.onClose();
  }

  render() {
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('text-test-editor.modal-header')}</Modal.Header>
        <Modal.Content>
          <Grid>
            {dummyData.map((question, questionIndex) => (
              <Grid.Row key={question.id}>
                <Grid.Column>
                  <Input
                    fluid
                    value={question.questionText}
                    labelPosition="left"
                    action
                  >
                    <Label>{`${questionIndex + 1} `}</Label>
                    <input />
                    <Select
                      compact
                      options={questionOptions}
                      defaultValue="question"
                    />
                    <Button
                      primary
                      compact
                      content="Change"
                    />
                    <Button
                      negative
                      compact
                      icon="close"
                    />
                  </Input>
                  {dummyData[questionIndex].answers.map((answer, answerIndex) => (
                    <Grid.Row key={answer.id} style={{ padding: '1vh 0 0 5vh' }}>
                      <Grid.Column>
                        <Input
                          fluid
                          labelPosition="left"
                          value={answer.answerText}
                          action
                        >
                          <Label>{`${answerIndex + 1} `}</Label>
                          <Button
                            compact
                            icon={<Icon fitted name="check" color="green" />}
                          />
                          <input />
                          <Button
                            primary
                            compact
                            content="Change"
                          />
                          <Button
                            negative
                            compact
                            icon="close"
                          />
                        </Input>
                      </Grid.Column>
                    </Grid.Row>
                  ))}
                  <Grid.Row style={{ padding: '1vh 0 0 5vh' }}>
                    <Grid.Column>
                      <Input
                        fluid
                        labelPosition="left"
                        value=""
                        action
                        placeholder="Insert new answer here..."
                      >
                        <Label>{`${dummyData[questionIndex].answers.length + 1} `}</Label>
                        <input />
                        <Button
                          positive
                          compact
                          content="Add answer"
                        />
                      </Input>
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
            ))}
            <Grid.Row>
              <Grid.Column>
                <Input
                  fluid
                  labelPosition="left"
                  value=""
                  action
                  placeholder="Insert new question here..."
                >
                  <Label>{`${dummyData.length + 1} `}</Label>
                  <input />
                  <Button
                    positive
                    compact
                    content="Add question"
                  />
                </Input>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            type="button"
            onClick={this.onSubmit}
          >
            {this.props.translate('text-test-editor.ok')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextTestEditor);
