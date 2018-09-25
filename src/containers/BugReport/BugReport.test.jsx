import React from 'react';
import { Modal, TextArea, Button } from 'semantic-ui-react';

import { BugReport } from './BugReport';

describe('<BugReport />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <BugReport
        open
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    expect(wrapper).to.be.present();
  });

  it('should contain two modals', () => {
    const wrapper = shallow(
      <BugReport
        open
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    expect(wrapper.find(Modal)).to.have.length(2);
  });

  it('should render modal header', () => {
    const wrapper = shallow(
      <BugReport
        open
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    expect(wrapper.find(Modal.Header)).to.have.length(1);
  });

  it('should render a textarea', () => {
    const wrapper = shallow(
      <BugReport
        open
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    expect(wrapper.find(TextArea)).to.have.length(1);
  });

  it('should render submit button', () => {
    const wrapper = shallow(
      <BugReport
        open
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    expect(wrapper.find(Button)).to.have.length(1);
  });

  it('should call submit on click', () => {
    const onSubmitStub = sinon.stub();
    const wrapper = shallow(
      <BugReport
        open
        onSubmit={onSubmitStub}
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    wrapper.find(Button).simulate('click');
    expect(onSubmitStub).to.have.been.calledWith();
  });

  it('should submit description', () => {
    const onSubmitStub = sinon.stub();
    const wrapper = shallow(
      <BugReport
        open
        onSubmit={onSubmitStub}
        bugReportStatus={{}}
        translate={sinon.stub()}
      />,
    );
    wrapper.setState({
      bugReportForm: {
        ...wrapper.state().bugReportForm,
        description: {
          ...wrapper.state().bugReportForm.description,
          value: 'Some bug',
        },
      },
    });
    wrapper.find(Button).simulate('click');
    expect(onSubmitStub.getCall(0).args[0].description).to.equal('Some bug');
  });
});
