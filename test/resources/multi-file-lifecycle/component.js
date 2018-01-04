/* eslint-env browser */
module.exports = {
  onCreate() {
    this.state = {
      scrolled: false
    };
  },

  onMount() {
    window.addEventListener('scroll', this.handleScroll);
  },

  onDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  handleScroll() {
    if (!this.state.scrolled) {
      this.state.scrolled = true;
    }
  }
};
