<script setup lang="ts">
import Header from "@/components/main/header.vue"
import Aside from "@/components/main/asider.vue"
import {ref} from "vue";
import {useRouter} from "vue-router";
import type {MenuItemRegistered} from "element-plus";

const router = useRouter()

const selectedMenu = ref<MenuItemRegistered | null>(null);

const matchedRouter = router.currentRoute.value.matched

// 获取当前匹配的一级菜单
if(matchedRouter.length >= 3 && matchedRouter[1].name !== undefined) {
  const menuIndex: string = matchedRouter[1].name as string

  selectedMenu.value = {
    index: menuIndex,
    indexPath: [],
    active: true
  }
}

console.log("当前默认选中的一级菜单是", selectedMenu.value)

const handleMenuChange = (item:  MenuItemRegistered) => {
  selectedMenu.value = item
  console.log(item)
}

</script>

<template>
  <div>
    <el-container class="h-screen">
      <el-header class="bg-slate-100">
        <Header @menu-change="handleMenuChange" />
      </el-header>
      <el-container>
        <el-aside width="200px" class="bg-gray-100">
          <el-scrollbar>
            <Aside :selected-menu="selectedMenu"/>
          </el-scrollbar>
        </el-aside>
        <el-main class="h-full">
          <el-scrollbar>
            <router-view />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>