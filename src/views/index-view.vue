<script setup lang="ts">
import httpRequest from "@/axios/axios-config.ts";
import {ElMessage} from "element-plus";
import router from '@/router'

const handleLogout = async () => {
  const { data } = await httpRequest.get("/api/auth/logout")
  ElMessage.success(data)
  await router.replace("/");
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