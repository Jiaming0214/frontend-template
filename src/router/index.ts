import {createRouter, createWebHistory} from "vue-router"
import type {Router} from "vue-router"

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

export default router