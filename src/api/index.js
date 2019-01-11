import axios from 'axios'
const baseURL ='http://localhost:8888/api/private/v1/'
axios.defaults.baseURL =baseURL
// 添加请求拦截器 这里使用token
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('mykey')
    if(token){
        config.headers['Authorization'] = token
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
// 登录请求
export const checkUser = params => {
    return axios.post('login', params).then(res => res.data)
}
// 获取用户管理列表
export const getUserList = params => {
    return axios.get('users', params).then(res => res.data)
}
