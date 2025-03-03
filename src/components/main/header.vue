<script setup lang="ts">
import {useAuthStore} from "@/stores/auth-store.ts";
import {get} from "@/axios/axios-config.ts";
import {ElMessage, type MenuItemRegistered} from "element-plus";
import {useRouter} from "vue-router";

const authStore = useAuthStore()

const router = useRouter()

const handleLogout = async () => {
  get("/api/auth/logout", async data => {
    ElMessage.success(data)
    authStore.user = null
    await router.replace("/welcome");
  })
};

const handleMenuChange = (item: MenuItemRegistered) => {
  router.replace(item.index)
}

</script>

<template>
  <div class="h-full flex justify-between items-center">
    <el-image src="nagi.svg" class="size-12"/>
    <el-menu mode="horizontal" class="w-3/5 !h-4/5 my-menu">
      <el-menu-item index="/sysManagement/userManagement/userRoleManagement" @click="handleMenuChange">个人中心</el-menu-item>
      <el-menu-item index="/sysManagement/roleManagement" @click="handleMenuChange">系统管理</el-menu-item>
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