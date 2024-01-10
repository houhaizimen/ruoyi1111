import request from '@/utils/request'

// 查询图谱实体列表
export function listEntity(query) {
  return request({
    url: '/system/entity/list',
    method: 'get',
    params: query
  })
}
export function listEntityType(query){
  return request({
    url: '/system/type/listAll',
    method: 'get',
    params: query
  })
}
export function listShadowplayList(query){
  return request({
    url: '/system/museum/listAll',
    method: 'get',
    params: query
  })
}
// 查询图谱实体详细
export function getEntity(id) {
  return request({
    url: '/system/entity/' + id,
    method: 'get'
  })
}

// 新增图谱实体
export function addEntity(data) {
  return request({
    url: '/system/entity',
    method: 'post',
    data: data
  })
}

// 修改图谱实体
export function updateEntity(data) {
  return request({
    url: '/system/entity',
    method: 'put',
    data: data
  })
}

// 删除图谱实体
export function delEntity(id) {
  return request({
    url: '/system/entity/' + id,
    method: 'delete'
  })
}
