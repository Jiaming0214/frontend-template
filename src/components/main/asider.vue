<script setup lang="ts">
import type {MenuItemRegistered} from "element-plus";
import {type IStoreMenu, useAuthStore} from "@/stores/auth-store.ts";
import {useRouter} from "vue-router";
import {computed} from "vue";

const props = defineProps<{
  selectedMenu: MenuItemRegistered | null
}>();

const authStore = useAuthStore()
const router = useRouter()

// 获取当前菜单的子菜单
const asideMenus = computed(() => {
  if(props.selectedMenu?.index === 'person' || props.selectedMenu === null) {
    return [{id: 1, name: 'person-info', zhName: '个人信息', children: [], level: 2}];
  }
  const rootMenu = authStore.user?.menus?.find(item => item.name === props.selectedMenu?.index)
  if(props.selectedMenu && props.selectedMenu.index !== 'person'){
    console.log("当前菜单的子菜单：", rootMenu?.children)
    return rootMenu?.children
  }
})

console.log("当前侧边栏内容：", asideMenus)

// 获取当前侧边栏的默认选中项
const defaultActive = computed(() => {
  console.log("侧部导航栏匹配到的路由信息：", router.currentRoute.value.matched);
  if (router.currentRoute.value.matched.length < 2) {
    return '';
  }
  const matchedName = router.currentRoute.value.matched[router.currentRoute.value.matched.length - 1].name;
  console.log("匹配到的路由名称：", matchedName);
  return matchedName;
});

// 菜单路由跳转
const handleMenuChange = (name: string) => {
  console.log("菜单路由跳转：", name)
  router.replace({ name: name })
}

</script>

<template>
  <el-menu class="my-menu" :default-active="defaultActive">
    <template v-for="menu in asideMenus">
      <template v-if="menu.children?.length">
        <el-sub-menu :index="menu.name">
          <template #title>{{ menu.zhName }}</template>
          <template v-for="child in menu.children">
            <el-menu-item :index="child.name" @click="() => handleMenuChange(child.name)">{{ child.zhName }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="menu.name" @click="() => handleMenuChange(menu.name)">{{ menu.zhName }}</el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<style scoped>
.my-menu {
  --el-menu-active-color: oklch(0.707 0.022 261.325);
}
</style>