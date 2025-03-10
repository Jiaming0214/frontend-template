<script setup lang="ts">
import {useAuthStore} from "@/stores/auth-store.ts";
import {get} from "@/axios/axios-config.ts";
import {ElMessage, type MenuItemRegistered} from "element-plus";
import {useRouter} from "vue-router";
import {computed} from "vue";

const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits<{
  (e: 'menu-change', item: MenuItemRegistered): void;
}>();

const handleLogout = async () => {
  get("/api/auth/logout", async data => {
    ElMessage.success(data)
    authStore.user = null
    await router.replace("/welcome");
  })
};

console.log(router.currentRoute)

const defaultActive = computed(() => {
  console.log("头部导航栏匹配到的路由信息：", router.currentRoute.value.matched)
  if(router.currentRoute.value.matched.length < 2) {
    return ''
  }
  return router.currentRoute.value.matched[1].name
})

// 获取用户一级菜单
const rootMenus = authStore.user?.menus?.filter(item => item.level === 1)

const handleMenuChange = (item: MenuItemRegistered) => {
  router.replace({ name: item.index })
  emit('menu-change', item)
}

</script>

<template>
  <div class="h-full flex justify-between items-center">
    <el-image src="nagi.svg" class="size-12"/>
    <el-menu mode="horizontal" class="w-3/5 !h-4/5 my-menu" :default-active="defaultActive">
      <el-menu-item index="person" @click="handleMenuChange">个人中心</el-menu-item>
      <el-menu-item v-for="menu in rootMenus" :key="menu.id" :index="menu.name" @click="handleMenuChange">
        {{ menu.zhName }}
      </el-menu-item>
    </el-menu>
    <div>
      <span class="mr-4">Hello, {{ authStore.user?.username }}</span>
      <el-button @click="handleLogout">退出登录</el-button>
    </div>
  </div>
</template>

<style scoped>
.my-menu {
  --el-menu-active-color: oklch(0.704 0.04 256.788);
}
</style>