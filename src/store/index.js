import Vue from 'vue'
import Vuex from 'vuex'

import {getSongById,getBanner,getHotPlaylist,getSongDetail,getLyricById} from "../utils/api.js"
Vue.use(Vuex)
let state={
  isPlay:false,
  curMusicId:-1,
  curMusicUrl:"",
  currentMusicPlayDurration:0,
  currentMusicTotalDuration:0,
  albumId:0,
  currentPlayist:[],
  currentMsuicInfo:{},
  playModeIndex:0,
  playModeArray:['single','loop','single-loop'],
};

let mutations={
  setCurrentMusicDuration(state,playDuration){
    state.currentMusicPlayDurration=playDuration;
  },
  setCurrentMusicInfo(state,musicInfo){
    state.currentMusicInfo=musicInfo;
  },
  setPlayMode(state,mode){
    state.playMode=mode;
  },
  
};

let actions={
  async setMusicById(context,payload){
    let id=playload.id;
    context.state.curId=id;
    context.state.curMusicUrl=await getSongById(id);
  },
  //playload:{albumId,playload.params}
  async setPlaylistById(context,payload){
    let albumId=playload.albumId;
    context.state.playlist=await getHotPlaylist(payload.params);
    //是否直接开始播放?
  }

}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
})
