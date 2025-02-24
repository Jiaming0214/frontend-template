import {createRouter, createWebHistory} from "vue-router"
import type {Router} from "vue-router"
import {useAuthStore} from "@/stores/auth-store.ts";

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "welcome",
            component: () => import("@/views/welcome-view.vue"),
            children: [
                {
                    path: '',
                    name: 'welcome-login',
                    component: () => import("@/components/welcome/login.vue")
                },
                {
                    path: 'register',
                    name: 'welcome-register',
                    component: () => import("@/components/welcome/register.vue")
                },
                {
                    path: 'forget',
                    name: 'welcome-forget',
                    component: () => import("@/components/welcome/forget.vue")
                }
            ]
        },
        {
            path: "/index",
            name: "index",
            component: () => import("@/views/index-view.vue")
        }
    ]
})

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    if (authStore.user !== null && to.fullPath.startsWith('welcome-')) {
        next("/index")
    } else if (authStore.user === null && to.fullPath.startsWith("/index")) {
        next("/")
    } else if (to.matched.length === 0) {
        next("/index")
    } else {
        next()
    }
})

export default router