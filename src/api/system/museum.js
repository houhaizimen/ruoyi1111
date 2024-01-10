import request from '@/utils/request'

// 查询皮影信息f列表
export function listMuseum(query) {
  return request({
    url: '/system/museum/list',
    method: 'get',
    params: query
  })
}

// 查询皮影信息f详细
export function getMuseum(id) {
  return request({
    url: '/system/museum/' + id,
    method: 'get'
  })
}

// 新增皮影信息f
export function addMuseum(data) {
  return request({
    url: '/system/museum',
    method: 'post',
    data: data
  })
}

// 修改皮影信息f
export function updateMuseum(data) {
  return request({
    url: '/system/museum',
    method: 'put',
    data: data
  })
}

// 删除皮影信息f
export function delMuseum(id) {
  return request({
    url: '/system/museum/' + id,
    method: 'delete'
  })
}
