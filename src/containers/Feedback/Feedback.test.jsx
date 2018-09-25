import React from 'react';
import { Modal, Rating, TextArea, Button } from 'semantic-ui-react';

import { Feedback } from './Feedback';

describe('<Feedback />', () => {
  it('renders', () => {
    const wrapper = shallow(<Feedback feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper).to.be.present();
  });

  it('should render as modal', () => {
    const wrapper = shallow(<Feedback feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(Modal)).to.have.length(1);
  });

  it('should not render modal when closed', () => {
    const wrapper = shallow(<Feedback open={false} feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(Modal)).to.have.prop('open', false);
  });

  it('should not render modal when closed', () => {
    const wrapper = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(Modal)).to.have.prop('open', true);
  });

  it('should render modal header', () => {
    const wrapper = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(Modal.Header)).to.have.length(1);
  });

  it('should render three rating bars', () => {
    const wrapper = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(Rating)).to.have.length(3);
  });

  it('should render a textarea', () => {
    const wrapper = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(TextArea)).to.have.length(1);
  });

  it('should render button', () => {
    const wrapper = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(wrapper.find(Button)).to.have.length(1);
  });
});
