import React from 'react';
import {shallow, mount} from 'enzyme';
import {Modal, Rating, Button} from 'semantic-ui-react';

import {Feedback} from './Feedback';

describe('<Feedback />', () => {
  let shallowWrapper;
  let mountWrapper;
  
  beforeEach(() => {
    shallowWrapper = shallow(<Feedback translate={jest.fn()} />);
    mountWrapper = mount(<Feedback translate={jest.fn()} />);
  });

  it('should render modal', () => {
    expect(shallowWrapper.find(Modal)).toHaveLength(1);
    expect(mountWrapper.find(Modal)).toHaveLength(1);
  });

  it('should contain header', () => {
    expect(shallowWrapper.find(Modal.Header)).toHaveLength(1);
  });

  it('should contain rating', () => {
    expect(shallowWrapper.find(Rating)).toHaveLength(1);
  });

  it('should contain button', () => {
    expect(shallowWrapper.find(Button)).toHaveLength(1);
  });
});