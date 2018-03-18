import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Statistic, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import axios from '../../../axios-http';
import { updateObject } from '../../../shared/utility';

const EXERCISES = 3;

export class AppStats extends Component {
  state = {
    loading: true,
    stats: {
      exercises: EXERCISES,
      texts: 0,
      questions: 0,
      users: 0,
      feedback: 0,
    },
  };
  componentDidMount() {
    axios.get('/appStats')
      .then((response) => {
        const updatedStats = updateObject(this.state.stats, {
          ...response.data,
        });
        this.setState({
          loading: false,
          stats: updatedStats,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }
  render() {
    return (
      <Statistic.Group size="small" widths={5}>
        <Statistic>
          <Statistic.Value>
            <Icon name="winner" />
            {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.exercises}
          </Statistic.Value>
          <Statistic.Label>{this.props.translate('app-stats.exercises')}</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name="file text outline" />
            {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.texts}
          </Statistic.Value>
          <Statistic.Label>{this.props.translate('app-stats.texts')}</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name="question circle" />
            {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.questions}
          </Statistic.Value>
          <Statistic.Label>{this.props.translate('app-stats.questions')}</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name="talk" />
            {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.feedback}
          </Statistic.Value>
          <Statistic.Label>{this.props.translate('app-stats.feedback')}</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name="users" />
            {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.users}
          </Statistic.Value>
          <Statistic.Label>{this.props.translate('app-stats.users')}</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStats);
