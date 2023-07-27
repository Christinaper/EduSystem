import service from "../../utils/service";
/**
 * 
 * @returns 
 */
export const getAll = () => service({
  url: '/role/all' 
}) as Promise<Role[]>
/**
 * 
 * @returns 
 */
export const add = (data: Role) => service({
  method: "post",
  url: '/role/add',
  data
}) as Promise<number>
/**
 * 
 * @returns 
 */
export const update = (data: Role) => service({
  method: "post",
  url: '/role/update',
  data
}) as Promise<null>

export const getRoleFuncs = (role_id: number) => service({url: `/role_function/list/${role_id}`}) as Promise<Func[]>
export const setRoleFuncs = (data: RoleFunc) => service({method: 'post', url: '/role_function/config', data}) as Promise<null>
// 删除
export const delRoleFuncs = (role_id: number) => service({url: `/role/remove/${role_id}`, method: "post"}) as Promise<number>