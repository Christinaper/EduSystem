import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
// import type { Router } from "vue-router";

// interface CustomRouter extends Router {
//   isInit: boolean;
// }

// 路由地图
const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: () => import('../views/Login/Login.vue') },
  { 
    path: "/home", name: "home", component: () => import('../views/Home/Home.vue'),
    children: []
  },
];

// 创建路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
}) 
// as CustomRouter; // 将路由对象断言为 CustomRouter 类型

// router.isInit = false; // 添加 isInit 属性并初始化为 false

router.beforeEach(async(to, from, next) => {
  // 如果是第一次进home，说明还没有进行动态路由配置
  // 或者已经进了home，然后点了浏览器的刷新按钮，那么动态路由会丢失
  // 如果目标路由的路径以 /home 开头并且路由对象的 isInit 属性为假（初始状态），则执行条件内的代码块。
  // @ts-ignore
  if(/^\/home/.test(to.path) && !router.isInit) {
    // 在条件内部，调用 store.dashboard.getUserFuncs() 异步获取用户功能列表。
    await store.dashboard.getUserFuncs();
    // 过滤 store.dashboard.menu 数组中具有 func_key 属性的项
    store.dashboard.userFuncs.filter(item => item.func_key).forEach(item => {
      // 这行代码的作用是将 item.func_key 字符串的首字母转换为大写，并与剩余部分拼接起来，形成一个新的字符串。
      // let name = item.func_key.slice(0, 1).toUpperCase() + item.func_key.slice(1);
      const name = item.func_key.replace(/^([a-z])/, (match, $1) => $1.toUpperCase())
                                .replace(/_([a-z])/g, (match, $1) => $1.toUpperCase())
      router.addRoute('home', {
        // path: `/${item.func_key}`,
        path: item.func_key,
        name: item.func_key,
        meta: {title: item.func_name},
        component: () => import(`../views/${name}/${name}.vue`)
      })
    })
    // 设置路由对象的 isInit 属性为真，表示已初始化。
    // @ts-ignore
    router.isInit = true;
    next({...to, replace: true});
  }
  else next();
})
router.afterEach((to, from) => {
  console.log(from);
  // @ts-ignore
  if(!['/login', '/home'].includes(to.path)) store.dashboard.changeCurrentFuncName(to.meta.title) });
// 导出路由对象
export default router;