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
// 改变用户状态信息
export const changeUserState = params => {
  return axios.put(`users/${params.uid}/state/${params.type}`).then(res => res.data)
}
// 添加用户信息
export const addUser = params => {
  return axios.post('users', params).then(res => res.data)
}
// 根据ID查询用户信息
export const getUser = params => {
  return axios.get(`users/${params}`).then(res => res.data)
}
// 编辑用户提交
export const editUser = params => {
  return axios.put(`users/${params.id}`, params).then(res => res.data)
}
// 删除单个用户
export const deleteUser = params => {
  return axios.delete(`users/${params}`).then(res => res.data)
}
// 获取角色列表
export const getRolesList = params => {
  return axios.get('roles').then(res => res.data)
}
// 分配用户角色
export const assignUserRoles = params => {
  return axios.put(`users/${params.id}/role`, {id:params.id, rid:params.rid}).then(res => res.data)
}
// 所有权限列表
export const getRightsList = params => {
  return axios.get(`rights/${params.type}`).then(res => res.data)
}
// 删除角色指定权限
export const deleteRoleRight = params => {
  return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`).then(res => res.data)
}
// 角色授权
export const roleAuthorization = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, rids).then(res => res.data)
}
// 添加角色
export const addRole = params => {
  return axios.post('roles', params).then(res => res.data)
}
// 根据ID查询角色
export const getRoleById = params => {
  return axios.get(`roles/${params}`).then(res => res.data)
}
// 编辑提交角色
export const editRole = params => {
  return axios.put(`roles/${params.id}`, params).then(res => res.data)
}
// 删除角色
export const deletRole = params => {
  return axios.delete(`roles/${params}`).then(res => res.data)
}
