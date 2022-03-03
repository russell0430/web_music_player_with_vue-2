<template>
  <el-table
    @click.native="test"
    ref="table"
    highlight-current-row
    border
    stripe
    :data="songList"
    style="cursor: context-menu"
    @row-dblclick="playSingleMusic"
  >
    <el-table-column label="#" type="index">
      <template scope="scope">
        <img v-if="curMusicId == scope.row.id" src="imgs/isPlay.png" alt="" />
        <p v-else>{{ scope.$index + 1 }}</p>
      </template>
    </el-table-column>
    <el-table-column v-if="false" label="id" prop="id"></el-table-column>
    <el-table-column label="音乐标题" prop="name"></el-table-column>

    <el-table-column label="歌手" prop="ar[0].name" width="80px;">
      <template scope="scope">
        <span
          v-for="(item, index) in scope.row.ar"
          style="cursor: pointer"
          @click="toSingerPage(item.id)"
        >
          {{
            index === 0 &&
            scope.row.ar.length > 1 &&
            index !== scope.row.ar.length - 1
              ? item.name + "/"
              : item.name
          }}
        </span>
      </template>
    </el-table-column>

    <el-table-column label="专辑名" prop="al.name"></el-table-column>

    <el-table-column label="时长" prop="duration" width="80px;"></el-table-column>
  </el-table>
</template>

<script>
import { mapState ,mapActions} from "vuex";
import { getSongDetail } from "../../../utils/api.js";
export default {
  data() {
    //一个歌单太多，控制个数
    return {
      musicListId: 0,
      OffsetStart: 0,
      musicCount: 10,
      musicCountTotal: 0,
      songList: [],
    };
  },
  props: {
    trackIdList: Array,
  },
  computed: {
    ...mapState(["curMusicId"]),
  },
  watch: {
    trackIdList(newval, oldval) {
      // console.log(newval);
      if(newval==oldval) return;
      let tmp = newval.slice(0, this.musicCount).map((item) => item.id);
      // console.log("tmp", tmp);
      // if(tmp.length===0) return [];
      let res = getSongDetail(tmp);
      res.then((Response) => {
        // console.log(Response);
        this.songList = Response.songs;
        this.songList.forEach((item) => {
          var time = item.dt / 1000;
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
      });
    },
  },
  created() {
    // this.setMusicList();
  },
  methods: {
    ...mapActions([
      'playMusicById',
    ]),
    setMusicList() {
      // console.log(this.trackIdList);
      // console.log("hello", this.musicCountList);
      if (this.trackIdList.length === 0) return;
      // let res= getSongDetail(this.musicCountList);
      // // console.log(res);
    },
    test() {
      console.log(this.musicCountList);
      // this.trackIdList=this.trackIdList.slice(0,10);
    },
    playSingleMusic(row,col,e){
      this.playMusicById({id:row.id});
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table_1_column_4 .cell {
  cursor: pointer !important;
}
</style>