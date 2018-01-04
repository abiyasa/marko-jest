module.exports = {
  onCreate() {
    this.state = {
      clicked: false
    };
  },

  toggleButton() {
    this.state.clicked = !this.state.clicked;
  }
};
