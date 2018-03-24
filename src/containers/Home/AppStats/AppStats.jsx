import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Header, Statistic, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import axios from '../../../axios-http';
import { updateObject } from '../../../shared/utility';
import { EXERCISE_COUNT } from '../../../store/reducers/exercise';

export class AppStats extends Component {
  state = {
    loading: true,
    stats: {
      exercises: EXERCISE_COUNT,
      exerciseAttempts: 0,
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
      <Fragment>
        <Header as="h3">{this.props.translate('app-stats.state')}</Header>
        <Statistic.Group widths={6}>
          <Statistic>
            <Statistic.Value>
              <Icon name="winner" />
              {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.exercises}
            </Statistic.Value>
            <Statistic.Label>
              {this.props.translate('app-stats.different')}<br />
              {this.props.translate('app-stats.exercises')}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              <Icon name="flask" />
              {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.exerciseAttempts}
            </Statistic.Value>
            <Statistic.Label>
              {this.props.translate('app-stats.exercise')}<br />
              {this.props.translate('app-stats.attempts')}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              <Icon name="file text outline" />
              {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.texts}
            </Statistic.Value>
            <Statistic.Label>
              {this.props.translate('app-stats.reading')}<br />
              {this.props.translate('app-stats.texts')}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              <Icon name="question circle" />
              {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.questions}
            </Statistic.Value>
            <Statistic.Label>
              {this.props.translate('app-stats.test')}<br />
              {this.props.translate('app-stats.questions')}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              <Icon name="talk" />
              {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.feedback}
            </Statistic.Value>
            <Statistic.Label>
              {this.props.translate('app-stats.feedback')}<br />
              {this.props.translate('app-stats.received')}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              <Icon name="users" />
              {this.state.loading ? <Icon loading name="spinner" /> : this.state.stats.users}
            </Statistic.Value>
            <Statistic.Label>
              {this.props.translate('app-stats.users')}<br />
              {this.props.translate('app-stats.registered')}
            </Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Fragment>
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
