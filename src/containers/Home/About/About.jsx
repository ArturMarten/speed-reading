import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Icon, Grid, Header } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

export class About extends Component {
  state = {};
  render() {
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('about.modal-header')}</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={4}>
                <Icon name="book" size="massive" color="blue" />
              </Grid.Column>
              <Grid.Column width={12}>
                <Header textAlign="center" as="h3">{this.props.translate('about.title')}</Header>
                <div>
                  <b>{this.props.translate('about.project-manager')}: </b>{this.props.translate('about.project-manager-name')}
                </div>
                <div>
                  <b>{this.props.translate('about.developer')}: </b>{this.props.translate('about.developer-name')}
                </div>
                <div>
                  <b>{this.props.translate('about.helper')}: </b>{this.props.translate('about.helper-names')}
                </div>
                <br />
                <div>
                  <b>{this.props.translate('about.place')} {(new Date()).getFullYear()}</b> © {this.props.translate('about.copyright')}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
