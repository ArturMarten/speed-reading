import React, { Component, Fragment } from 'react';
import { Header, List } from 'semantic-ui-react';

class Features extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        <Header as="h3">{this.props.translate('features.header')}</Header>
        <List relaxed animated verticalAlign="middle">
          <List.Item>
            <List.Icon name="trophy" color="yellow" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.reading-speed-development-header')}</List.Header>
              <List.Description>
                {this.props.translate('features.reading-speed-development-description')}
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="graduation" color="black" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.taking-tests-header')}</List.Header>
              <List.Description>{this.props.translate('features.taking-tests-description')}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="file alternate outline" color="blue" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.reading-text-selection-header')}</List.Header>
              <List.Description>{this.props.translate('features.reading-text-selection-description')}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="cogs" color="black" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.presentation-adjustment-header')}</List.Header>
              <List.Description>
                {this.props.translate('features.presentation-adjustment-description')}
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="line graph" color="red" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.improvement-observing-header')}</List.Header>
              <List.Description>{this.props.translate('features.improvement-observing-description')}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="users" color="black" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.management-header')}</List.Header>
              <List.Description>{this.props.translate('features.management-description')}</List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name="star outline" color="yellow" size="large" />
            <List.Content>
              <List.Header>{this.props.translate('features.user-rating-header')}</List.Header>
              <List.Description>{this.props.translate('features.user-rating-description')}</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Fragment>
    );
  }
}

export default Features;
