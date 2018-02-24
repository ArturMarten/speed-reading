import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Grid, Button, Divider, Message} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import TextSelection from '../../TextSelection/TextSelection';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import TextPreview from '../Preview/TextPreview';

export class TextExercisePreparation extends Component {

  render() {
    return (
      <Container style={{marginTop: '4vh'}}>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column width={8}>
              <h2>{this.props.translate('exercises.title-' + this.props.type)}</h2>
              <p>{this.props.translate('exercises.description-' + this.props.type)}</p>
            </Grid.Column>
            <Grid.Column width={6}>
              <TextSelection />
            </Grid.Column>
            <Grid.Column verticalAlign='bottom' width={2}>
              <Button positive onClick={this.props.onProceed} content={this.props.translate('exercises.proceed')} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Message info>
          <p>{this.props.translate('exercises.info-content')}</p>
        </Message>
        <TextOptions />
        <ExerciseOptions />
        <SpeedOptions />
        <TextPreview />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
