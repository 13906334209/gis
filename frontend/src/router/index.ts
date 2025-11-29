import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gis',
    name: 'Gis',
    component: () => import('../views/Gis.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/map-test',
    name: 'MapTest',
    component: () => import('../views/MapTest.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要登录但未登录，跳转到登录页
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // 已登录访问登录页，跳转到首页
    next('/');
  } else {
    next();
  }
});

export default router;

