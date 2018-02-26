import React from 'react';
import {shallow} from 'enzyme';
import {Header, Image} from 'semantic-ui-react';
import {expect} from 'chai';

import {Home} from './Home';

describe('<Home />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Home translate={() => {}}/>);
  });

  it('should render header', () => {
    expect(wrapper.find(Header)).to.have.length(1);
  });

  it('should render two logos', () => {
    expect(wrapper.find(Image)).to.have.length(2);
  });
});
