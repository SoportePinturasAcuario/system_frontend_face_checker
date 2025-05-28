import { createRouter, createWebHistory } from 'vue-router'
import { useCollaboratorsStore } from '@/stores/collaborators';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      component: () => import('../views/Setting.vue'),
    },
    {
      path: '/scanner',
      name: '/scanner',
      component: () => import('../views/Scanner.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found'
    }
  ],
})
router.beforeEach(async (to) => {
  const publicPages = ['/'];
  const isPublicPage = !publicPages.includes(to.path);
  const statusStore = useCollaboratorsStore();
  if (statusStore.status === true && !isPublicPage) {
    return '/scanner';
  } else if (isPublicPage && statusStore.status === false) {
    return '/';
  }
})
export default router
