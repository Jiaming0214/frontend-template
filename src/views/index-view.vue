<script setup lang="ts">
import { get } from "@/axios/axios-config.ts";
import {ElMessage} from "element-plus";
import router from '@/router'
import {useAuthStore} from "@/stores/auth-store.ts";

const authStore = useAuthStore()

const handleLogout = async () => {
  get("/api/auth/logout",  async data => {
    ElMessage.success(data)
    authStore.user = null
    await router.replace("/");
  })

};
</script>

<template>
  <div>这是首页</div>
  <div>
    <el-button @click="handleLogout">退出登录</el-button>
  </div>
</template>

<style scoped>

</style>