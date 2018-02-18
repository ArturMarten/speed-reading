import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

export class ResponsiveLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: props.path.split('/').pop()
    };
  }

  itemClickHandler(event, item) {
    this.setState({activeItem: item.name});
  }

  render() {
    return (
      <Aux>
        <DesktopLayout
          activeItem={this.state.activeItem}
          onItemClick={(event, data) => this.itemClickHandler(event, data)}
          >{this.props.children}</DesktopLayout>
        <MobileLayout
          activeItem={this.state.activeItem}
          onItemClick={(event, data) => this.itemClickHandler(event, data)}
          >{this.props.children}</MobileLayout>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => ({
  path: state.router.location.pathname
});

export default connect(mapStateToProps, null)(ResponsiveLayout);
