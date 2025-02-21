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

      <router-view v-slot="{ Component }">
        <transition name="el-fade-in-linear" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>

    </div>
    <!-- 右侧表单 结束 -->
  </div>
</template>

<style scoped>

</style>