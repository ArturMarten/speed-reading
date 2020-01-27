
// This file will be used to load any polyfills that are required by the site.
//   If you are adding one then make sure you do the following:
//
//   1) Add it here as to why you added it, and what browsers were effecting it
//   2) In the polyfill file, make sure you turn off any eslint checks that you need to (mostly just /* eslint no-extend-native: "off" */)

// String.prototype.startsWith is not yet available with Internet Explorer, so we add the polyfill here.
import './StringStartsWith';

// String.prototype.endsWith is not yet available with Internet Explorer, so we add the polyfill here.
import './StringEndsWith';

// Array.prototype.fill is not yet available with Internet Explorer, so we add the polyfill here.
import './ArrayFill';

// Number.parseInt and Number.parseFloat is not available with Internet Explorer, so we add the polyfill here.
import './Number';

// High DPI canvas
import './HTMLCanvasElement';
