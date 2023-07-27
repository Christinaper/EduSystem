// 使用export的方式导出很多工具函数
// 5个参数
/**
 * 
 * @param {*} arr 要转换的数组
 * @param {*} idKey 数组元素的唯一标识属性
 * @param {*} fKey 数组元素的父级标识属性
 * @param {*} startFKey 根节点的父级标识值，默认为0
 * @param {*} childKey 树节点的子节点属性，默认为children
 * @returns 
 */
// arr: [0 1] 'func_id', 'func_fid' 默认 默认
export function arr2tree(arr, idKey, fKey, startFKey = 0, childKey = "children") {
  // 如果arr不是一个数组，就抛出一个错误
  if(!Array.isArray(arr)) throw new Error('arr2tree的第一个参数必须是数组');
  // 定义一个空数组，用于存储转换后的树形结构
  let result = [];
  // 使用数组的filter方法，筛选出arr中fKey属性等于startFKey的元素，即根节点的直接子节点，并赋值给一个变量children
  let children = arr.filter(item => item[fKey] === startFKey);
  if(children.length > 0) {
      children.forEach(child => {
          let newChild = {...child};
          // arr 'func_id' 'func_id'   默认
          let grandsons = arr2tree(arr, idKey, fKey, newChild[idKey], childKey);
          if(grandsons.length > 0) newChild[childKey] = grandsons;
          result.push(newChild);
      })
  }
  return result;
}
