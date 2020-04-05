import request from '@/utils/request'

export function apiLogin(data) {
  return request({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}

export function apiGetUserFromToken(token) {
  return request({
    url: '/api/v1/user/find_name',
    method: 'get'
  })
}

export function apiGetUsers(token) {
  return request({
    url: '/api/v1/user/list',
    method: 'get'
  })
}
export function apiAddUser(data) {
  return request({
    url: '/api/v1/user/add_one',
    method: 'post',
    data
  })
}
export function apiDeleteUser(data) {
  return request({
    url: '/api/v1/user/del_one',
    method: 'post',
    data
  })
}
export function apiDeleteUsers(data) {
  return request({
    url: '/api/v1/user/del_many',
    method: 'post',
    data
  })
}
export function apiEditUser(data) {
  return request({
    url: '/api/v1/user/update_one',
    method: 'post',
    data
  })
}
export function apiGetRoles(token) {
  return request({
    url: '/api/v1/role/list',
    method: 'get'
  })
}
export function apiAddRole(data) {
  return request({
    url: '/api/v1/role/add_one',
    method: 'post',
    data
  })
}
export function apiDeleteRole(data) {
  return request({
    url: '/api/v1/role/del_one',
    method: 'post',
    data
  })
}
export function apiDeleteRoles(data) {
  return request({
    url: '/api/v1/role/del_many',
    method: 'post',
    data
  })
}
export function apiEditRole(data) {
  return request({
    url: '/api/v1/role/update_one',
    method: 'post',
    data
  })
}
export function apiLogout() {
  return request({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}
