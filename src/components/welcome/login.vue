<script setup lang="ts">
import {reactive, ref, toRaw} from 'vue'
import {User, Lock} from "@element-plus/icons-vue";
import {ElMessage, type FormInstance, type FormRules} from "element-plus";
import router from "@/router";
import {post} from "@/axios/axios-config.ts";

interface User {
  username: string,
  password: string,
  isRemember: boolean
}

const form = reactive<User>({
  username: '',
  password: '',
  isRemember: false
})

const ruleFormRef = ref<FormInstance>()

// 用户名验证
const validateUsername = (_rule: any, value: any, callback: any) => {
  if (value === '' || value.trim() === '') {
    callback(new Error('请输入用户名/邮箱'))
  } else if (value.includes(' ')) {
    callback(new Error('用户名不能包含空格'))
  }
  callback()
}

const rules = reactive<FormRules<User>>({
  username: [
    {validator: validateUsername, trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'}
  ]
})

// 登录按钮操作
const handleLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      const {data} = await post('/api/auth/login', toRaw(form))
      ElMessage.success(data)
      await router.replace('/index')
    }
  })
}
</script>

<template>
  <div class="w-4/5">
    <!-- 登录标题 开始 -->
    <div class="text-4xl font-bold mb-[8px] text-center">登录</div>
    <!-- 登录标题 结束 -->

    <!-- 登录信息 开始 -->
    <div class="w-full">
      <el-form ref="ruleFormRef" :model="form" class="max-w-[400px]" :rules="rules">
        <el-form-item prop="username">
          <el-input class="h-10" :prefix-icon="User" v-model="form.username" placeholder="请输入用户名/邮箱"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="h-10" :prefix-icon="Lock" v-model="form.password" placeholder="请输入密码"
                    type="password"/>
        </el-form-item>
        <el-form-item>
          <div class="w-full flex justify-between">
            <el-checkbox v-model="form.isRemember" label="记住我"/>
            <el-button link @click="router.replace('/forget')">忘记密码？</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 登录信息 结束 -->

    <!-- 按钮区域 开始 -->
    <div class="w-full">
      <el-button type="primary" class="w-full !h-10" @click="handleLogin(ruleFormRef)">登录</el-button>
      <el-divider>
        <div class="text-xs text-gray-400">还没账号？快速注册</div>
      </el-divider>
      <el-button class="w-full !h-10" @click="router.replace('/register')">注册</el-button>
    </div>
    <!-- 按钮区域 结束 -->
  </div>
</template>

<style scoped>

</style>