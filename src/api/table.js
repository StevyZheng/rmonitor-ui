import request from '@/utils/request'

export function getList() {
  return request({
    url: 'http://www.roycom.com.cn:1991/api/v1/user/list',
    method: 'get'
  })
}
export function getRole() {
  return request({
    url: 'http://www.roycom.com.cn:1991/api/v1/role/list',
    method: 'get'
  })
}
