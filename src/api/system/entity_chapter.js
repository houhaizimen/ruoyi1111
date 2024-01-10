import request from '@/utils/request'

// 查询章节实体映射列表
export function listEntity_chapter(query) {
  return request({
    url: '/system/entity_chapter/list',
    method: 'get',
    params: query
  })
}

export function list_chapterList(query) {
  return request({
    url: '/system/chapter/listAll',
    method: 'get',
    params: query
  })
}

// 查询章节实体映射详细
export function getEntity_chapter(id) {
  return request({
    url: '/system/entity_chapter/' + id,
    method: 'get'
  })
}

// 新增章节实体映射
export function addEntity_chapter(data) {
  return request({
    url: '/system/entity_chapter',
    method: 'post',
    data: data
  })
}

// 修改章节实体映射
export function updateEntity_chapter(data) {
  return request({
    url: '/system/entity_chapter',
    method: 'put',
    data: data
  })
}

// 删除章节实体映射
export function delEntity_chapter(id) {
  return request({
    url: '/system/entity_chapter/' + id,
    method: 'delete'
  })
}
