import React, { Component } from 'react';
import { Modal, Icon, Grid, Header } from 'semantic-ui-react';

export class About extends Component {
  state = {};

  render() {
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>
          {this.props.translate('about.modal-header')}
        </Modal.Header>
        <Modal.Content>
          <Grid stackable>
            <Grid.Row verticalAlign="middle" textAlign="center">
              <Grid.Column width={4}>
                <Icon name="book" size="massive" color="blue" />
              </Grid.Column>
              <Grid.Column width={12}>
                <Header as="h2">
                  {this.props.translate('about.title')}
                </Header>
                <div>
                  <b>
                    {`${this.props.translate('about.developer')}: `}
                  </b>
                  {this.props.translate('about.developer-name')}
                </div>
                <div>
                  <b>
                    {`${this.props.translate('about.contributed-creatively')}: `}
                  </b>
                  {this.props.translate('about.contributed-creatively-names')}
                </div>
                <div>
                  <b>
                    {`${this.props.translate('about.contributed-texts')}: `}
                  </b>
                  {this.props.translate('about.contributed-texts-names')}
                </div>
                <br />
                <div>
                  <b>
                    {`${this.props.translate('about.place')} ${(new Date()).getFullYear()}`}
                  </b>
                  {` © ${this.props.translate('about.copyright')}`}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default About;
