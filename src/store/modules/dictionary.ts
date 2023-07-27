// 从pinia模块中导入defineStore函数，用于定义一个仓库
import { defineStore } from 'pinia'
import { DicGroupKey } from '../../enums';

export const useDictionaryStore = defineStore(
  'dictionary',
  // 定义一个匿名函数，用于返回仓库的状态和方法
  () => {
    const dicList = shallowRef<Dic[]>([]);
    let _isInit = ref<boolean>(false); // 标记是否已经初始化字典数据
    const init = async () => {
      if(_isInit.value) return; // 已初始化
      dicList.value = await api.dic.getAll();
      _isInit.value = true;
    }
    const getDicGroup = computed<(group_key: DicGroupKey) => Array<Dic>>(() => {
      return (group_key: DicGroupKey) => dicList.value.filter(dic => dic.dic_group_key === group_key);
    });
    return { 
      dicList, init, getDicGroup, _isInit
    }

  },
  { // 第三个参数，持久化使用
    // @ts-ignore
    persist: {
      enabled: true,
      strategies: [
        { key: 'dictionary', store: sessionStorage }
      ]
    }
  }
)