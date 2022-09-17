import { createStore } from "vuex";

export default createStore({
  state: {
    song: {
      artist: "",
      title: "",
      albumart: "",
    },
    progress: {
      position: 0,
      length: 0,
    },
    playbackState: "stopped",
  },
  getters: {},
  mutations: {
    setSong(state, song) {
      state.song.artist = song.artist;
      state.song.title = song.title;
      state.song.albumart = song.albumart;
    },
    setProgress(state, progress) {
      state.progress.position = progress.position;
      state.progress.length = progress.length;
    },
    setPlaybackState(state, playback_state) {
      state.playbackState = playback_state;
    },
  },
  actions: {},
  modules: {},
});
