import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Statistic, Icon, Segment, Header } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import BarChart from '../../components/Statistics/BarChart';
import PieChart from '../../components/Statistics/PieChart';
import LabeledSlider from '../../components/LabeledSlider/LabeledSlider';
import LabeledMultipleSlider from '../../components/LabeledSlider/LabeledMultipleSlider';
import { reduceSumFunc } from '../../shared/utility';

const WORD_LENGTH_COLOR = 'rgb(47, 141, 255)';
const WORD_FREQ_COLOR = 'rgb(247, 94, 37)';
const SENTENCE_LENGTH_COLOR = 'rgb(23, 219, 36)';

const initialState = {
  wordMinLength: 1,
  wordMaxLength: 20,
  currentWordLengths: [1, 20],
  sentenceMinLength: 1,
  sentenceMaxLength: 30,
  currentSentenceLengths: [1, 30],
  currentWordFrequency: [100],
};

export class TextAnalysis extends Component {
  state = { ...initialState, text: '' };

  componentDidUpdate(prevProps) {
    if (prevProps.analysis !== this.props.analysis && this.props.analysis === null) {
      this.setInitialState();
    }
    if (prevProps.analysis !== this.props.analysis && this.props.analysis !== null) {
      this.setInitialLengths(this.props.analysis);
    }
  }

  onRefresh = () => {
    const textData = {
      text: this.state.text,
    };
    this.props.onAnalyzeText(textData);
  }

  onWordLengthChangeHandler = (data) => {
    const currentWordLengths = data.values;
    this.setState({ currentWordLengths });
  }

  onSentenceLengthChangeHandler = (data) => {
    const currentSentenceLengths = data.values;
    this.setState({ currentSentenceLengths });
  }

  onWordFrequencyChangeHandler = (data) => {
    const currentWordFrequency = data.values;
    this.setState({ currentWordFrequency });
  }

  setInitialLengths = (analysis) => {
    const { wordLengths, sentenceLengths } = analysis;
    let {
      wordMinLength,
      wordMaxLength,
      currentWordLengths,
      sentenceMinLength,
      sentenceMaxLength,
      currentSentenceLengths,
    } = this.state;
    if (wordLengths) {
      const lengths = wordLengths.map(data => data.x);
      wordMinLength = Math.min(...lengths);
      wordMaxLength = Math.max(...lengths);
      currentWordLengths = [wordMinLength, wordMaxLength];
    }
    if (sentenceLengths) {
      const lengths = sentenceLengths.map(data => data.x);
      sentenceMinLength = Math.min(...lengths);
      sentenceMaxLength = Math.max(...lengths);
      currentSentenceLengths = [sentenceMinLength, sentenceMaxLength];
    }
    this.setState({
      wordMinLength,
      wordMaxLength,
      currentWordLengths,
      sentenceMinLength,
      sentenceMaxLength,
      currentSentenceLengths,
    });
  }

  setText = (text) => {
    this.setState({ text });
  }

  setInitialState = () => {
    this.setState({ ...initialState });
  }

  formatWordLengthValues = wordPercentage => wordLengths => (
    <div style={{ textAlign: 'center' }}>
      {this.props.translate('text-analysis.words-with-length-from')}
      <span style={{ fontSize: '1.5em' }}>
        {` ${wordLengths[0]} `}
      </span>
      {this.props.translate('text-analysis.to')}
      <span style={{ fontSize: '1.5em' }}>
        {` ${wordLengths[1]} `}
      </span>
      {this.props.translate('text-analysis.characters-make-up')}
      <span style={{ fontSize: '1.5em' }}>
        {` ${wordPercentage.toFixed(1)}% `}
      </span>
      {this.props.translate('text-analysis.of-all-text-words')}
    </div>
  );

  formatWordFrequencyValue = wordFrequencyPercentage => wordFrequency => (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '1.5em' }}>
        {`${wordFrequencyPercentage.toFixed(1)}% `}
      </span>
      {this.props.translate('text-analysis.of-text-words-are-in')}
      <span style={{ fontSize: '1.5em' }}>
        {`TOP ${wordFrequency[0]}% `}
      </span>
      {this.props.translate('text-analysis.of-most-frequent-words')}
    </div>
  );

  formatSentenceLengthValues = sentencePercentage => sentenceLengths => (
    <div style={{ textAlign: 'center' }}>
      {this.props.translate('text-analysis.sentences-with-length-from')}
      <span style={{ fontSize: '1.5em' }}>
        {` ${sentenceLengths[0]} `}
      </span>
      {this.props.translate('text-analysis.to')}
      <span style={{ fontSize: '1.5em' }}>
        {` ${sentenceLengths[1]} `}
      </span>
      {this.props.translate('text-analysis.words-make-up')}
      <span style={{ fontSize: '1.5em' }}>
        {` ${sentencePercentage.toFixed(1)}% `}
      </span>
      {this.props.translate('text-analysis.of-all-text-sentences')}
    </div>
  );

  render() {
    const { currentWordLengths, currentSentenceLengths, currentWordFrequency } = this.state;
    const { analysis } = this.props;
    const wordPercentage = analysis !== null ?
      (analysis.wordLengths
        .filter(data => data.x >= currentWordLengths[0] && data.x <= currentWordLengths[1])
        .map(data => data.y)
        .reduce(reduceSumFunc, 0) / analysis.wordCount) * 100 : 0;

    const wordFrequencyPercentage = analysis !== null ?
      (Math.max(...analysis.wordFrequencyCounts
        .filter(data => data.x <= currentWordFrequency[0])
        .map(data => data.y)) / analysis.wordCount) * 100 : 0;

    const sentencePercentage = analysis !== null ?
      (analysis.sentenceLengths
        .filter(data => data.x >= currentSentenceLengths[0] && data.x <= currentSentenceLengths[1])
        .map(data => data.y)
        .reduce(reduceSumFunc, 0) / analysis.sentenceCount) * 100 : 0;
    return (
      this.props.open ?
        <Modal open={this.props.open} onClose={this.props.onClose} closeIcon>
          <Modal.Header>{this.props.translate('text-analysis.modal-header')}</Modal.Header>
          <Modal.Content>
            <Segment>
              <Header as="h5">{this.props.translate('text-analysis.text-general-data')}</Header>
              <Statistic.Group widths={3} size="small">
                <Statistic>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.characterCount}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.characters')}
                  </Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.wordCount}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.words')}
                  </Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.sentenceCount}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.sentences')}
                  </Statistic.Label>
                </Statistic>
              </Statistic.Group>
            </Segment>
            <Segment>
              <Header as="h5">{this.props.translate('text-analysis.text-word-data')}</Header>
              <Statistic.Group size="small" widths={2}>
                {/* Average word length */}
                <Statistic size="small">
                  <Statistic.Label>
                    {this.props.translate('text-analysis.average-word-length')}
                  </Statistic.Label>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.averageWordLength.toFixed(2)}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.characters')}
                  </Statistic.Label>
                </Statistic>
                <Statistic size="small">
                  <Statistic.Label>
                    {this.props.translate('text-analysis.complexity-rating')}
                  </Statistic.Label>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ?
                      <Icon loading name="spinner" /> :
                      this.props.analysis.wordLengthClassRating
                    }
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.class-rating')}
                  </Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <div style={{ paddingTop: '2em', paddingBottom: '2em' }}>
                <LabeledMultipleSlider
                  snap
                  color={WORD_LENGTH_COLOR}
                  min={this.state.wordMinLength}
                  max={this.state.wordMaxLength}
                  onChange={this.onWordLengthChangeHandler}
                  formatValues={this.formatWordLengthValues(wordPercentage)}
                />
              </div>
              {this.props.analyzeStatus.loading || this.props.analysis === null ?
                null :
                <div style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <BarChart
                    title={this.props.translate('text-analysis.word-lengths-distribution')}
                    xLabel={this.props.translate('text-analysis.word-lengths')}
                    yLabel={this.props.translate('text-analysis.word-count')}
                    fill={WORD_LENGTH_COLOR}
                    width={700}
                    height={250}
                    data={this.props.analysis.wordLengths}
                  />
                </div>
              }
              <div style={{ paddingTop: '2em', paddingBottom: '2em' }}>
                <LabeledSlider
                  snap
                  color={WORD_FREQ_COLOR}
                  min={1}
                  max={100}
                  onChange={this.onWordFrequencyChangeHandler}
                  formatValues={this.formatWordFrequencyValue(wordFrequencyPercentage)}
                />
              </div>
              {this.props.analyzeStatus.loading || this.props.analysis === null ?
                null :
                <div style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <BarChart
                    title={this.props.translate('text-analysis.word-frequency-distribution')}
                    xLabel={this.props.translate('text-analysis.word-frequency-top')}
                    yLabel={this.props.translate('text-analysis.word-count')}
                    fill={WORD_FREQ_COLOR}
                    width={700}
                    height={250}
                    data={this.props.analysis.wordFrequencyCounts}
                  />
                </div>
              }
              {this.props.analyzeStatus.loading || this.props.analysis === null ?
                null :
                <div style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <PieChart
                    title={this.props.translate('text-analysis.word-type-distribution')}
                    width={500}
                    height={400}
                    data={this.props.analysis.wordTypeCounts}
                  />
                </div>
              }
            </Segment>
            <Segment>
              <Header as="h5">{this.props.translate('text-analysis.text-sentence-data')}</Header>
              <Statistic.Group widths={3} size="small">
                {/* Average sentence length in words */}
                <Statistic size="small">
                  <Statistic.Label>
                    {this.props.translate('text-analysis.average-sentence-length')}
                  </Statistic.Label>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ?
                      <Icon loading name="spinner" /> :
                      this.props.analysis.averageSentenceLengthInWords.toFixed(2)}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.words')}
                  </Statistic.Label>
                </Statistic>
                {/* Average sentence length in characters */}
                <Statistic size="small">
                  <Statistic.Label>
                    {this.props.translate('text-analysis.average-sentence-length')}
                  </Statistic.Label>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ?
                      <Icon loading name="spinner" /> :
                      this.props.analysis.averageSentenceLengthInCharacters.toFixed(2)
                    }
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.characters')}
                  </Statistic.Label>
                </Statistic>
                {/* Sentence length class rating */}
                <Statistic size="small">
                  <Statistic.Label>
                    {this.props.translate('text-analysis.complexity-rating')}
                  </Statistic.Label>
                  <Statistic.Value>
                    {this.props.analyzeStatus.loading ?
                      <Icon loading name="spinner" /> :
                      this.props.analysis.sentenceLengthClassRating
                    }
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('text-analysis.class-rating')}
                  </Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <div style={{ paddingTop: '2em', paddingBottom: '2em' }}>
                <LabeledMultipleSlider
                  snap
                  color={SENTENCE_LENGTH_COLOR}
                  min={this.state.sentenceMinLength}
                  max={this.state.sentenceMaxLength}
                  onChange={this.onSentenceLengthChangeHandler}
                  formatValues={this.formatSentenceLengthValues(sentencePercentage)}
                />
              </div>
              {this.props.analyzeStatus.loading || this.props.analysis === null ?
                null :
                <div style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <BarChart
                    title={this.props.translate('text-analysis.sentence-lengths-distribution')}
                    xLabel={this.props.translate('text-analysis.sentence-lengths')}
                    yLabel={this.props.translate('text-analysis.sentence-count')}
                    fill={SENTENCE_LENGTH_COLOR}
                    width={700}
                    height={250}
                    data={this.props.analysis.sentenceLengths}
                  />
                </div>
              }
            </Segment>
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
