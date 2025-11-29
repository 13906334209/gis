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

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Requires authentication but not logged in, redirect to login page
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Already logged in, redirect to home page
    next('/');
  } else {
    next();
  }
});

export default router;

