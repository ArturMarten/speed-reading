import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

export class ExerciseDescription extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        <div style={{ fontSize: '1.1em' }}>
          <div>{this.props.translate(`exercises.description-${this.props.type}`)}</div>
          <div>
            <b>{`${this.props.translate('exercises.goal')}: `}</b>
            {this.props.translate(`exercises.goal-${this.props.type}`)}
          </div>
        </div>
        {this.props.type === 'concentration' ? (
          <div>
            <b>{`${this.props.translate('exercises.shortkeys')}: `}</b>
            {this.props.translate('exercises.shortkeys-concentration')}
          </div>
        ) : null}
        {this.props.type === 'visualVocabulary' ? (
          <div>
            <b>{`${this.props.translate('exercises.shortkeys')}: `}</b>
            {this.props.translate('exercises.shortkeys-visualVocabulary')}
          </div>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseDescription);
