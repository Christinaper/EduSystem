// @ts-ignore
import { arr2tree } from '../utils/common.js'

export const useAllFuncs = () => {
  const allFuncs = shallowRef<Func[]>([]);
  const treeData = computed<FuncTree>(() => 
    [{func_id: 0, func_name: "Root", func_key: "", func_fid: -1, children: arr2tree(allFuncs.value, 'func_id', 'func_fid')}]
  )
  const initOrRefreshAllFuncs = async() => allFuncs.value = await api.func.getAll();
  onMounted(initOrRefreshAllFuncs);

  return { allFuncs, treeData, initOrRefreshAllFuncs }
}


/**
 * 这段hook钩子函数的作用：
 * 实现一个角色功能分配的功能，让用户可以通过一个树形控件来查看和设置不同角色拥有的功能。
 * 功能是一种表示用户可以执行的操作的数据，比如查看、编辑、删除等。角色是一种表示用户的身份或权限的数据，
 * 比如管理员、普通用户、访客等。角色功能分配是一种让用户可以根据不同角色来分配不同功能的功能，
 * 比如管理员可以拥有所有功能，普通用户只能拥有部分功能，访客只能拥有查看功能等。
 */