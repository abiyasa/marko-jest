/* eslint-env browser */
module.exports = {
  onCreate() {
    this.state = {
      isPlaying: false
    };
  },

  playVideo() {
    this.state.isPlaying = true;
  },

  stopVideo() {
    this.state.isPlaying = false;
  }
};
