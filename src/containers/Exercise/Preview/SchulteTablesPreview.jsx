import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { generateSymbols } from '../../../store/reducers/exercise';
import { SchulteTables } from '../Types/SchulteTables';

export class SchulteTablesPreview extends Component {
  state = {
    show: false,
    symbols: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.exerciseModification !== this.props.exerciseModification) {
      this.generateTable();
    }
  }

  generateTable = () => {
    this.setState({ symbols: generateSymbols(25, this.props.exerciseModification) });
  }

  toggleClickHandler = () => {
    this.setState({ show: !this.state.show });
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Row style={{ paddingBottom: 0 }}>
          <Button
            basic
            fluid
            compact
            onClick={this.toggleClickHandler}
          >
            <Icon name={this.state.show ? 'chevron up' : 'chevron down'} style={{ opacity: 1 }} />
            {this.state.show ? this.props.translate('exercise-preview.hide') : this.props.translate('exercise-preview.show')}
          </Button>
        </Grid.Row>
        <Grid.Row style={{ visibility: this.state.show ? 'visible' : 'hidden' }}>
          <SchulteTables
            exerciseOptions={this.props.exerciseOptions}
            textOptions={this.props.textOptions}
            symbols={this.state.symbols}
          />
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  exerciseModification: state.exercise.modification,
  exerciseOptions: state.options.exerciseOptions,
  textOptions: state.options.textOptions,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SchulteTablesPreview);
