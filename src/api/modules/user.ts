// import service from "@/utils/service";
import service from "../../utils/service";
/**
 * 
 * @param data 
 * @returns 
 */
export const login = (data: Login) => service({
  method: 'post',
  url: '/user/login',
  data
}) as Promise<string>;

/**
 * 
 * @returns 用户登录后获取菜单功能的数组 
 */
export const getUserFuncs = () => service({ 
  method: "post", 
  url: '/user/getmenu' }
) as Promise<Func[]>

/**
 * 分页查询用户
 */
export const getList = (data: object) => service({ 
  method: "post", 
  url: '/user/list',
  data
}) as Promise<UserList>

/**
 * 删除用户
 */
export const remove = (username: string) => service({ 
  method: "post", 
  url: '/user/remove/' + username,
})

/**
 * 用户角色分配
 */
export const config = (data: object) => service({ 
  method: "post", 
  url: '/user/config_role',
  data
})

/**
 * 新增用户
 */
export const add = (data: object) => service({ 
  method: "post", 
  url: '/user/add',
  data
})

/**
 * 管理员修改用户密码
 */
export const update = (data: object) => service({ 
  method: "post", 
  url: '/user/change_pwd',
  data
})

/**
 * 用户自己修改密码
 */
export const pwdchange = (data: object) => service({ 
  method: "post", 
  url: '/user/pwdchange',
  data
})