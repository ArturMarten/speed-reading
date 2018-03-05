/* eslint no-extend-native: "off" */
String.prototype.startsWith = function (searchString, position) {
  position = position || 0;
  return this.indexOf(searchString, position) === position;
};
