import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import { Home } from './Home';

describe('<Home />', () => {
  it('renders', () => {
    const home = shallow(<Home translate={sinon.stub()} />);
    expect(home).to.be.present();
  });

  it('should render header', () => {
    const home = shallow(<Home translate={sinon.stub()} />);
    expect(home.find(Header)).to.have.length(1);
  });

  it('should translate header', () => {
    const translateStub = sinon.stub();
    shallow(<Home translate={translateStub} />);
    expect(translateStub).to.have.been.calledWith('home.welcome');
  });

  it('should render two logos', () => {
    const home = shallow(<Home translate={sinon.stub()} />);
    expect(home.find(Image)).to.have.length(2);
  });
});
