import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { SchulteTables } from '../Types/SchulteTables/SchulteTables';
import { generateSymbols } from '../../../store/reducers/exercise';
import { getSymbolCount } from '../../../shared/utility';

export class SchulteTablesPreview extends Component {
  state = {
    show: true,
    symbols: [],
  };

  componentDidMount() {
    this.refreshPreview();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.exerciseModification !== this.props.exerciseModification ||
      prevProps.exerciseOptions !== this.props.exerciseOptions
    ) {
      this.refreshPreview();
    }
  }

  refreshPreview = () => {
    const { tableDimensions } = this.props.exerciseOptions;
    const symbolCount = getSymbolCount(tableDimensions);
    this.setState({ symbols: generateSymbols(symbolCount, this.props.exerciseModification) });
  };

  toggleClickHandler = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <Grid container centered>
        <Grid.Row style={{ paddingBottom: 0 }}>
          <Button basic fluid compact onClick={this.toggleClickHandler}>
            <Icon name={this.state.show ? 'chevron up' : 'chevron down'} style={{ opacity: 1 }} />
            {this.state.show
              ? this.props.translate('exercise-preview.hide')
              : this.props.translate('exercise-preview.show')}
          </Button>
        </Grid.Row>
        <Grid.Row style={{ marginBottom: '1em', visibility: this.state.show ? 'visible' : 'hidden' }}>
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

const mapStateToProps = (state) => ({
  exerciseModification: state.exercise.modification,
  exerciseOptions: state.options.exerciseOptions,
  textOptions: state.options.textOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SchulteTablesPreview);
