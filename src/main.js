import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
// import store from './store'
import "./plugins/element_ui"
import axios from "axios"


Vue.config.productionTip = false

Vue.prototype.$axios=axios
axios.defaults.baseURL = 'http://localhost:4000/' 

//全局vue过滤器(时间戳过滤器)
Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
  const d = (dt.getDay() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//全局vue过滤器(时间戳过滤器成2020-08-23)
Vue.filter('dateFormatToYMD',function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
  const d = (dt.getDay() + '').padStart(2,'0')


  return `${y}-${m}-${d}`
})

//全局过滤器(秒数转化为分钟)
Vue.filter('timeFormat',function (time) {

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
return `${minutes}:${seconds}`;
})

//监听localstorage中的 curPlayMusicId
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'curPlayMusicId') {

      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent');
      const storage = {
          setItem: function (k, val) {
              localStorage.setItem(k, val);

              // 初始化创建的事件
              newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

              // 派发对象
              window.dispatchEvent(newStorageEvent)
          }
      }
      return storage.setItem(key, newVal);
  }else if(key === 'currentId'){
      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent');
      const storage = {
          setItem: function (k, val) {
              localStorage.setItem(k, val);

              // 初始化创建的事件
              newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

              // 派发对象
              window.dispatchEvent(newStorageEvent)
          }
      }
      return storage.setItem(key, newVal);
  }
}

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
