// // 使用export的方式导出很多工具函数
// export function arr2tree(arr: any, idKey: string, fKey: string, startFKey = 0, childKey = "children") {
//   if(!Array.isArray(arr)) throw new Error('arr2tree的第一个参数必须是数组');
//   let result: Array<object> = [];
//   let children = arr.filter(item => item[fKey] === startFKey);
//   if(children.length > 0) {
//       children.forEach(child => {
//           let newChild = {...child};
//           let grandsons = arr2tree(arr, idKey, fKey, newChild[idKey], childKey);
//           if(grandsons.length > 0) newChild[childKey] = grandsons;
//           result.push(newChild);
//       })
//   }
//   return result;
// }