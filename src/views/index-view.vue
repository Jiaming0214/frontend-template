<script setup lang="ts">
import Header from "@/components/main/header.vue"
import Aside from "@/components/main/asider.vue"
</script>

<template>
  <div>
    <el-container class="h-screen">
      <el-header class="bg-slate-100">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px" class="bg-gray-100">
          <el-scrollbar>
            <Aside />
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>