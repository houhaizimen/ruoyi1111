import request from '@/utils/request'

// 查询微信用户列表
export function listWx_user(query) {
  return request({
    url: '/system/wx_user/list',
    method: 'get',
    params: query
  })
}

// 查询微信用户详细
export function getWx_user(userId) {
  return request({
    url: '/system/wx_user/' + userId,
    method: 'get'
  })
}

// 新增微信用户
export function addWx_user(data) {
  return request({
    url: '/system/wx_user',
    method: 'post',
    data: data
  })
}

// 修改微信用户
export function updateWx_user(data) {
  return request({
    url: '/system/wx_user',
    method: 'put',
    data: data
  })
}

// 删除微信用户
export function delWx_user(userId) {
  return request({
    url: '/system/wx_user/' + userId,
    method: 'delete'
  })
}
