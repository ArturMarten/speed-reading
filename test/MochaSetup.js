import jsdom from 'jsdom-global';
import {configure, shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// React 16 Enzyme adapter
configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true
});

const noop = () => 1;
require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;
require.extensions['.svg'] = noop;

global.shallow = shallow;
global.mount = mount;
global.render = render;
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
jsdom();

chai.should();
chai.use(chaiEnzyme());
chai.use(sinonChai);