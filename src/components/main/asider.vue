<script setup lang="ts">
</script>

<template>
  <el-menu class="my-menu">
    <el-menu-item index="/person/info">个人信息</el-menu-item>
    <el-menu-item index="1">我的消息</el-menu-item>
  </el-menu>
</template>

<style scoped>
.my-menu {
  --el-menu-active-color: oklch(0.707 0.022 261.325);
}
</style>