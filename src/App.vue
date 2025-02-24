<script setup lang="ts">
import { get } from "@/axios/axios-config.ts";

import { useAuthStore } from "@/stores/auth-store.ts";
import router from "@/router";

const authStore = useAuthStore()

if(authStore.user === null) {
  get("/api/user/me", data => {
    authStore.user = data
    router.replace("/index")
  }, _failure => {
    authStore.user = null
  })
}

</script>

<template>
  <router-view />
</template>

<style scoped>

</style>
