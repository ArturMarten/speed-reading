import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import { Home } from './Home';

describe('<Home />', () => {
  it('renders', () => {
    const wrapper = shallow(<Home translate={sinon.stub()} />);
    expect(wrapper).to.be.present();
  });

  it('should render header', () => {
    const wrapper = shallow(<Home translate={sinon.stub()} />);
    expect(wrapper.find(Header)).to.have.length(1);
  });

  it('should render three logos', () => {
    const wrapper = shallow(<Home translate={sinon.stub()} />);
    expect(wrapper.find(Image)).to.have.length(3);
  });
});
