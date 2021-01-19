export const routes = [
    {   //首页
        path: '/',
        component: () => import('../views/Index'),
        children: [
            {//home页
                path: '/',
                component: () => import('../views/Home'),
            },
            {//菜单页
                path: '/menu',
                component: () => import('../views/Menu'),
            },
            {//购物车
                path: '/shopcart',
                component: () => import('../views/Shopcart'),
            },
            {//我的页
                path: '/mine',
                component: () => import('../views/Mine'),
            },
        ]
    },
    {   //登录
        path: '/login',
        component: () => import('../views/Login'),
    }
]