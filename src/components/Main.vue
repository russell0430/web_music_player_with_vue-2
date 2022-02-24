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
      <div class="rightContainer" style="display: flex">
        <!-- 短路表达式 -->
        <img :src="currentInfo.avatarUrl ||'img/userIcon.png'" class="userIcon" alt="this is avatar" />
        <span
          v-if="currentUserInfo === null"
          style="cursor: pointer"
          @click="handLogin"
          >未登录</span
        >
        <span v-else>{{ currentUserInfo.nickname }}</span>
        <el-button
          type="danger"
          @click="logout"
          v-if="currentUserInfo !== null"
          size="mini"
          style="height: 50%; margin-top: 10px; margin-left: 5px"
          >退出</el-button
        >
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <el-aside width="210px">
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
            <el-menu-item
              index
              :index="'/songlist/' + item.id"
              @click="changePlaylistId(item.id)"
              v-for="(item, index) in currentUserPlayList"
              v-if="!item.subscribed"
              >{{ item.name }}
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view
            ref="child"
            @setMusicUrl="setMusicUrl"
            :musicDuration="musicDuration"
            @refreshprivatePlaylist="getUserPrivateList"
            :isPlay="isPlay"
            :curId="curId"
            @setSongListInfo="setSongListInfo"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 播放器 -->
    <el-footer
      style="position:fixed;bottom:0;width:100%;z-index:100;height:150px;" 
    >
      <el-row style="width: 209px; background-color: white">
        <el-col :span="8">
          <img
            src="img/phone.png" 
            @click="tomusicDetailPage"
            alt="musiccover"
            style="width: 60px; height: 63px; cursor: pointer;"
          />
        </el-col>
        <el-col :span="16">
          <p style="height:8px; font-size:10px;">{{ music.name }}</p>
          <br />
          <span style="color: gray; font-size: 10px">{{
            music.ar[0].name
          }}</span>
        </el-col>
      </el-row>

      <el-row
        style="margin-top: 10px;border-top:1px solid rgb(230,230,230) ;background-color:white;"
      >
        <el-col :span="2.5">
          <!-- ← -->
          <img
            src="img/prev.png"
            alt="prev"
            @click="changePrevMusic"
            style="border-radius: 100%; cursor: pointer;"
          />
          <img
            :src="isPlay ? 'img/pauseMusic.png' : 'img/playMusic.png'"
            alt="pause"
            @click="playMusic"
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
            @click="changeNextMusic"
            style="border-radius: 100%; cursor: pointer; margin-left: 25px"
          />
        </el-col>
        <el-col :span="15" :offset="1">
          <span style="position:absolute;top:9px;">{{
            this.musicDuration | timeFormat
          }}</span>
          <el-slider
            v-model="musicDuration"
            :max="totalDuration"
            @change="musicDurationChange"
            :show-tooltip="false"
          ></el-slider>
          <span style="position: absolute; left: 73%; top:9px;">{{
            totalDuration | timeFormat
          }}</span>
        </el-col>
        <el-col :span="5">
          <!-- volume -->
          <img
            :src="musicVolume === 0 ? 'img/shutUp.png' : 'img/laba.png'"
            alt="volume"
            @click="silence"
            class="volume"
          />
          <img
            src="img/songList.png"
            alt="listpic"
            @click="showCurrentPlayList"
            style="position: absolute; top: -30px; right: 5%; cursor: pointer;"
          />
          <el-slider
            
            v-model="musicVolume"
            :show-tooltip="false"
            style="width: 30%;"
            @change="musicVolumeChange"
          ></el-slider>
        </el-col>
      </el-row>
      <audio
        :src="musicUrl"
        ref="audio"
        autoplay
        class="playMusicAudio"
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
import searchPage from "./findMusic/search/searchPage"
export default {
  name: "Main",
  props: {
    msg: String,
  },
  data() {
    return {
      //当前音乐链接
      musicUrl: "",
      //当前音乐详情
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
      // 当前音乐进度条
      musicDuration: 0,
      totalDuration: 0,
      //音量
      musicVolume: 20,
      // 当前音乐编号
      curId: 0,
      // 默认是否播放
      isPlay: false,
      playListInfo: (window.localStorage.getItem("playList")&&window.localStorage.getItem("playList").split(","))||[],
      //当前播放歌单的所有歌曲url和其他信息
      currentMusicListInfo: [],
      //当前播放的歌单的id
      songListInfo: [],
      //展示右边鹅蛋的对话框
      showCurrentPlayDialog: false,
      //登录对话框
      loginDailogVisible: false,
      loginInfo: {},
      //当前用户歌单
      currentUserPlayList: [],
      //搜索关键字
      searchData: "",
      currentInfo:"",
      currentUserInfo:"",
    };
  },
  watch: {
    // curId(newVal) {
    //   // this.resetItem("curPlayMusicId", newVal);
    // },
  },
  created() {
    // this.testAxios();
    if (false) {
      this.getUserPrivatePlayList();
    }
  },
  methods: {
    //设置当前播放url
    setMusicUrl(mUrl, detail) {
      //社会之音乐链接和歌曲信息
      this.musicUrl = mUrl;
      // this.music = detail;
      this.curId = detail.id;
      //轮播图传来的歌曲id放到歌单
      this.playListInfo.push(detail.id);
      this.setAudioTagsInfo();
    },
    setAudioTagsInfo() {
      let audio = this.$refs.audio;
      audio.src=this.musicUrl;
      
      audio.addEventListener("timeupdate", () => {
        this.totalDuration = audio.duration;
        this.musicDuration = audio.currentTime;
        if (audio.currentTime >= audio.duration) {
          this.changeNextMusic();
        }
      });
      
      this.isPlay = true;
    },
    musicDurationChange() {
      if (this.totalDuration === 0) return;
      let audio = this.$refs.audio;
      audio.currentTime = this.musicDuration;
    },
    musicVolumeChange() {
      this.volumeChange(this.musicVolume / 100);
    },
    volumeChange(sum) {
      let audio = this.$refs.audio;
      audio.volume = sum;
    },
    silence() {
      if (this.musicVolume !== 0) {
        this.volumeChange(0);
        this.musicVolume = 0;
      } else {
        this.volumeChange(0.2);
        this.musicVolume = 20;
      }
    },
    playMusic() {
      let audio = this.$refs.audio;
      if (this.musicUrl !== "") {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      }
      this.isPlay = !this.isPlay;
    },
    changeNextMusic() {
      const nextOne =
        this.playListInfo[
          this.playListInfo.findIndex((target) => {
            return target === this.curId;
          }) + 1
        ];
      this.setSongListInfo(this.playListInfo, nextOne);
    },
    changePrevMusic() {
      const prevOne =
        this.playListInfo[
          this.playListInfo.findIndex((target) => {
            return target === this.curId;
          }) - 1
        ];
      this.setSongListInfo(this.playListInfo, prevOne);
    },
    //获得searchData,使用$router去搜索页
    toSearchPage() {
      let value=this.searchData.trim();
      if(value===''){
        return this.$message("未输入信息");
      }
      console.log(this.searchData);
      this.$router.push("/search/"+encodeURIComponent(this.searchData));
      // this.testAxios();
      console.log("goto");

    },
    async testAxios(){

      let {data:res}=await this.$axios.get("/song/url?id=233931");
      res=res.data[0];
      this.setMusicUrl(res.url,res);
      
    },
    logout(){},
    getUserPrivateList(){},
    setSongListInfo(){},
    tomusicDetailPage(){},
    showCurrentPlayList(){},
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
  .el-input{
    width:275px;
  }
  /deep/ .el-input__inner{
    opacity:0.4;
    margin-top:15px;
    margin-left:50px;
    width:225px;
    height:25px;
    border-radius:12px;
  }
  .searchBtn{
    opacity:0;
    position:absolute;
    float:right;
    width:1px;
    height:24px;
    left:-3px;
    margin-top:15px !important;
    border-radius: 60%;
  }
  .rightContainer{
    margin-left:auto ;
    span{
      font-size:17px;
      color:white;
    }

    .userIcon{
      width:30px;
      height:30px;
      border-radius:60%;
      margin-top:13px;
      margin-right:10px;
    }
  }
}

/deep/ .el-menu-item-group__title{
  padding-left:5px !important;
  margin-top:7px;
}
.el-menu-item{
  height:45px;
  line-height:3.45em;
}
.el-menu-item.is-active{
  color:black;
  border-left:2px solid red !important;
}
.el-menu{
  height:90%;
}
.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover{
  box-shadow: 0 0 0 0 ;
}
/deep/ .el-slider__button{
  border:2px solid rgb(198,47,47) !important;
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
