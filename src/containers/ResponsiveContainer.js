import React, {Component} from 'react';
import {connect} from 'react-redux';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';
import Aux from '../hoc/Auxiliary';

class ResponsiveContainer extends Component {
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
        <DesktopContainer
          activeItem={this.state.activeItem}
          onItemClick={(event, data) => this.itemClickHandler(event, data)}
          >{this.props.children}</DesktopContainer>
        <MobileContainer
          activeItem={this.state.activeItem}
          onItemClick={(event, data) => this.itemClickHandler(event, data)}
          >{this.props.children}</MobileContainer>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => ({
  path: state.router.location.pathname
});

export default connect(mapStateToProps, null)(ResponsiveContainer);
