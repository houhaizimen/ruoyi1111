import request from '@/utils/request'

// 查询大章id映射列表
export function listChapter(query) {
  return request({
    url: '/system/chapter/list',
    method: 'get',
    params: query
  })
}

// 查询大章id映射详细
export function getChapter(id) {
  return request({
    url: '/system/chapter/' + id,
    method: 'get'
  })
}

// 新增大章id映射
export function addChapter(data) {
  return request({
    url: '/system/chapter',
    method: 'post',
    data: data
  })
}

// 修改大章id映射
export function updateChapter(data) {
  return request({
    url: '/system/chapter',
    method: 'put',
    data: data
  })
}

// 删除大章id映射
export function delChapter(id) {
  return request({
    url: '/system/chapter/' + id,
    method: 'delete'
  })
}
