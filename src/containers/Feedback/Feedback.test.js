import React from 'react';
import {Modal, Rating, Button} from 'semantic-ui-react';

import {Feedback} from './Feedback';

describe('<Feedback />', () => {
  it('renders', () => {
    const feedback = shallow(<Feedback translate={sinon.stub()} />);
    expect(feedback).to.be.present();
  });

  it('should render as modal', () => {
    const feedback = shallow(<Feedback translate={sinon.stub()} />);
    expect(feedback.find(Modal)).to.have.length(1);
  });

  it('should not render modal when closed', () => {
    const feedback = shallow(<Feedback open={false} translate={sinon.stub()} />);
    expect(feedback.find(Modal)).to.have.prop('open', false);
  });

  it('should not render modal when closed', () => {
    const feedback = shallow(<Feedback open={true} translate={sinon.stub()} />);
    expect(feedback.find(Modal)).to.have.prop('open', true);
  });

  it('should contain modal header', () => {
    const feedback = shallow(<Feedback open={true} translate={sinon.stub()} />);
    expect(feedback.find(Modal.Header)).to.have.length(1);
  });

  it('should translate modal header', () => {
    const translateStub = sinon.stub();
    shallow(<Feedback open={true} translate={translateStub} />);
    expect(translateStub).to.have.been.calledWith('feedback.modal-header')
  });

  it('should contain rating', () => {
    const feedback = shallow(<Feedback open={true} translate={sinon.stub()} />);
    expect(feedback.find(Rating)).to.have.length(1);
  });

  it('should contain button', () => {
    const feedback = shallow(<Feedback open={true} translate={sinon.stub()} />);
    expect(feedback.find(Button)).to.have.length(1);
  });

  it('should translate button', () => {
    const translateStub = sinon.stub();
    shallow(<Feedback open={true} translate={translateStub} />);
    expect(translateStub).to.have.been.calledWith('feedback.send');
  });

  it('should submit on click', () => {
    const submitStub = sinon.stub();
    const feedback = shallow(<Feedback open={true} translate={sinon.stub()} onSubmit={submitStub} />);
    feedback.find(Button).simulate('click');
    expect(submitStub).to.have.been.calledWith({});
  });
});