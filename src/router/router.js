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
    },
    {//详情
        path: '/detail/:id',
        component: () => import('../views/Detail'),
        props: true
    },
    {//个人信息页
        path: '/myinformation',
        component: () => import('../views/Myinformation'),
    },
    {//个人收藏
        path: '/mycollect',
        component: () => import('../views/Mycollect'),
    },
    {//个人订单
        path: '/myorder',
        component: () => import('../views/Myorder'),
    },
    {//个人地址
        path: '/myaddr',
        component: () => import('../views/Myaddr'),
    },
    {//订单结算
        path: '/ordersettle',
        component: () => import('../views/Ordersettle'),
    },
    {//添加地址
        path: '/addaddress',
        component: () => import('../views/Addaddress'),
    },
    {//编辑地址
        path: '/editaddress/:id',
        component: () => import('../views/Editaddress'),
        props: true
    },
    {//安全中心
        path: '/secute',
        component: () => import('../views/Secute'),
        props: true
    },
    {
        //找回密码
        path: '/findpassword',
        component: () => import('../views/Findpassword'),
    }
]