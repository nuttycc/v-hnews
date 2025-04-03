import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import * as Sentry from '@sentry/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15,
      refetchOnWindowFocus: true,
    },
  },
})

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://6b652b8540e0bae800a876820bd1025c@o4509054520852480.ingest.us.sentry.io/4509054617452544',
})

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
