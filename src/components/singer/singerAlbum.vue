<template>
  <div style="margin-top: 50px; margin-bottom: 75px">
    <!-- 头部热门50首 -->
    <el-row>
      <el-col :span="4">
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
        <el-table
          :data="hot10Songs"
          style="width: 100%"
          stripe
          @row-click="doubleClick"
        >
          <el-table-column lable="#" type="index" :span="1">
            <template scope="scope">
              <img
                v-if="scope.row.id == curMusicId"
                src="img/isPlay.png"
                alt=""
              />
              <p v-else>{{ scope.$index + 1 }}</p>
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
import { mapActions, mapMutations, mapState } from "vuex";
import { getTopSong, getHotAlbum, getAlbum } from "../../utils/api.js";
export default {
  data() {
    return {
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
  computed: {
    ...mapState(["curMusicId"]),
  },
  created() {
    // console.log("singerAlbum");
    this.singerId = this.$route.params.data;
    this.setHot50Music();
    // this.setHotAlbum();
    // console.log(this.hot50Songs);
  },
  methods: {
    ...mapMutations(["setPlaylist", "changePlayStatus"]),
    ...mapActions(["startPlaylist", "playMusicById"]),
    async setHot50Music() {
      let res = await getTopSong(this.singerId, 20);
      this.hot50Songs = res.songs;
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
    async setHotAlbum() {
      let albums = await getHotAlbum({ params: this.queryInfo, limit: 10 });
      this.hotAlbum = albums.hotAlbums;
      let tmp = this.hotAlbum.map(async (item) => await getAlbum(item.id));
      console.log(tmp);
      // this.$axios
      //   .get("/artist/album", { params: this.queryInfo, limit: 10 })
      //   .then((res) => {
      //     this.hotAlbum = res.data.hotAlbums;

      //     this.hotAlbum.forEach((item) => {
      //       this.$axios
      //         .get("/album", { params: { id: item.id } })
      //         .then((res) => {
      //           res.data.songs.forEach((item) => {
      //             const dt = new Date(item.dt);
      //             const mm = (dt.getMinutes() + "").padStart(2, "0");
      //             const ss = (dt.getSeconds() + "").padStart(2, "0");

      //             item.dt = mm + ":" + ss;
      //           });
      //           this.albumMusicInfo.push(res.data);
      //         });
      //     });
      //     //处理时长数据
      //     this.hotAlbum.forEach((item) => {
      //       const dt = new Date(item.dt);
      //       const mm = (dt.getMinutes() + "").padStart(2, "0");
      //       const ss = (dt.getSeconds() + "").padStart(2, "0");

      //       item.dt = mm + ":" + ss;
      //     });
      //   });
    },
    onclick() {
      console.log(1);
    },
    doubleClick(row, col, event) {
      // console.log("click");
      console.log(row.id, col);
      this.playMusicById({ id: row.id });
    },
    handleCurrentChange(newpage) {
      this.queryInfo.offset = (newpage - 1) * this.queryInfo.limit;
      this.setHotAlbum();
    },
    //播放top50歌曲,数组传值,只传送歌曲id
    playHot50Music(row) {
      let playlist = this.hot50Songs.map((item) => item.id);
      // console.log(playlist);
      this.setPlaylist(playlist);
      this.startPlaylist();
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