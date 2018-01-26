/* eslint-env browser */
module.exports = {
  handleClick(value) {
    this.emit('select', value);
  }
};
