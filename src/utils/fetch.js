import axios from 'axios';
import store from '../store';
import vue from 'vue';
import router from '../router';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (store.getters.token) {
        config.headers['X-Token'] = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code 为非 20000 是抛错 可结合自己业务进行修改
         */
        const res = response.data;
        if (res.code !== 0) {
            if (res.code === 50008) {// 50008:非法的 token; 50012:其他客户端登录了;  50014:Token 过期了;
                response.data.message = '非法的token,' + response.data.message;
            } else if (res.code === 50012) {// 50008:非法的 token; 50012:其他客户端登录了;  50014:Token 过期了;
                response.data.message = '其他客户端登录了,' + response.data.message;
            } else if (res.code === 50014) {// 50008:非法的 token; 50012:其他客户端登录了;  50014:Token 过期了;
                response.data.message = 'Token过期了,' + response.data.message;
            }
            return response.data;
        } else {
            return response.data;
        }
    },
    error => {
        console.log('err' + error);// for debug
        const responseItem = {
            code: "500",
            message: "网络错误",
            data: error,
        }
        return responseItem;
    }
)

export default service;
