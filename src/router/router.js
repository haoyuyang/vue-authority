import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login -Management'
    },
    component: () =>
        import ('@/views/login.vue')
};
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/login',
    component: Main,
    children: [
        {
            path: 'addRole',
            title: '系统配置 / 角色管理',
            name: 'addRole',
            component: () =>
                import ('@/views/systemSettings/roleManage/addRole.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/systemSettings',
        icon: 'iconfont iconfont icon-xitongpeizhi',
        name: 'systemSettings',
        title: '系统配置',
        component: Main,
        children: [{
            path: 'roleManage',
            name: 'roleManage',
            title: '角色管理',
            component: () =>
                import ('@/views/systemSettings/roleManage/roleManage.vue')
        }, {
            path: 'accountManage',
            name: 'accountManage',
            title: '用户管理',
            component: () =>
                import ('@/views/systemSettings/accountManage/accountManage.vue')
        }, ]
    },


];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
];