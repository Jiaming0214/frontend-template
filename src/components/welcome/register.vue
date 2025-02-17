<script setup lang="ts">
import {reactive, ref} from "vue";
import {Lock, User, Message} from "@element-plus/icons-vue";
import {type FormInstance, type FormRules, type FormItemProp, ElMessage} from "element-plus";
import router from '@/router'
import {post} from '@/axios/axios-config.ts'

interface RegisterForm {
  username: string,
  password: string,
  password2: string,
  email: string,
  verificationCode: string
}

const form = reactive<RegisterForm>({
  username: '',
  password: '',
  password2: '',
  email: '',
  verificationCode: ''
})

const ruleFormRef = ref<FormInstance>()

// 用户名验证
const validateUsername = (_rule: any, value: any, callback: any) => {
  if (value === '' || value.trim() === '') {
    callback(new Error('请输入用户名'))
  } else if (!/^[a-zA-Z0-9]{6,20}$/.test(value)) {
    callback(new Error('不能包含中文或特殊字符，且长度必须在6-20个字符之间'))
  } else {
    callback()
  }
}

const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.password !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('password2')
    }
    callback()
  }
}
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}


const rules = reactive<FormRules<RegisterForm>>({
  username: [
    {validator: validateUsername, trigger: ['blur', 'change']}
  ],
  password: [
    {validator: validatePass, trigger: ['blur', 'change']},
    {min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: ['blur', 'change']}
  ],
  password2: [
    {validator: validatePass2, trigger: ['blur', 'change']}
  ],
  email: [
    {required: true, message: '请输入电子邮箱地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的电子邮箱地址', trigger: ['blur', 'change']}
  ],
  verificationCode: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ]
})

const isEmailValid = ref(false)

const handleValid = (prop: FormItemProp, isValid: boolean) => {
  if (prop === 'email') {
    isEmailValid.value = isValid
  }
}

// 注册按钮操作
const handleRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      await router.replace('/')
    }
  })
}

// 获取验证码按钮单击后操作
const handleValidateEmail = async () => {
  const { data } = await post("/api/auth/valid-email", {
    email: form.email
  })
  ElMessage.success(data)
}
</script>

<template>
  <div class="w-4/5">
    <!-- 注册标题 开始 -->
    <div class="w-full text-4xl font-bold mb-[8px] text-center">注册</div>
    <!-- 注册标题 结束 -->

    <!-- 注册信息 开始 -->
    <div class="w-full">
      <el-form ref="ruleFormRef" :model="form" class="max-w-[400px]" :rules="rules" @validate="handleValid">
        <el-form-item prop="username">
          <el-input class="h-10" :prefix-icon="User" v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="h-10" :prefix-icon="Lock" v-model="form.password" placeholder="请输入密码"
                    type="password"/>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input class="h-10" :prefix-icon="Lock" v-model="form.password2" placeholder="请再次输入密码"
                    type="password"/>
        </el-form-item>
        <el-form-item prop="email">
          <el-input class="h-10" :prefix-icon="Message" v-model="form.email" placeholder="请输入电子邮箱地址"/>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input class="h-10" v-model="form.verificationCode" placeholder="请输入邮件中的验证码">
            <template #append>
              <el-button :disabled="!isEmailValid" @click="handleValidateEmail">获取验证码</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 注册信息 结束 -->

    <!-- 按钮区域 开始 -->
    <div class="w-full">
      <el-button type="primary" class="w-full !h-10" @click="handleRegister(ruleFormRef)">立即注册</el-button>
      <el-button class="w-full !h-10 mt-2 !mx-0" @click="router.replace('/')">已有账号，去登录</el-button>
    </div>
    <!-- 按钮区域 结束 -->
  </div>
</template>

<style scoped>

</style>