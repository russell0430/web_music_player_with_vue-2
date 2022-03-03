import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from "../components/Main.vue"


import searchPage from "../components/findMusic/search/searchPage"
import searchBySong from "../components/findMusic/search/searchBySong.vue"
import searchBySinger from "../components/findMusic/search/searchBySinger.vue"
import searchByPlayList from "../components/findMusic/search/searchByPlayList.vue"


import singerDetail from "../components/singer/singerDetail.vue"
import singerAlbum from "../components/singer/singerAlbum.vue"

import playSongDetail from "../components/playMusicPage/playMusicDetailPage.vue"

import recommendPage from "../components/findMusic/recommend/DiyRecommend.vue"
import songlist from "../components/findMusic/recommend/songList.vue"
import musicListTable from "../components/findMusic/recommend/musicListTable.vue";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    redirect: '/recommend',
    children: [
      {
        path: '/recommend',
        component: recommendPage,
      },
      {
        path: "/search/:data",
        component: searchPage,
        redirect:"/searchBySong/:data",
        children: [
          {
            path: "/searchBySong/:data",
            component: searchBySong,
          },
          {
            path: "/searchBySinger/:data",
            component: searchBySinger,
          },
          {
            path: "/searchByPlayList/:data",
            component: searchByPlayList,
          }
        ]
      },
      {
        path: "/singer/:data",
        component: singerDetail,
        redirect: "/album/:data",
        children: [
          {
            path: "/album/:data",
            component: singerAlbum,
          }
        ]
      },
      {
        path: "/songdetail/:data",
        component: playSongDetail,
      },
      {
        path:'/songlist/:data',
        redirect:'/musiclist/:data',
        component:songlist,
        children:[
          {
            path:"/musiclist/:data",
            component:musicListTable,
          }
        ]
      },
    ]
  },
]

const router = new VueRouter({
  routes,
})

export default router
