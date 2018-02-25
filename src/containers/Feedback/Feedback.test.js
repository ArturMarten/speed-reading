import React from 'react';
import {shallow, mount} from 'enzyme';
import {Modal, Rating, Button} from 'semantic-ui-react';
import {expect} from 'chai';

import {Feedback} from './Feedback';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<Feedback />', () => {
  let shallowWrapper;
  let mountWrapper;
  
  beforeEach(() => {
    shallowWrapper = shallow(<Feedback translate={() => {}} />);
    // mountWrapper = mount(<Feedback translate={() => {}} />);
  });

  it('should render modal', () => {
    expect(shallowWrapper.find(Modal)).to.have.length(1);
    // expect(mountWrapper.find(Modal)).toHaveLength(1);
  });

  it('should contain header', () => {
    expect(shallowWrapper.find(Modal.Header)).to.have.length(1);
  });

  it('should contain rating', () => {
    expect(shallowWrapper.find(Rating)).to.have.length(1);
  });

  it('should contain button', () => {
    expect(shallowWrapper.find(Button)).to.have.length(1);
  });
});