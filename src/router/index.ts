import type {Router} from "vue-router"
import {createRouter, createWebHistory} from "vue-router"
import type {IStoreMenu} from "@/stores/auth-store.ts";
import {useAuthStore} from "@/stores/auth-store.ts";

console.log("router")

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "index",
            component: () => import("@/views/index-view.vue"),
            children: [
                {
                    path: 'person',
                    name: 'person',
                    redirect: '/person/info',
                    children: [
                        {
                            path: "info",
                            name: "person-info",
                            component: () => import("@/views/person/info-view.vue")
                        }
                    ]
                },
            ]
        },
        {
            path: "/welcome",
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
    ]
})

const Module = import.meta.glob("@/views/**/*")

const compilerMenu = (parentName: string, arr: Array<IStoreMenu> | undefined) => {
    if (arr === undefined || arr.length === 0) {
        return;
    }
    console.log("parentName:", parentName)
    arr.forEach(item => {
        if (!router.hasRoute(item.name)) {
            if (item.componentPath && item.componentPath !== '' && (item.componentPath !== undefined)) {
                router.addRoute(parentName, {
                    name: item.name,
                    path: item.path,
                    component: loadComponent(item.componentPath)
                })
            } else {
                const redirect = item.children && item.children.length ? '/' + item.path + '/' + item.children[0].path : ''
                router.addRoute(parentName, {
                    name: item.name,
                    path: item.path,
                    component: () => import("@/views/default-view.vue"),
                    redirect: redirect,
                    children: []
                })
            }

            if(item.children && item.children.length) {
                compilerMenu(item.name, item.children)
            }
        }
    })
}

const loadComponent = (componentPath: string) => {
    return Module[`/src/views${componentPath}.vue`]
}

// 动态路由刷新（加载）
const refreshRouter = () => {
    const authStore = useAuthStore()
    const menus = authStore.user?.menus
    compilerMenu("index", menus)
}

// 防止刷新页面时，路由丢失
if(window.sessionStorage.getItem('auth')) {
    const authInfo = JSON.parse(window.sessionStorage.getItem('auth') || '{}')
    if(authInfo.user?.menus) {
        compilerMenu("index", authInfo.user.menus)
    }
}

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()

    if (authStore.user !== null) { // 用户已登录
        if (to.fullPath.startsWith('/welcome')) {
            next("/");
        } else {
            refreshRouter()
            console.log("routers:", router.getRoutes())
            next()
        }
    } else {
        // 用户未登录
        if (to.fullPath.startsWith('/welcome')) {
            next();
        } else {
            next("/welcome")
        }
    }
})

export default router