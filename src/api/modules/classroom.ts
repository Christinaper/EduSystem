import service from "../../utils/service";
/**
 * 
 * @returns 
 */
export const getAll = () => service({
  url: '/classroom/all' 
}) as Promise<Classroom[]>