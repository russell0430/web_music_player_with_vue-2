<template>
  <el-container style="margin-bottom: 55px">
    <el-header height="200px">
      <el-row height="180px">
        <!-- 标签和名字 -->
        <el-col :span="12" :offset="0">
          <el-tag type="danger" style="background-color: white">
            精品歌单
          </el-tag>
          <h2 style="font-weight: 300; display: inline; font-size: 20px">
            {{ currentSongList.name }}
          </h2>
          <!--作者信息-->
          <div
            style="
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin: 20px;
            "
          >
            <el-image
              :src="currentSongList.creator.avatarUrl"
              style="width: 35px; height: 35px; border-radius: 15px"
            >
            </el-image>
            <span>{{ currentSongList.creator.nickname }}</span>
            <span style="opacity: 0.7"
              >{{ currentSongList.createTime | dateFormat }}创建</span
            >

            <!--按钮组-->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-video-play"
              @click="playAllMusic"
            >
              播放全部
            </el-button>
          </div>

          <el-button
            icon="el-icon-folder-add"
            size="mini"
            @click="test"
            style="color: black"
          >
            收藏({{ currentSongList.subscribedCount }})
          </el-button>

          <el-button icon="el-icon-share" size="mini" style="color: black">
            分享({{ currentSongList.shareCount }})
          </el-button>

          <!--标签信息-->
          <span>
            标签:
            <span
              style="color: rgb(12, 115, 194); cursor: pointer"
              v-for="(item, index) in currentSongList.tags"
              >{{
                index + 1 === currentSongList.tags.length ? item : item + " / "
              }}</span
            >
          </span>

          <!--简介信息-->
          <el-collapse style="border: none">
            <el-collapse-item
              :title="
                '简介: ' +
                (currentSongList.description + '').substr(0, 26) +
                '...'
              "
            >
              <p
                style="
                  z-index: 999;
                  position: absolute;
                  background: aliceblue;
                  border-radius: 5px;
                "
              >
                {{ currentSongList.description }}
              </p>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <div style="float: right">
          <div style="color: gray">
            <div style="opacity: 0.6">
              <p>歌曲数|播放量</p>
              <p>
                {{ currentSongList.trackCount }} |
                {{ (currentSongList.playCount / 10000).toFixed(0) }}万
              </p>
            </div>
          </div>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <el-menu
        :default-active="/songlist/ + `${this.$route.params.data}`"
        class="el-menu-demo"
        mode="horizontal"
        style="width: 280px"
        :router="true"
      >
        <el-menu-item :index="/songlist/ + `${this.$route.params.data}`"
          >歌曲列表</el-menu-item
        >
        <el-menu-item index="2"
          >评论({{ currentSongList.commentCount }})</el-menu-item
        >
      </el-menu>
        <router-view
          ref="child"
          :trackIdList="currentSongList.trackIds"
        ></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapState ,mapActions, mapMutations} from "vuex";
import { getPlaylistDetail } from "../../../utils/api";
export default {
  data() {
    return {
      currentSongListId: this.$route.params.data,
      currentSongList: {
        //创建人信息
        creator: {
          avatarUrl: "",
          nickname: "",
        },
        trackIds: [],
      },
    };
  },
  computed: {
    ...mapState(["curMusicId"]),
  },
  created() {
    // this.setPlaylistDetail(this.playlistId);
  },
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter")
    let playlistId = to.params.data;
    console.log("to",playlistId);
    next(async (vm) => await vm.setPlaylistDetail(playlistId));
    // next();
  },
  // activated() {
  //   console.log("active")
  //   let playlistId = this.$route.params.data;
  //   console.log(playlistId);
  // },
  methods: {
    ...mapMutations([
      'setPlaylist',
    ]),
    ...mapActions([
      "startPlaylist",
    ]),
    async setPlaylistDetail(playlistId) {
      let res = await getPlaylistDetail(playlistId);
      // console.log(res);
      this.currentSongList = res.playlist;
    },
    setSongListInfo() {},
    playAllMusic(){
      let tmp=this.currentSongList.trackIds.map(item=>item.id).slice(0,20);//先切20个
      this.setPlaylist(tmp);
      this.startPlaylist();
    },
    test() {
      // console.log(this.currentSongList.trackIds);
      // this.currentSongList.trackIds=[];
    },
  },
};
</script>

<style>
</style>