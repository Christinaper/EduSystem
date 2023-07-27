import service from "../../utils/service";
/**
 * 
 */
export const getList = (data: object) => service({
  url: '/student/list',
  method: 'post',
  data
}) as Promise<StudentList>

/**
 * 更新信息
 */
export const update = (data: object) => service({
  url: '/student/update',
  method: 'post',
  data
})

/**
 * 新增信息
 */
export const add = (data: object) => service({
  url: '/student/add',
  method: 'post',
  data
})

/**
 * 分班
 */
export const assignclass = (data: object) => service({
  url: '/student/assignclass',
  method: 'post',
  data
})

/**
 * 预上传学生图片
 */
export const avatarupload = (data: object) => service({
  url: '/student/avatarupload',
  method: 'post',
  data
})

/**
 * 上传学生图片
 */
export const avatarupdate = (data: object) => service({
  url: '/student/avatarupdate',
  method: 'post',
  data
})