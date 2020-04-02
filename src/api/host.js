import request from '@/utils/request'

export function hostGroupList(data) {
  return request({
    url: '/api/v1/host_group/list',
    method: 'get',
    data
  })
}

export function hostNameList(data) {
  return request({
    url: '/api/v1/host_group/list_hosts',
    method: 'post',
    data
  })
}
