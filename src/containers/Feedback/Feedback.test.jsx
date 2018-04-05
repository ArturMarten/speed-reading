import React from 'react';
import { Modal, Rating, TextArea, Button } from 'semantic-ui-react';

import { Feedback } from './Feedback';

describe('<Feedback />', () => {
  it('renders', () => {
    const feedback = shallow(<Feedback feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback).to.be.present();
  });

  it('should render as modal', () => {
    const feedback = shallow(<Feedback feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(Modal)).to.have.length(1);
  });

  it('should not render modal when closed', () => {
    const feedback = shallow(<Feedback open={false} feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(Modal)).to.have.prop('open', false);
  });

  it('should not render modal when closed', () => {
    const feedback = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(Modal)).to.have.prop('open', true);
  });

  it('should contain modal header', () => {
    const feedback = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(Modal.Header)).to.have.length(1);
  });

  it('should translate modal header', () => {
    const translateStub = sinon.stub();
    shallow(<Feedback open feedbackStatus={{}} translate={translateStub} />);
    expect(translateStub).to.have.been.calledWith('feedback.modal-header');
  });

  it('should contain three rating bars', () => {
    const feedback = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(Rating)).to.have.length(3);
  });

  it('should contain a textarea', () => {
    const feedback = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(TextArea)).to.have.length(1);
  });

  it('should contain button', () => {
    const feedback = shallow(<Feedback open feedbackStatus={{}} translate={sinon.stub()} />);
    expect(feedback.find(Button)).to.have.length(1);
  });

  it('should translate button', () => {
    const translateStub = sinon.stub();
    shallow(<Feedback open feedbackStatus={{}} translate={translateStub} />);
    expect(translateStub).to.have.been.calledWith('feedback.send');
  });
});
