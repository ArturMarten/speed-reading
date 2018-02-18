import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Header, Message, Dropdown, Segment} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import RegressionChart from '../../components/Statistics/RegressionChart';

const statistics = [
  [
    {date: '2017-09-20', wpm: 230},
    {date: '2017-10-10', wpm: 250},
    {date: '2017-11-1', wpm: 300},
    {date: '2017-11-11', wpm: 320},
    {date: '2017-11-17', wpm: 300},
    {date: '2018-1-1', wpm: 325},
    {date: '2018-1-12', wpm: 315}
  ],
  [
    {date: '2017-09-21', wpm: 230},
    {date: '2017-10-10', wpm: 230},
    {date: '2017-11-1', wpm: 320},
    {date: '2017-11-11', wpm: 300},
    {date: '2017-12-1', wpm: 310},
    {date: '2018-1-1', wpm: 305},
    {date: '2018-1-12', wpm: 345}
  ],
  [
    {date: '2017-09-24', wpm: 230},
    {date: '2017-10-10', wpm: 260},
    {date: '2017-11-1', wpm: 300},
    {date: '2017-12-11', wpm: 290},
    {date: '2018-1-1', wpm: 335},
    {date: '2018-1-12', wpm: 295},
    {date: '2018-1-7', wpm: 305}
  ]
];

export class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedData: statistics[0]
    };
  }

  exerciseSelectionHandler(event, data) {
    let selectedData = statistics[0];
    switch (data.value) {
      case 'Reading test':
        selectedData = statistics[0];
        break;
      case 'Word groups':
        selectedData = statistics[1];
        break;
      case 'Disappearing text':
        selectedData = statistics[2];
        break;
      default:
        selectedData = statistics[0];
        break;
    }
    this.setState({selectedData: selectedData});
  }

  render() {
    const exercises = [
      {text: this.props.translate('statistics.reading-test'), value: 'Reading test'},
      {text: this.props.translate('statistics.word-groups'), value: 'Word groups'},
      {text: this.props.translate('statistics.disappearing-text'), value: 'Disappearing text'}
    ];
    return (
      <Container style={{marginTop: '4em'}} textAlign='left'>
        <Header as='h2'>{this.props.translate('statistics.title')}</Header>
        <p>{this.props.translate('statistics.description')}</p>
        <Message warning>
          <Message.Header>{this.props.translate('statistics.warning-title')}</Message.Header>
          <p>{this.props.translate('statistics.warning-content')}</p>
        </Message>
        <Dropdown
          onChange={(event, data) => this.exerciseSelectionHandler(event, data)}
          defaultValue='Reading test' fluid selection options={exercises} />
        <Segment>
          <RegressionChart
            data={this.state.selectedData}
            size={[1000, 400]}
            translate={this.props.translate}
          />
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
