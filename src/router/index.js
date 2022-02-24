import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from "../components/Main.vue"


import searchPage from "../components/findMusic/search/searchPage"
import searchBySong from "../components/findMusic/search/searchBySong.vue"
import searchBySinger from "../components/findMusic/search/searchBySinger.vue"
import searchByPlayList from "../components/findMusic/search/searchByPlayList.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: "/search/:data",
        component: searchPage,
        children: [
          {
            path: "/searchBySong/:data",
            component: searchBySong,
          },
          {
            path:"/searchBySinger/:data",
            component:searchBySinger,
          },
          {
            path:"/searchByPlayList/:data",
            component:searchByPlayList,
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
  routes,
})

export default router
