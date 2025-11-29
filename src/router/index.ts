import { createRouter, createWebHistory } from 'vue-router'

// Views
import WelcomeView from '../views/WelcomeView.vue'
import SideSelectView from '../views/SideSelectView.vue'
import GuestListView from '../views/GuestListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/side',
      name: 'side-select',
      component: SideSelectView,
    },
    {
      // 只選到「男方 / 女方」，還沒挑分類
      path: '/guest/:side',
      name: 'category-list',
      component: GuestListView,
      props: true,
    },
    {
      // 已選擇分類
      path: '/guest/:side/:category',
      name: 'guest-list',
      component: GuestListView,
      props: true,
    },
    {
      // 直接分享到某位賓客的詳情
      path: '/guest/:side/:category/:person',
      name: 'guest-detail',
      component: GuestListView,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
