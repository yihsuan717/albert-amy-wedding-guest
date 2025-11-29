import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

const preloader = document.getElementById('preloader')

if (preloader) {
  const DURATION = (window as any).__PRELOAD_DURATION__ ?? 2200

  // 在 index.html 裡用 window.__preloaderStart 記錄的時間
  const start = (window as any).__preloaderStart ?? performance.now()
  const elapsed = performance.now() - start
  const remaining = Math.max(0, DURATION - elapsed)

  const hidePreloader = () => {
    if (!preloader.parentElement) return

    // 下一個 frame 再加 class，避免 layout 還沒完成時 transition 抽風
    requestAnimationFrame(() => {
      preloader.classList.add('preloader--fadeout')
    })
    // 等淡出 transition 結束再真的把節點移掉
    preloader.addEventListener(
      'transitionend',
      () => {
        preloader.remove()
      },
      { once: true },
    )
  }

  setTimeout(hidePreloader, remaining)
}
