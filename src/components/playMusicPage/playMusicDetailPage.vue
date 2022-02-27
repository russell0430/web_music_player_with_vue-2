<template>
  <div>
    <el-row class="topInfo">
      <img src="" alt="" />
      <el-col :span="6">
        <el-image src="img/play-bar.png"></el-image>
        <el-image src="img/play-bar-middle.png"></el-image>
        <!-- 播放歌曲图片 -->
        <img
          :src="music.al.picUrl || ''"
          :class="['musicPoster', isPlay ? 'posterRotate' : '']"
          alt=""
          ref="musicPoster"
        />
      </el-col>
      <el-col :span="6" :offset="6" >
        <h1 style>{{ music.name }}</h1>
        <span>专辑:<span style="color: #4d99de;cursor: pointer" @click="toAlbumPage(music.al.id)"> {{ music.al.name }}</span></span>
        <span
          >  |歌手:
          <span style="color: #4d99de;cursor: pointer" @click="toSingerPage(music.ar[0].id)">{{music.ar[0].name}}</span>
        </span>
        <!-- 歌词 -->
        <div
          style="
            width: 350px;
            height: 350px;
            overflow: hidden;
            margin-top: 25px;
          "
        >
          <div style="overflow-y: auto">
            <ul ref="lyric">
              <li
                v-for="(item, i) in lyricObejct.ms"
                :style="{ color: lyricIndex === i ? 'red' : 'black' }"
              >
                {{ item.content }}
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-main style>
      <el-row>
        <el-col>
          <h4></h4>
          <div v-for="item in commentList">
            <div>
              <img src="" alt="" />
              <div>
                <p><span></span></p>
                <br />
              </div>
            </div>
          </div>
          <el-pagination></el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curId: this.$route.params.data,
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
      lrc: "",
      lyricObejct: {},
      //音乐进度条
      duration: "",
      //当前歌词的索引值
      lyricIndex: 0,
      rotate: false,
      deg: 0,
      play: this.isPlay,
      queryInfo: {
        id: 0,
        limit: 10,
        offset: 0,
      },
      commentList: [],
      total: 0,
    };
  },
  props: [
    "musicDuration",
    // 'curId',
    "isPlay",
  ],
  created() {
    this.getMusicDetail();
    this.getMusicLrc();
    // window.addEventListener
    this.getMusicComment();
  },
  mounted() {
    if (this.play) {
      console.log("poster play");
      this.rotate = true;
    }
  },
  watch: {
    musicDuration(newVal) {
      console.log(newVal,this.lyricIndex);
      if(!this.isPlay) return ;
      this.duration = newVal;
      //对每次进来的进度条进行判断
      // 跟下一句台词时长是否匹配,如果匹配则当前高亮的索引值+1
      //使用循环帮助****回退  快进****的判断
      let lrcArray=this.lyricObejct.ms;
      for (let i = 0; i < lrcArray.length; i++) {
        //这里使用小于符号判断是为了 保证回退音乐进度事件的效果实现性
        if (newVal <= parseFloat(lrcArray[i].time)) { 
          if (this.lyricIndex === i - 1) {
            break;
          }
          //找到比当前时间点 大一点的后一位的歌词的索引值
          this.lyricIndex = i - 1;
          //当前距离上方的距离  控制歌词上下滚动
          var currentTemp = this.$refs.lyric.style.marginTop;
          currentTemp = currentTemp.substr(0, currentTemp.length - 2);
          //滚动距离
          currentTemp = parseInt(currentTemp);
          if (i > 5) {
            //第五句歌词之后 开始使用定位
            /**
             * 例子
             * 第一句 margin-top 25px
             * 第二句 margin-top 50px
             * 第三句 margin-top 75px;
             * 以此类推
             *  ***计算出给一句歌词一个距离顶部的一个距离
             *  (每次只需要切换到当前距离顶部的位置 实现歌词滚动)
             *  顶部的位置 = 当前高亮歌词索引 * 25 +'px'   ***
             * @type {number}
             */
            currentTemp = (i - 5) * -35;
            //设置样式
            this.$refs.lyric.style.marginTop = currentTemp + "px";
          }
          //如果当前是最后一句歌词 代表歌曲要放送结束了 将我们的lyricIndex(当前歌词索引值还原成0便于下一曲使用)
          if (this.lyricIndex === lrcArray.length - 1) {
            this.lyricIndex = 0;
          }
          break;
        }
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.rotate);
    this.rotate = null;
    next();
  },
  methods: {
    getMusicDetail() {
      this.$axios
        .get("/song/detail", { params: { ids: this.curId } })
        .then((res) => {
          // console.log(res.data)
          this.music = res.data.songs[0];
        });
    },
    getMusicLrc() {
      this.$axios.get("lyric", { params: { id: this.curId } }).then((res) => {
        this.lrc = res.data.lrc.lyric;
        this.createLrcObject(this.lrc);
      });
    },
    //lrc是字符串
    createLrcObject(lrc) {
      if (lrc.length === 0) return;
      let lrcs = lrc.split("\n");
      // console.log(lrcs);
      let regex = /\[(\d{2}):(\d{2}\.\d{2,3})\]\s*(.*)\s*/;
      // console.log(lrcs[lrcs.length-3]);
      this.lyricObejct.ms = lrcs
        .filter((lrc) => lrc !== "")
        .map((lrc) => {
          let regexResult = regex.exec(lrc);
          return {
            time: (regexResult[1] * 60 + parseFloat(regexResult[2])).toFixed(3),
            content: regexResult[3] || "...............",
          };
        });
      // console.log(oLRC.ms);
    },
    toSingerPage(id) {
      this.$router.push("/singer/" + id);
    },
    toAlbumPage(){

    },
    getMusicComment() {
      this.$axios
        .get("/comment/music", { params: this.queryInfo })
        .then((res) => {
          this.commentList = res.data.comments;
          this.total = res.data.total;
        });
    },
    handleCurrentChange(newpage) {},
  },
};
</script>

<style lang="less" scoped>
.musicPoster {
  position: absolute;
  border: 45px solid black;
  border-radius: 50%;
  box-shadow: 0 0 5px 5px gray;
  width: 200px;
  height: 200px;
  top: 120px;
  left: 80px;
  z-index: -1;
}
.posterRotate {
  animation: spin 30s linear infinite;
  // animation-play-state:paused;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.topInfo {
  height: 600px;
}

li {
  list-style: none;
  margin-top: 15px;
}
</style>