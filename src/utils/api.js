import request from "./http"
function getSongById(musicId) {
  //返回promise
  return request({
    url: "/song/url",
    method: 'get',
    params: { id: musicId },
  })
};

function getLyricById(musicId) {
  return request({
    url: '/lyric',
    method: 'get',
    params: { id: musicId },
  })
}

function getSongDetail(musicId) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: { ids: musicId },
  })
}

function getTopSong(singerId, topK = 10) {
  return request({
    url: '/artist/top/song',
    method: 'get',
    params: { id: singerId, limit: topK },
  })
}

function getSingerAlbum(singerId, limit = 50, offset = 0) {
  return request({
    url: '/artist/album',
    method: 'get',
    params: { id: singerId, limit, offset },
  });
}
//获取轮播图的资源
function getBanner(){
  return request({
    url:'/banner',
    method:'get',
  });
}

function getHotPlaylist({cat="华语",limit=50,offset=0}){
  //这里中文使用正常传参无效，改拼接url
  return request({
    url:`/top/playlist?cat=${cat}&limit=${limit}&offset=${offset}`,
  })
}
export {
  getSongById,
  getLyricById,
  getSongDetail,
  getTopSong,
  getBanner,
  getHotPlaylist,
};