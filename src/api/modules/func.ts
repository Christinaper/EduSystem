import service from "../../utils/service";
/**
 * 
 * @returns 
 */
export const getAll = () => service({
  url: '/function/all' 
}) as Promise<Func[]>

/**
 * 
 * @returns 
 */
export const update = (data: Func) => service({
  method: "post",
  url: '/function/update',
  data 
}) as Promise<null>

/**
 * 
 * @returns 
 */
export const add = (data: Func) => service({
  method: "post",
  url: '/function/add',
  data
}) as Promise<number>


/**
 * 
 * @returns 
 */
export const remove = (id: number) => service({
  url: `/function/remove/${id}`, 
  method: "post"
}) as Promise<number>