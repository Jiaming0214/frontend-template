<script setup lang="ts">

</script>

<template>
  <div class="w-screen h-screen flex overflow-hidden">
    <!-- 左侧背景图片 开始 -->
    <div class="flex-1">
      <el-image class="w-full h-full" fit="cover" src="login-bg.jpg"/>
    </div>
    <!-- 左侧背景图片 结束 -->

    <!-- 右侧表单 开始 -->
    <div class="w-[400px] bg-white flex flex-col justify-center items-center">
      <transition name="el-fade-in-linear">
        <router-view v-slot="{ Component }">
          <component :is="Component"/>
        </router-view>
      </transition>
    </div>
    <!-- 右侧表单 结束 -->
  </div>
</template>

<style scoped>

</style>