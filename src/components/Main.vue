<template>
  <el-container style="height: 100%">
    <!-- 头部 -->
    <el-header>
      <img src="img/logo.png" alt="this is logo" class="logo" />
      <span>music</span>
      <!-- 头部搜素 -->
      <el-input
        placeholder="placeholder"
        v-model="searchData"
        size="mini"
        suffix-icon="el-icon-search"
        @keyup.enter.native="toSearchPage"
      >
        <el-button
          slot="suffix"
          class="searchBtn"
          size="mini"
          @click="toSearchPage"
        ></el-button>
      </el-input>
      <!-- 右侧登录区域 -->
      <div class="rightContainer" @click="test" style="display: flex">
        <!-- 短路表达式 -->
        <!-- <img src="'img/userIcon.png'" class="userIcon" alt="this is avatar" /> -->
        <span v-if="true" style="cursor: pointer">未登录</span>
        <!-- <span v-else>{{ currentUserInfo.nickname }}</span>
        <el-button
          type="danger"
          @click="logout"
          v-if="currentUserInfo !== null"
          size="mini"
          style="height: 50%; margin-top: 10px; margin-left: 5px"
          >退出</el-button
        > -->
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <el-aside width="210px" style="margin-top:20px;">
        <el-button icon="el-icon-back" @click="routerback"></el-button>
        <el-menu default-active="/findMusic" :router="true">
          <el-menu-item-group>
            <template slot="title">推荐</template>
            <el-menu-item index="">发现音乐</el-menu-item>
            <el-menu-item index> 视频(假装有)</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">我的音乐</template>
            <el-menu-item index="/cloudMusic">我的音乐云盘音乐</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">创建歌单</template>
            <!-- <el-menu-item
              index
              :index="'/songlist/' + item.id"
              @click="changePlaylistId(item.id)"
              v-for="item in currentUserPlayList"
              v-if="!item.subscribed"
              >{{ item.name }}
            </el-menu-item> -->
          </el-menu-item-group>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main style="margin-top: 15px">
          
            <router-view ref="child"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 播放器 -->
    <el-footer
      style="
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 100;
        height: 150px;
      "
    >
      <el-row style="width: 209px; background-color: white">
        <el-col :span="8">
          <img
            src="img/phone.png"
            @click="tomusicDetailPage"
            alt="musiccover"
            style="width: 60px; height: 63px; cursor: pointer"
          />
        </el-col>
        <el-col :span="16">
          <p style="height: 8px; font-size: 10px">{{ music.name }}</p>
          <br />
          <span style="color: gray; font-size: 10px">{{
            music.ar[0].name
          }}</span>
        </el-col>
      </el-row>

      <el-row
        style="
          margin-top: 10px;
          border-top: 1px solid rgb(230, 230, 230);
          background-color: white;
        "
      >
        <el-col :span="2.5">
          <!-- ← -->
          <img
            src="img/prev.png"
            alt="prev"
            @click="toPrevSong"
            style="border-radius: 100%; cursor: pointer"
          />
          <img
            :src="isPlay ? 'img/pauseMusic.png' : 'img/playMusic.png'"
            alt="pause"
            @click="onClickPlayBtn"
            style="
              border-radius: 50%;
              cursor: pointer;
              margin-left: 25px;
              width: 40px;
              height: 40px;
            "
          />
          <img
            src="img/next.png"
            alt="next"
            @click="toNextSong"
            style="border-radius: 100%; cursor: pointer; margin-left: 25px"
          />
        </el-col>
        <el-col :span="15" :offset="1">
          <span style="position: absolute; top: 9px">{{
            currentMusicPlayDuration | timeFormat
          }}</span>
          <el-slider
            v-model="localCurrentDuration"
            :max="currentMusicTotalDuration"
            @change="musicDurationChange"
            :show-tooltip="false"
          ></el-slider>
          <span style="position: absolute; left: 73%; top: 9px">{{
            currentMusicTotalDuration | timeFormat
          }}</span>
        </el-col>
        <el-col :span="5">
          <!-- volume -->
          <img
            :src="volume === 0 ? 'img/shutUp.png' : 'img/laba.png'"
            alt="volume"
            @click="silence"
            class="volume"
          />
          <img
            src="img/songList.png"
            alt="listpic"
            @click="showCurrentPlayList"
            style="position: absolute; top: -30px; right: 5%; cursor: pointer"
          />
          <el-slider
            v-model="localVolume"
            :show-tooltip="false"
            style="width: 30%"
            @change="volumeChange"
          ></el-slider>
        </el-col>
      </el-row>
      <audio
        :src="curMusicUrl"
        @ended="toNextSong"
        ref="audio"
        @timeupdate="updateDuration"
        :currentTime="currentMusicPlayDuration"
        autoplay
      ></audio>
    </el-footer>
    <el-dialog
      :show-close="false"
      title="播放列表"
      :visible.sync="showCurrentPlayDialog"
      width="30%"
      center
    >
      <el-table
        :data="currentMusicListInfo"
        ref="playTable"
        highlight-current-row
        border
        strip
        style="cursor: context-menu"
      >
        <el-table-column label="#" type="index">
          <template scope="scope">
            <img v-if="curId === scope.row.id" src="" alt="" />
            <p v-else>{{ scope.$index + 1 }}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="id" prop="id"></el-table-column>
        <el-table-column label="音乐标题" prop="name"></el-table-column>
        <el-table-column label="歌手" prop="ar[0].name"></el-table-column>
        <el-table-column label="专辑名" prop="al.name"></el-table-column>
        <el-table-column label="时长" prop="dt" width="80px"></el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script>
import searchPage from "./findMusic/search/searchPage";
import { getSongById } from "../utils/api.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Main",
  computed: {
    ...mapState([
      "isPlay",
      "curMusicId",
      "curMusicUrl",
      "currentMusicPlayDuration",
      "currentMusicTotalDuration",
      "albumId",
      "volume",
    ]),
    ...mapGetters(["playMode", "playingMusicInfo"]),
    musicUrl() {
      return this.$store.state.curMusicUrl;
    },
  },
  watch: {
    // isPlay(newVal) {
    //   // this.audio.url=this.curMusicUrl;
    //   // console.log(newVal,this.audio.url,this.curMusicUrl);
    //   if (this.curMusicUrl === "") return;
    //   if (newVal)
    //     try{this.audio.play();}
    //     catch(err){console.log(err);}
    //   else this.audio.pause();
    // },
  },
  data() {
    return {
      //当前音乐链接
      audio: null,
      localVolume: 20, //给v-model绑着的,要不change无法正常触发
      localCurrentDuration: 0,
      music: {
        name: "",
        al: {
          picUrl: "",
        },
        ar: [
          {
            name: "",
          },
        ],
      },
      //音量
      songListInfo: [],
      //展示右边鹅蛋的对话框
      showCurrentPlayDialog: false,
      currentMusicListInfo: [],
      //搜索关键字
      searchData: "",
      //记录静音前的音量
      lastvolume: 20,
    };
  },
  mounted() {
    this.audio = this.$refs.audio;
    this.volumeChange(this.volume);
    // console.log(this.audio);
  },
  methods: {
    ...mapMutations([
      "changePlayStatus",
      "setCurrentMusicDuration",
      "setVolume",
      "setCurrentMusicTotalDuration",
    ]),
    ...mapActions([
      "toNextSong",
      "toPrevSong",
      "playMusicById",
      "setPlaylistById",
    ]),
    test() {
      this.audioVolume = 0;
      console.log(this.curMusicId);
    },
    /*
    param@ musicInfo{
      id:id, musicid
      ....
    }
    设置单个音乐url
    */
    musicDurationChange(num) {
      this.changePlayStatus(false);
      console.log(num);
      // let tmp=this.audio.ontimeupdate;
      // console.log(tmp);
      // this.audio.ontimeupdate=null;
      this.setCurrentMusicDuration(num);
      this.audio.currentTime = num;
      // this.audio.ontimeupdate=tmp;
      this.changePlayStatus(true);
    },
    volumeChange(num) {
      console.log(num);
      this.setVolume(num);
      this.localVolume = num;
      this.audio.volume = num / 100;
    },
    silence() {
      if (this.volume !== 0) {
        this.lastvolume = this.volume;
        this.volumeChange(0);
      } else {
        this.volumeChange(this.lastvolume);
      }
      console.log("audio volume", this.audio.volume);
    },
    updateDuration(e) {
      if (!this.isPlay) return;
      let currentTime = e.target.currentTime;
      this.setCurrentMusicDuration(currentTime);
      this.setCurrentMusicTotalDuration(e.target.duration);
      console.log(this.currentMusicPlayDuration);
      this.localCurrentDuration = currentTime;
    },
    onClickPlayBtn() {
      try {
        this.changePlayStatus();
        if (this.isPlay) {
          this.audio.play();
        } else this.audio.pause();
        console.log(this.isPlay);
      } catch (err) {
        console.log(err);
      }
    },
    //获得searchData,使用$router去搜索页
    toSearchPage() {
      let value = this.searchData.trim();
      if (value === "") {
        return this.$message("未输入信息");
      }
      console.log(this.searchData);
      this.$router.push("/search/" + encodeURIComponent(this.searchData));
      // this.$refs.childe && this.$refs.child.toSingSearchPage();
    },
    routerback(){
      this.$router.go(-1);
    },
    async testAxios() {
      let res = await getSongById(1920784999);
      console.log(res);
    },
    logout() {},
    getUserPrivateList() {},

    tomusicDetailPage() {},
    showCurrentPlayList() {},
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background: rgb(198, 47, 47);
  height: 50px;
  display: flex;

  .logo {
    width: 25px;
    height: 25px;
    margin: 15px 10px;
    border-radius: 100px;
  }

  span {
    font-size: 20px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
      "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 500;
    margin-top: 15px;
    color: white;
  }
  .el-input {
    width: 275px;
  }
  /deep/ .el-input__inner {
    opacity: 0.4;
    margin-top: 15px;
    margin-left: 50px;
    width: 225px;
    height: 25px;
    border-radius: 12px;
  }
  .searchBtn {
    opacity: 0;
    position: absolute;
    float: right;
    width: 1px;
    height: 24px;
    left: -3px;
    margin-top: 15px !important;
    border-radius: 60%;
  }
  .rightContainer {
    margin-left: auto;
    span {
      font-size: 17px;
      color: white;
    }

    .userIcon {
      width: 30px;
      height: 30px;
      border-radius: 60%;
      margin-top: 13px;
      margin-right: 10px;
    }
  }
}

/deep/ .el-menu-item-group__title {
  padding-left: 5px !important;
  margin-top: 7px;
}
.el-menu-item {
  height: 45px;
  line-height: 3.45em;
}
.el-menu-item.is-active {
  color: black;
  border-left: 2px solid red !important;
}
.el-menu {
  height: 90%;
}
.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: 0 0 0 0;
}
/deep/ .el-slider__button {
  border: 2px solid rgb(198, 47, 47) !important;
}

/deep/ .el-slider__button {
  width: 10px !important;
  height: 10px !important;
}

/deep/ .el-slider__bar {
  background-color: rgb(198, 47, 47);
}

.el-slider {
  width: 80%;
  margin: 0 auto;
}
.el-footer {
  padding: 0;
}
.el-footer {
  padding: 0;
}

/deep/ .el-dialog--center {
  text-align: end;
  float: right;
}

/deep/ .el-dialog__title {
  float: left;
}
</style>
