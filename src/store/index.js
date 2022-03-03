import Vue from 'vue'
import Vuex from 'vuex'

import {
  getSongById, getBanner, getHotPlaylist, getSongDetail, getLyricById,
  searchSong
} from "../utils/api.js"
Vue.use(Vuex)
let state = {
  isPlay: false,
  curMusicId: -1,
  curMusicUrl: "",
  currentMusicPlayDuration: 0,
  currentMusicTotalDuration: 0,
  albumId: 0,
  currentMusicIndex: 0,
  currentPlaylist: [],
  currentMusicInfo: {},
  playModeIndex: 0,
  playModeArray: ['single', 'loop', 'single-loop'],
  volume: 20,

  favouriteSongs:[],
};
let getters = {
  playMode(state) {
    return state.Array[state.ModeIndex];
  },
  playingMusicInfo(state) {
    return ""
  },
  getMusicUrl: (state) => state.currentMusicUrl,
  playlistLength(state) {
    return state.currentPlaylist.length;
  }
}
let mutations = {
  setMusicId(state, musicId) {
    state.curMusicId = musicId;
  },
  setMusicUrl(state, musicUrl) {
    state.curMusicUrl = musicUrl;
  },
  setPlaylist(state, playlist) {
    // console.log(playlist);
    if (playlist.length === 0) return;
    state.currentMusicIndex = 0;
    console.log("playlist", playlist);
    state.currentPlaylist = playlist;
  },
  changePlayStatus(state, status) {
    //不设置url
    if (state.musicUrl === "") return;
    state.isPlay = status || !state.isPlay;
  },
  changePlaylistIndex(state, index) {
    if (index < 0 || index > state.currentPlaylist.length) return;
    state.currentMusicIndex = index;
  },
  setCurrentMusicDuration(state, playDuration) {
    state.currentMusicPlayDuration = playDuration;
    // console.log(playDuration);
  },
  setCurrentMusicTotalDuration(state, totalDuration) {
    state.currentMusicTotalDuration = totalDuration;
  },
  setCurrentMusicInfo(state, musicInfo) {
    state.currentMusicInfo = musicInfo;
  },
  setPlayMode(state, mode) {
    state.playMode = mode;
  },
  setVolume(state, volume) {
    state.volume = volume;
    console.log(volume);
  },
  //传入数组
  add2Favourite(state,songs){
    state.favouriteSongs.push(...songs);
  }
};

let actions = {
  //注意参数是payload ,里面有id
  async playMusicById(context, payload) {
    context.commit('changePlayStatus', false);
    let id = payload.id, data, url;
    context.commit('setMusicId', id);
    try {
      data = await getSongById(id);
    } catch (err) {
      console.log(err);
    } finally {
      url = (data = await getSongById(id)).data[0].url;
      // console.log(data);
    }
    context.commit('setMusicUrl', url);
    // console.log("url ok",url);
    context.commit('changePlayStatus', true);
    // console.log("playMusicById completed",context.state.isPlay);
  },
  //playload:{albumId,playload.params}
  async setPlaylistById(context, payload) {
    let albumId = playload.albumId;
    context.state.playlist = await getHotPlaylist(payload.params);//有问题
    //是否直接开始播放?
  },
  startPlaylist({ state, getters, commit, dispatch }) {
    //设置好playlist后,开始播放
    if (getters.playlistLength === 0) return;
    console.log(state.currentPlaylist)
    let id = state.currentPlaylist[state.currentMusicIndex];
    console.log(id);
    dispatch("playMusicById", { id });

  },
  toNextSong({ state, getters, commit, dispatch }) {
    commit('changePlayStatus', false);
    commit("setCurrentMusicDuration",0);
    if(getters.playlistLength===0) return;
    let tmp = (state.currentMusicIndex + 1) %getters.playlistLength;
    console.log("tmp",tmp);
    commit('changePlaylistIndex', tmp);
    dispatch('playMusicById', { id: state.currentPlaylist[state.currentMusicIndex] });
    commit('changePlayStatus', true);
  },
  toPrevSong({ state, getters,commit,dispatch }) {
    commit('changePlayStatus', false);
    let tmp = (state.currentMusicIndex + getters.playlistLength - 1)
      % getters.playlistLength;
    commit('changePlaylistIndex', tmp);
    dispatch('playMusicById', { id: state.playlist[state.currentMusicIndex] });
    commit('changePlayStatus', true);
  },
  // async getSingerInfo({ state, commit }, singerId) {
    
  // },
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
