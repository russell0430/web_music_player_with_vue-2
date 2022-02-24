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
      <el-table-column lable="#" type="index">
        <template scope="scope">
          <img v-if="true" src="img/isPlay.png" alt="" />
          <p v-else>{{ scope.$index + 1 }}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="false" label="id" prop="id"></el-table-column> -->
      <el-table-column label="音乐标题" prop="name"></el-table-column>
      <el-table-column label="歌手" width="150px">
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
      <el-table-column label="专辑名" prop="album.name"></el-table-column>
      <el-table-column
        label="时长"
        prop="druation"
        width="80px"
      ></el-table-column>
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
      curId: parseInt(window.localStorage.getItem("curPlayMusicId")),
    };
  },
  created() {
    this.getSearchResult();
    // console.log("created");
    // console.log(this.$route.params.data);
  },
  methods: {
    async getSearchResult() {
      this.$axios
        .get("/search", {
          params: this.queryInfo,
        })
        .then((res) => {
          console.log(res);
          this.songList = res.data.result.songs;
          this.songTotal = res.data.result.songCount;
          // console.log(this.songList);

          // 这里可以使用过滤器
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
        });
    },
    async playMusic(row,col,event) {
      console.log(row,col,event);
      let {data:res}=await this.$axios.get("/song/url?id="+row.id);
      // console.log(res);
      console.log(this.$parent,"已发送")
      this.$parent.$parent.$parent.setMusicUrl(res.data[0].url,res.data[0].url);
      console.log(this.$parent,"已发送")
    },
    handleCurrentChange(e) {},
    toSingerPage(){},
  },
};
</script>

<style>
</style>