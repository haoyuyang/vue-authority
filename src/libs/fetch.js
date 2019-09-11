import axios from 'axios';
// import env from '../../build/env';
import store from '../store';
import {router} from '../router/index';
import iView from 'iview';
import Cookies from 'js-cookie';
import {routers} from '../router/router'
// console.log(routers);
// http://115.159.117.231:8705
//http://10.92.193.188:8705
//http://49.235.51.93:8081
// 区分项目生产环境还是开发环境，匹配对应的API地址
const ajaxUrl = 'http://49.235.51.93:8081'//process.env.NODE_ENV === 'development' ? 'http://10.92.193.188:8705' : process.env.NODE_ENV === 'production' ? 'http://10.92.193.188:8705' : '';

// 创建axios实例
const service = axios.create({
    baseURL: ajaxUrl, // 域名URL
    // `headers` 是即将被发送的自定义请求头
    headers: {'Content-Type': 'application/json'},
    // 请求超时时间
    timeout: 30000,   
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    withCredentials: true, // 默认的
    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: 'json', // 默认的
    // `maxContentLength` 定义允许的响应内容的最大尺寸
    maxContentLength: 2000,
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
        // 对 data 进行任意转换处理
        return data;
    }]

});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.code == 207) {
        iView.Modal.info({
            title: '消息提示',
            content: 'Cookie过期，请重新登录',
            onOk: () => {
                store.commit('logout', this);
                Cookies.remove("token");
                store.commit('clearOpenedSubmenu');
                router.push({
                    name: 'login'
                });
            }
        });
    } else if (response.data.code == 403) {
        //iView.Message.error('您的权限不足');
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;
