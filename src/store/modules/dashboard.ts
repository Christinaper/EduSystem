import { defineStore } from 'pinia'

export const useDashboardStore = defineStore(
  'dashboard',
  () => {
    /* ---------begin loading效果控制------------- */
    let _spinning_count = 0;
    const spinning = ref<boolean>(false)
    const beginSpinning = () => {
      _spinning_count ++;
      spinning.value = true
    };
    /* -----------end loading效果控制------------- */
    const endSpinning = () => {
      if(_spinning_count === 0) return;
      if(--_spinning_count === 0) spinning.value = false;
    };
    /* -----------begin: 用户功能获取----------------------- */
    const userFuncs = shallowRef<Func[]>([]);
    const getUserFuncs = async() => {
      userFuncs.value = await api.user.getUserFuncs(); // 获取菜单
    }
    const clearDashboard = () => {
      userFuncs.value = [];
    }
    /* -----------end: 用户功能获取----------------------- */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    const currentFuncName = ref<string>("");
    const changeCurrentFuncName = (name: string) => currentFuncName.value = name;
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    return { 
      spinning, beginSpinning, endSpinning, 
      userFuncs, getUserFuncs, clearDashboard,
      currentFuncName, changeCurrentFuncName
    }

  },
  { // 第三个参数，持久化使用
    // @ts-ignore
    persist: {
      enabled: true,
      strategies: [
        { key: 'dashboard', storage: sessionStorage }
      ]
    }
  }
)