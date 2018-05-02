import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Statistic, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';

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
            <Statistic.Group widths={1} size="small">
              <Statistic>
                <Statistic.Value>
                  {this.props.analyzeStatus.loading ? <Icon loading name="spinner" /> : this.props.analysis.length}
                </Statistic.Value>
                <Statistic.Label>
                  {this.props.translate('text-analysis.length')}<br />
                </Statistic.Label>
              </Statistic>
            </Statistic.Group>
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
