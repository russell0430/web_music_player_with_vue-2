<template>
  <el-container style="margin-top: 25px; margin-bottom: 45px">
    <el-header height="100px">
      <!-- 轮播图 -->
      <el-carousel type="card" height="100px">
        <el-carousel-item v-for="(item, index) in bannerInfo">
          <el-image
            @click="onClickBanner(item)"
            :src="item.imageUrl"
            fit="contain"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-header>
    <el-main>
      <el-row style="border-bottom: 2px solid rgb(230, 230, 230)">
        <p style="margin-bottom: 10px; font-size: 22px">推荐歌单</p>
      </el-row>
      <el-row :gutter="10">
        <el-col
          :span="4"
          v-for="(item, index) in musicList"
          style="margin-top: 20px; position: relative"
        >
          <div
            style="
              background: rgba(128, 128, 128, 0.2);
              color: white;
              width: 96%;
              position: absolute;
              z-index: 10;
              float: right;
            "
          >
            <div style="float: right">
              <i class="el-icon-headset" style="margin-right: 5px"></i>
              {{
                item.playCount >= 10000
                  ? (item.playCount/10000).toFixed(0) + "万"
                  : item.playCount
              }}
            </div>
          </div>
          <div>
            <el-image
              :src="item.coverImgUrl"
              @click="toSongListPage(item.id)"
              style="
                box-shadow: 0 0 2px 2px gray;
                border-radius: 10px;
                cursor: pointer;
              "
            >
            </el-image>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 25px">
        <el-col :span="12">
          <el-table
            :data="newMusicList.slice(0, 5)"
            stripe
            :show-header="false"
          >
            <el-table-column type="index">
              <template slot-scope="scope">{{
                "0" + (scope.$index + 1)
              }}</template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.picUrl"
                  @click="changeUrl(scope.row.id)"
                  style="width: 75px; height: 75px; cursor: pointer"
                ></el-image>
                <span
                  style="
                    position: absolute;
                    top: 25px;
                    font-size: 15px;
                    font-weight: 500;
                  "
                >
                  {{ scope.row.name }}
                </span>
                <span
                  @click="toSingerPage(scope.row)"
                  style="
                    cursor: pointer;
                    position: absolute;
                    bottom: 25px;
                    font-size: 12px;
                    font-weight: 500;
                  "
                >
                  {{ scope.row.song.artists[0].name }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <!--右侧-->
        <el-col :span="12">
          <el-table
            :data="newMusicList.slice(5)"
            stripe
            :show-header="false"
          >
            <el-table-column type="index">
              <template scope="scope">
                {{
                  scope.$index >= 4
                    ? scope.$index + 6
                    : "0" + (scope.$index + 6).toString()
                }}
              </template>
            </el-table-column>
            <el-table-column>
              <template scope="scope">
                <el-image
                  :src="scope.row.picUrl"
                  @click="changeUrl(scope.row.id)"
                  style="width: 75px; height: 75px; cursor: pointer"
                ></el-image>
                <i
                  class="el-icon-video-play"
                  @click="changeUrl(scope.row.id)"
                  style="
                    position: absolute;
                    font-size: 25px;
                    top: 35px;
                    left: 35px;
                    z-index: 10;
                    cursor: pointer;
                  "
                ></i>

                <span
                  style="
                    position: absolute;
                    top: 25px;
                    font-size: 15px;
                    font-weight: 500;
                  "
                >
                  {{ scope.row.name }}
                </span>

                <span
                  @click="toSingerPage(scope.row)"
                  style="
                    cursor: pointer;
                    position: absolute;
                    bottom: 25px;
                    font-size: 12px;
                    font-weight: 500;
                  "
                >
                  {{ scope.row.song.artists[0].name }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {getBanner, getHotPlaylist} from "../../../utils/api.js";
export default {
  data(){
    return {
      bannerInfo:[],
      musicUrl:'',
      music:{},
      newMusicList:[],
      musicList:[],
    }
  },
  props:{},
  created(){
    this.setBanner();
    this.getMusicList();
    // this.getNewMusicList();
  },
  methods:{
    async setBanner(){
      let res=await getBanner();
      this.bannerInfo=res.banners;
    },
    async getMusicList(){
      let res=await getHotPlaylist({cat:'全部',limit:10});
      this.musicList=res.playlists;
    },
    onClickBanner(item){
      console.log(item.targetId);
      // toSongDetail 进入详情页
      this.$router.push('/songdetail/'+item.targetId);

    }
  }
};
</script>
<style lang="less" scoped>
  [class*=el-col-]{
    // display:none;
    // float:none;
  }
  h1{
    font-weight: 500;
  }
</style>