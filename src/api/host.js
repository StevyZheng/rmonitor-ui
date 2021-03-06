import request from '@/utils/request'

export function apiHostGroups(data) {
  return request({
    url: '/api/v1/host_group/list',
    method: 'get',
    data
  })
}
export function apiGetHostNamesFromHostGroupName(data) {
  return request({
    url: '/api/v1/host_group/list_hosts',
    method: 'post',
    data
  })
}
export function apiAddHostGroup(data) {
  return request({
    url: '/api/v1/host_group/add_one',
    method: 'post',
    data
  })
}
export function apiAddHost(data) {
  return request({
    url: '/api/v1/host/add_one',
    method: 'post',
    data
  })
}
export function apiDelHost(data) {
  return request({
    url: '/api/v1/host/del_one',
    method: 'post',
    data
  })
}
