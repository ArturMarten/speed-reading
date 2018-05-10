import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Statistic, Icon, Segment, Grid } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import BarChart from '../../components/Statistics/BarChart';

const initialState = {
  text: '',
};

export class TextAnalysis extends Component {
  state = { ...initialState };

  onRefresh = () => {
    const textData = {
      text: this.state.text,
    };
    this.props.onAnalyzeText(textData);
  }

  setText = (text) => {
    this.setState({ text });
  }

  render() {
    return (
      this.props.open ?
        <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
          <Modal.Header>{this.props.translate('text-analysis.modal-header')}</Modal.Header>
          <Modal.Content>
            <Statistic.Group widths={3} size="small">
              <Statistic>
                <Statistic.Value>
                  {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.characterCount}
                </Statistic.Value>
                <Statistic.Label>
                  {this.props.translate('text-analysis.character-count')}
                </Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.wordCount}
                </Statistic.Value>
                <Statistic.Label>
                  {this.props.translate('text-analysis.word-count')}
                </Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.sentenceCount}
                </Statistic.Value>
                <Statistic.Label>
                  {this.props.translate('text-analysis.sentence-count')}
                </Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Grid verticalAlign="middle">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Statistic.Group size="small" widths={1}>
                    {/* Average word length */}
                    <Statistic size="small">
                      <Statistic.Value>
                        {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.averageWordLength.toFixed(2)}
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('text-analysis.average-word-length')}
                      </Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Grid.Column>
                <Grid.Column>
                  {this.props.analyzeStatus.loading ?
                    null :
                    <Segment compact floated="right" clearing>
                      <BarChart
                        title={this.props.translate('text-analysis.word-lengths-distribution')}
                        width={500}
                        height={200}
                        data={this.props.analysis.wordLengths}
                      />
                    </Segment>
                  }
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Statistic.Group widths={2} size="small">
                    {/* Average sentence length in words */}
                    <Statistic size="small">
                      <Statistic.Value>
                        {this.props.analyzeStatus.loading ?
                          <Icon loading name="spinner" /> :
                          this.props.analysis.averageSentenceLengthInWords.toFixed(2)}
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('text-analysis.average-sentence-length')}<br />
                        {this.props.translate('text-analysis.in-words')}<br />
                      </Statistic.Label>
                    </Statistic>
                    {/* Average sentence length in characters */}
                    <Statistic size="small">
                      <Statistic.Value>
                        {this.props.analyzeStatus.loading ?
                          <Icon loading name="spinner" /> :
                          this.props.analysis.averageSentenceLengthInCharacters.toFixed(2)
                        }
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('text-analysis.average-sentence-length')}<br />
                        {this.props.translate('text-analysis.in-characters')}<br />
                      </Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Grid.Column>
                <Grid.Column>
                  {this.props.analyzeStatus.loading ?
                    null :
                    <Segment compact floated="right" clearing>
                      <BarChart
                        title={this.props.translate('text-analysis.sentence-lengths-distribution')}
                        width={500}
                        height={200}
                        data={this.props.analysis.sentenceLengthsInWords}
                      />
                    </Segment>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              type="button"
              loading={this.props.analyzeStatus.loading}
              onClick={this.onRefresh}
              disabled={this.props.analyzeStatus.loading}
            >
              {this.props.translate('text-analysis.refresh')}
            </Button>
          </Modal.Actions>
        </Modal> : null
    );
  }
}

const mapStateToProps = state => ({
  selectedText: state.text.selectedText,
  analyzeStatus: state.text.analyzeStatus,
  analysis: state.text.analysis,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAnalyzeText: (textData) => {
    dispatch(actionCreators.analyzeText(textData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(TextAnalysis);
