import axios from "axios"
let http = axios.create({
  headers: {},
});
http.interceptors.request.use(config => {
  config.data = config || {};
  return config;
});
http.interceptors.response.use(response => {
  const res = response.data;
  if (!res.result) {
    return Promise.reject({
      code: res.errorCode,
      msg: res.txtMessage,
    })
  } else {
    return {
      response: res,
    }
  }
},error=>{
  return Promise.reject(error);
});
export default http;