/* eslint no-extend-native: "off" */
String.prototype.endsWith = function (search, this_len) {
  if (this_len === undefined || this_len > this.length) {
    this_len = this.length;
  }
  return this.substring(this_len - search.length, this_len) === search;
};
