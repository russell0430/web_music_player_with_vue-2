<template>
  <el-container>
    <el-header height="320px;">
      <el-row :span="5">
        <el-image
          :src="singerInfo.artist.img1v1Url"
          style="width: 200px; height: 200px"
        ></el-image>

        <el-tag
          type="danger"
          style="
            position: absolute;
            left: 230px;
            border: 1px solid rgb(198, 47, 47);
            background-color: rgb(198, 47, 47);
            color: white;
          "
        >
          歌手
        </el-tag>
        <span
          style="position: absolute; left: 290px; top: 2px; font-size: 20px"
          >{{ singerInfo.artist.name }}</span
        >
        <i
          class="el-icon-headset"
          style="position: absolute; font-size: 15px; top: 60px; left: 230px"
        >
          单曲数: {{ singerInfo.artist.musicSize }}
        </i>
        <i
          class="el-icon-first-aid-kit"
          style="position: absolute; font-size: 15px; top: 100px; left: 230px"
        >
          专辑数: {{ singerInfo.artist.albumSize }}
        </i>
        <i
          class="el-icon-video-play"
          style="position: absolute; font-size: 15px; top: 140px; left: 230px"
        >
          MV数: {{ singerInfo.artist.mvSize }}
        </i>
        <el-tag
          class="el-icon-video-play" type="danger"
          style="position: absolute; font-size: 16px; top: 160px; left: 225px"
          @click="playAllMusic"
        >
          播放全部
        </el-tag>
      </el-row>
    </el-header>
    <el-main>
      <el-menu
        :default-active="/album/ + `${this.singerId}`"
        :router="true"
        mode="horizontal"
      >
        <el-menu-item :index="/album/ + `${this.singerId}`">专辑</el-menu-item>
        <el-menu-item :index="/singerMv/ + `${this.singerId}`">MV</el-menu-item>
        <el-menu-item :index="/singerDesc/ + `${this.singerId}`"
          >歌手详情</el-menu-item
        >
      </el-menu>
      <router-view @setSongListInfo="setSongListInfo"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {getSingerInfo} from "../../utils/api"
export default {
  data() {
    return {
      singerId: this.$route.params.data,
      singerInfo: {
        artist: {
          img1v1Url: "",
        },
      },
    };
  },
  created() {
    this.setSingerInfo();
  },
  methods: {
    async setSingerInfo() {
      let res;
      try {
        res=await getSingerInfo(this.singerId);
      }catch(err){
        console.log(err);
      }finally{
        this.singerInfo=res;
      }
    },
    setSongListInfo(playList) {
      this.$emit("setSongListInfo", playList);
    },
    playAllMusic(){
      
    }
  },
};
</script>


<style lang="less" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: 0px;
}

.el-menu-item.is-active {
  color: black;
  border-bottom: 2px solid red !important;
}
</style>