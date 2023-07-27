import service from "../../utils/service";
/**
 * 获取员工列表
 * @param { object } data
 * @returns { Promise<Staff[]> } Promise 对象，返回员工列表数据
 */
export const getList = (data: object) => service({
  url: '/staff/list',
  method: 'post',
  data
}) as Promise<StaffList>

/**
 * 离职员工
 */
export const dimission = (stf_id: Staff) => service({
  url: '/staff/dimission/' + stf_id
})

/**
 * 入职员工
 */
export const hire = (stf_id: Staff) => service({
  url: '/staff/reinstate/' + stf_id
})

/**
 * 更新信息
 */
export const update = (data: object) => service({
  url: '/staff/update',
  method: 'post',
  data
})

/**
 * 新增信息
 */
export const add = (data: object) => service({
  url: '/staff/add',
  method: 'post',
  data
})
