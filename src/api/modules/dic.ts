import service from "../../utils/service";
/**
 * 
 * @returns 
 */
export const getAll = () => service({
  url: '/dictionary/all' 
}) as Promise<Dic[]>