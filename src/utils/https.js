import axios from 'axios';
import { ElMessage } from 'element-plus';
import { BASE_URL } from './config';
import { getToken } from './auth'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 50000
})
// 数据请求拦截
http.interceptors.request.use((config) => {
  Object.assign({
    'Content-Type': 'application/json',
  }, config.headers);
  const token = getToken();
  token && (config.headers['Authorization'] = token);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 返回响应数据拦截
http.interceptors.response.use((res) => {
  console.log('成功响应数据拦截', res)
  const {data: {data}, status} = res;
  // 状态码为 2xx 范围时都会调用该函数，处理响应数据
  if (status === 200) {
    return Promise.resolve(data);
  }
}, (error) => {
  console.log('失败响应数据拦截', error)
  if (error.response.status) {
    // 状态码超过 2xx 范围时都会调用该函数，处理错误响应
    ElMessage({
      type: 'error',
      message: error,
      showClose: true
    })
    // switch (error.response.status) {
    //   case 404:
    //     ElMessage({
    //       type: 'error',
    //       message: '请求路径找不到！',
    //       showClose: true
    //     });
    //     break;
    //   case 502:
    //     ElMessage({
    //       type: 'error',
    //       message: '服务器内部报错！',
    //       showClose: true
    //     });
    //     break;
    //   default:
    //     break;
    // }
  }
  return Promise.reject(error);
});

export default http;
