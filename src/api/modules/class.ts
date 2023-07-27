import service from "../../utils/service";
/**
 * 查询所有班级信息（主要是学生管理页面要用）
 * @returns { Promise<Staff[]> } Promise 对象，返回员工列表数据
 */
// export const getAll = () => service({
//   url: '/class/all'
// }) as Promise<>

/**
 * 分页查询班级信息
 */
export const getList = (data: object) => service({
  url: '/class/list',
  method: 'post',
  data
}) as Promise<ClassList>

/**
 * 结课
 */
export const end = (data: object) => service({
  url: '/class/end',
  method: 'post',
  data
})

/**
 * 开课
 */
export const begin = (data: object) => service({
  url: '/class/begin',
  method: 'post',
  data
})

/**
 * 更新信息
 */
export const update = (data: object) => service({
  url: '/class/update',
  method: 'post',
  data
})

/**
 * 新增信息
 */
export const add = (data: object) => service({
  url: '/class/add',
  method: 'post',
  data
})