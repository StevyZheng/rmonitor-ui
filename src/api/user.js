import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/user/list',
    method: 'get'
  })
}
export function handleAddUser(data) {
  return request({
    url: '/api/v1/user/add_one',
    method: 'post',
    data
  })
}
export function handleDeleteUser(data) {
  return request({
    url: '/api/v1/user/del_one',
    method: 'post',
    data
  })
}
export function handleDeleteUsers(data) {
  return request({
    url: '/api/v1/user/del_many',
    method: 'post',
    data
  })
}
export function handleEditUser(data) {
  return request({
    url: '/api/v1/user/update_one',
    method: 'post',
    data
  })
}
export function getRole(token) {
  return request({
    url: '/api/v1/role/list',
    method: 'get'
  })
}
export function handleAddRole(data) {
  return request({
    url: '/api/v1/role/add_one',
    method: 'post',
    data
  })
}
export function handleDeleteRole(data) {
  return request({
    url: '/api/v1/role/del_one',
    method: 'post',
    data
  })
}
export function handleEditRole(data) {
  return request({
    url: '/api/v1/role/update_one',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}
