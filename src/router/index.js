import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login')
  },
  {
    path: '/admin',
    name: '/',
    component: () => import('../layout'),
    redirect: '/admin/users',
    children: [
      {
        path: 'users',
        name: '用户列表',
        component: () => import('@/views/users/index.vue')
      },
      {
        path: 'ordersList',
        name: '订单列表',
        component: () => import('@/views/orders/ordersList.vue')
      },
      {
        path: 'ordersIncome',
        name: '营收统计',
        component: () => import('@/views/orders/ordersIncome.vue')
      },
      {
        path: 'categoryList',
        name: '分类列表',
        component: () => import('@/views/goods/categoryList.vue')
      },
      {
        path: 'productDetails',
        name: '商品详情',
        component: () => import('@/views/goods/productDetails.vue')
      },
      {
        path: 'carouselList',
        name: '轮播图管理',
        component: () => import('@/views/imgs/carouselList.vue')
      },
      {
        path: 'productImageList',
        name: '商品图片管理',
        component: () => import('@/views/imgs/productImageList.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
