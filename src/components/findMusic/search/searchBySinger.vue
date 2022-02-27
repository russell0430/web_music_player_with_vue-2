<template>
  <div style="margin-bottom:75px">
    <el-row v-for="(item,index) in singerList" style="margin-top25px;" :key="item.id">
      <el-col :span="12" :offset="6" @click.native="toSingerPage(item.id)" 
        :style="index%2===0? 'background:rgb(245,245,247)': '' ">
        <el-image :src="item.picUrl" style="width:100px;height:100px;">
        </el-image>
        <span style="position:absolute;top:40%">{{item.name}}</span>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination style="display:block;width:20%;margin:15px auto;"
    layout="prev,pager,next" :total="singerTotal" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchData:decodeURIComponent(this.$route.params.data),
      queryInfo:{
        keywords:this.$route.params.data,
        limit:20,
        offset:0,
        type: 100,
        /* type
          默认为1
          1: 单曲 100:歌手 1000:歌单 1014:视频
        */

      },
      singerTotal:0,
      singerList:[],
    }
  },
  created(){
    this.getSingerResult();
  },
  methods:{
    async getSingerResult(){
      let {data:res}=await this.$axios.get('/search/',{params:this.queryInfo});
      console.log(res);
      this.singerList=res.result.artists;
      this.singerTotal=res.result.artistCount;
    },
    toSingerPage(id){
      console.log("tosingerpage");
      this.$router.push('/singer/'+id);
    },
    handleCurrentChange(newpage){
      this.queryInfo.offset=(newpage-1)*this.query.limit;
      if(this.queryInfo.offset>=this.songTotal) this.queryInfo.offset=this.songTotal;
      this.getSingerResult();
    }
  }

}
</script>

<style lang="less" scoped>
  .el-col:hover{
    background-color :rgb(235,236,233) !important;
    cursor:pointer;
  }
</style>