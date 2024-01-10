import request from '@/utils/request'

// 查询实体连接列表
export function listConnection(query) {
  return request({
    url: '/system/connection/list',
    method: 'get',
    params: query
  })
}
// 查询关系类型列表
export function listRelation(query) {
  return request({
    url: '/system/relation/listAll',
    method: 'get',
    params: query
  })
}
// 查询实体连接详细
export function getConnection(id) {
  return request({
    url: '/system/connection/' + id,
    method: 'get'
  })
}

// 新增实体连接
export function addConnection(data) {
  return request({
    url: '/system/connection',
    method: 'post',
    data: data
  })
}

// 修改实体连接
export function updateConnection(data) {
  return request({
    url: '/system/connection',
    method: 'put',
    data: data
  })
}

// 删除实体连接
export function delConnection(id) {
  return request({
    url: '/system/connection/' + id,
    method: 'delete'
  })
}
