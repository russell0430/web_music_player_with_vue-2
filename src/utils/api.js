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
  let res=musicId;
  if(musicId instanceof Array){
    res=res.join(",");
  }
  return request({
    url: '/song/detail',
    method: 'get',
    params: { ids: res },
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
function searchSong(queryInfo){
  return request({
    url:'/search',
    method:'get',
    params:queryInfo,
  });
}

function getHotPlaylist({cat="华语",limit=50,offset=0}){
  //这里中文使用正常传参无效，改拼接url
  return request({
    url:`/top/playlist?cat=${cat}&limit=${limit}&offset=${offset}`,
  });
}

function getSingerInfo(singerId){
  return request({
    url:'/artists',
    method:'get',
    params:{id:singerId},
  });
}
//params{id:singerId}
function getHotAlbum(params){
  return request({
    url:'/artist/ablum',
    method:'get',
    params,
  });
}
function getAlbum(albumId){
  return request({
    url:'/album',
    method:'get',
    params:{id:albumId},
  });
}
function getPlaylistDetail(playlistId){
  return request({
    url:'/playlist/detail',
    method:"get",
    params:{id:playlistId},
  });
}

export {
  searchSong,
  getSongById,
  getLyricById,
  getSongDetail,
  getTopSong,
  getBanner,
  getHotPlaylist,
  getSingerInfo,
  getHotAlbum,
  getAlbum,
  getPlaylistDetail,
};