<template>
  <div style="margin-bottom: 75px">
    <el-table
      ref="playTable"
      :data="songList"
      hight-current-row
      border
      stripe
      style="cursor: context-menu"
      @row-dblclick="playMusic"
    >
      >
      <el-table-column lable="#" type="index" :span="1">
        <template scope="scope">
          <img v-if="scope.row.id == curMusicId" src="img/isPlay.png" alt="" />
          <p v-else>{{ scope.$index + 1 }}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="false" label="id" prop="id"></el-table-column> -->
      <el-table-column label="音乐标题" :span="4" prop="name"></el-table-column>
      <el-table-column label="歌手" :span="2">
        <template scope="scope">
          <span
            v-for="(item, index) in scope.row.artists"
            :key="item.id"
            style="cursor: pointer"
            @click="toSingerPage(item.id)"
          >
            {{
              index === 0 &&
              scope.row.artists.length > 1 &&
              index != scope.row.artists.length - 1
                ? item.name + "/"
                : item.name
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="专辑名"
        prop="album.name"
        :span="2"
      ></el-table-column>
      <el-table-column label="时长" prop="duration" :span="1"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      layout="prev,pager,next"
      :page-size="queryInfo.limit"
      :total="songTotal"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import{mapState,mapActions} from "vuex"
import { searchSong } from "../../../utils/api.js";
export default {
  data() {
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      queryInfo: {
        keywords: this.$route.params.data,
        limit: 30,
        offset: 0,
        type: 1,
        /* type
          默认为1
          1: 单曲 100:歌手 1000:歌单 1014:视频
        */
      },
      songTotal: 0,
      songList: [],
    };
  },
  computed: {
    ...mapState(["curMusicId"]),
  },
  //
  beforeRouteEnter(from, to, next) {
    //这里读不到this,使用下面的vm
    next((vm) => vm.getSearchResult());
    console.log("router");
  },
  // beforeRouteUpdate(from,to,next){
  //   this.getSearchResult();
  //   console.log("router update");
  //   next()
  // },
  created() {
    //不能在这里开,因为出来再进去就不会执行
    this.getSearchResult();
    // console.log("created");
    // console.log(this.$route.params.data);
  },
  methods: {
    async getSearchResult() {
      let {result:searchResult} = await searchSong(this.queryInfo);
      //
      console.log(searchResult);
      this.songList = searchResult.songs;
      this.songTotal = searchResult.songCount;
      //这里可以抽出去
      this.songList.forEach((item) => {
        var time = item.duration / 1000;
        //分钟
        var minute = time / 60;
        var minutes = parseInt(minute);
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        //秒
        var second = time % 60;
        var seconds = Math.round(second);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        item.duration = `${minutes}:${seconds}`;
      });
    },
    playMusic(row, col, event) {
      // console.log(row,col,event);
      //musicId=> row.id;
      // this.playMusicById({id:row.id});
      this.$router.push({path:"/songdetail/" + row.id}, onComplete => { }, onAbort => { });
      

      // console.log(this.$parent,"已发送")
    },
    handleCurrentChange(e) {},
    toSingerPage() {},
    ...mapActions([
      'playMusicById',
    ])
  },
};
</script>

<style>
</style>