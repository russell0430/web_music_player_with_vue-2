<template>
  <div style="margin-top: 50px; margin-bottom: 75px">
    <!-- 头部热门50首 -->
    <el-row>
      <el-col :span="4" >
        <el-image
          src="img/top50.png"
          style="width: 150px; height: 150px"
        ></el-image>
        <el-row>
          <el-tag
            class="el-icon-video-play"
            style="font-size: 20px; cursor: pointer"
            type="danger"
            @click="playHot50Music"
            >播放top50
          </el-tag>
        </el-row>
      </el-col>
      <el-col :span="14" :offset="4">
        <el-table :data="hot10Songs" style="width: 100%" stripe lazy>
          <el-table-column label="#" type="index">
            <template scope="scope">
              <img v-if="curId === scope.row.id" src="img/isPlay.png" alt="" />
              <p v-else>
                {{
                  scope.$index + 1 >= 10
                    ? scope.$index + 1
                    : ("0" + (scope.$index + 1)).toString()
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <i
                class="el-icon-star-off"
                style="font-size: 18px; cursor: pointer"
              ></i>
              <i
                class="el-icon-download"
                style="margin-left: 10px; font-size: 18px; cursor: pointer"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="name"></el-table-column>
          <el-table-column prop="dt"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getTopSong} from "../../utils/api.js"
export default {
  data() {
    return {
      curId: 0,
      queryInfo: {
        id: this.$route.params.id,
        limit: 4,
        offset: 0,
      },
      singerId: this.$route.params.id,
      hot10Songs: [],
      //展示,里面是object
      hot50Songs: [],
      //默认展示10首
      defaultShow: 10,
      curId: parseInt(window.localStorage.getItem("curPlayMusicID")),
      //歌手专辑信息(不含专辑内容)
      hotAlbum: [],
      //当前歌手专辑内歌曲信息
      albumMusicInfo: [],
    };
  },
  created() {
    console.log("singerAlbum");
    this.singerId = this.$route.params.data;
    this.getHot50Music();
    // console.log(this.hot50Songs);
  },
  methods: {
    async getHot50Music() {
      let res=await getTopSong(this.singerId,20);
      this.hot50Songs=res.songs;
      this.hot50Songs.forEach((item) => {
            const dt = new Date(item.dt);
            const mm = (dt.getMinutes() + "").padStart(2, "0");
            const ss = (dt.getSeconds() + "").padStart(2, "0");
            item.dt = mm + ":" + ss;
          });
      this.hot10Songs = this.hot50Songs.slice(0, 10);
    },
    changeDefaultNum() {
      //将show取消
      this.defaultShow = 50;
    },
    async getHotAlbum() {
      this.$axios
        .get("/artist/album", { params: this.queryInfo, limit: 10 })
        .then((res) => {
          this.hotAlbum = res.data.hotAlbums;

          this.hotAlbum.forEach((item) => {
            this.$axios
              .get("/album", { params: { id: item.id } })
              .then((res) => {
                res.data.songs.forEach((item) => {
                  const dt = new Date(item.dt);
                  const mm = (dt.getMinutes() + "").padStart(2, "0");
                  const ss = (dt.getSeconds() + "").padStart(2, "0");

                  item.dt = mm + ":" + ss;
                });
                this.albumMusicInfo.push(res.data);
              });
          });
          //处理时长数据
          this.hotAlbum.forEach((item) => {
            const dt = new Date(item.dt);
            const mm = (dt.getMinutes() + "").padStart(2, "0");
            const ss = (dt.getSeconds() + "").padStart(2, "0");

            item.dt = mm + ":" + ss;
          });
        });
    },

    handleCurrentChange(newpage) {
      this.queryInfo.offset = (newpage - 1) * this.queryInfo.limit;
      this.getHotAlbum();
    },
    //播放top50歌曲,数组传值,只传送歌曲id
    playHot50Music(row) {
      let playList = this.hot50Songs.map((item) => item.id);
      this.$emit("setSongListInfo", playList);
    },
    playAlbumMusic(row) {
      console.log(this.albumMusicInfo);
      
      // this.$emit(
      //   "setSongListInfo",
      //   window.localStorage.getItem("playList"),
      //   row.id
      // );
    },
  },
};
</script>

<style>
</style>