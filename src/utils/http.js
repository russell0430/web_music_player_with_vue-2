import axios from "axios"
let baseURL = 'http://localhost:4000/'
let http = axios.create({
  baseURL,
  headers: {},
  timeout:5000,
});
http.interceptors.request.use(config => {
  config.data = config.data || {};
  // console.log(config);
  return config;
});
http.interceptors.response.use(response => {
  const res = response.data;
  // console.log(response);
  if (res.code!==200) {
    // console.log(res);
    // let resObject=eval(res.data);
    return Promise.reject(res);
  } else {
    return res;
  }
},error=>{
  return Promise.reject(error);
});

export default http;