/* eslint-env browser */
module.exports = {
  onCreate() {
    this.state = {
      win: false
    };
  },

  handleSelect(value) {
    if (value === 'win') {
      this.state.win = true;

      this.playAwardVideo();
    }
  },

  playAwardVideo() {
    const video = this.getComponent('award-video');
    if (video) {
      video.playVideo();
    }
  }
};
