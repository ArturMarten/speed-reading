import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// React 16 Enzyme adapter
configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.before = beforeAll;

chai.use(chaiEnzyme());
chai.use(sinonChai);