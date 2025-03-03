<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage, type FormInstance, type FormItemProp, type FormRules} from "element-plus";
import {defaultConfig, post} from "@/axios/axios-config.ts";
import {Lock, Message} from "@element-plus/icons-vue";
import router from "@/router";

const active = ref<number>(0)

interface validEmailForm {
  email: string,
  verificationCode: string
}

const validEmailFormRef = ref<FormInstance>()

// 重置密码表单
const validEmailForm = reactive<validEmailForm>({
  email: '',
  verificationCode: ''
})

// 重置表单验证规则
const validEmailFormRules = reactive<FormRules<validEmailForm>>({
  email: [
    {required: true, message: '请输入电子邮箱地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的电子邮箱地址', trigger: ['blur', 'change']}
  ],
  verificationCode: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    {min: 6, max: 6, message: '验证码长度错误', trigger: ['blur', 'change']}
  ]
})

// 验证邮箱是否正确
const isEmailValid = ref(false)

const handleValid = (prop: FormItemProp, isValid: boolean) => {
  if (prop === 'email') {
    isEmailValid.value = isValid
  }
}

const coolTime = ref<number>(0)
// 获取验证码按钮单击后操作
const handleValidateEmail = () => {
  post("/api/auth/valid-reset-email", {
    email: validEmailForm.email
  }, defaultConfig, (data) => {
    ElMessage.success(data)
    coolTime.value = 60
    const intervalId = setInterval(() => {
      if (coolTime.value > 0) {
        coolTime.value--
      } else {
        clearInterval(intervalId)
      }
    }, 1000)
  })
}

// 重置按钮操作
const handleValidEmail = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      post("/api/auth/start-reset", {
        email: validEmailForm.email,
        validateCode: validEmailForm.verificationCode
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }, (data) => {
        ElMessage.success(data)
        active.value = 1
      })
    }
  })
}

interface changePasswordForm {
  password: string,
  password2: string,
}

const changePasswordFormRef = ref<FormInstance>()

// 修改密码表单
const changePasswordForm = reactive<changePasswordForm>({
  password: '',
  password2: ''
})

const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (changePasswordForm.password !== '') {
      if (!changePasswordFormRef.value) return
      changePasswordFormRef.value.validateField('password2')
    }
    callback()
  }
}
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== changePasswordForm.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const changePasswordFormRules = reactive<FormRules<changePasswordForm>>({
  password: [
    {validator: validatePass, trigger: ['blur', 'change']},
    {min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: ['blur', 'change']}
  ],
  password2: [
    {validator: validatePass2, trigger: ['blur', 'change']}
  ],
})

// 修改密码按钮操作
const handleChangePassword = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      post("/api/auth/reset-password", {
        password: changePasswordForm.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      },  async(data) => {
        ElMessage.success(data)
        await router.replace('/welcome')
      })
    }
  })
}
</script>

<template>
  <div class="w-4/5">
    <div class="w-full">
      <el-steps class="w-full" :active="active" finish-status="success">
        <el-step title="Step 1"/>
        <el-step title="Step 2"/>
      </el-steps>
    </div>
    <transition name="el-fade-in-linear">
      <div class="w-full">
        <div class="w-full" v-if="active === 0">
          <!-- 验证邮箱标题 开始 -->
          <div class="w-full text-4xl font-bold mb-[8px] text-center">验证邮箱</div>
          <!-- 验证邮箱标题 结束 -->

          <!-- 验证邮箱信息 开始 -->
          <div class="w-full">
            <el-form ref="validEmailFormRef" :model="validEmailForm" class="max-w-[400px]" :rules="validEmailFormRules"
                     @validate="handleValid">
              <el-form-item prop="email">
                <el-input class="h-10" :prefix-icon="Message" v-model="validEmailForm.email"
                          placeholder="请输入电子邮箱地址"/>
              </el-form-item>
              <el-form-item prop="verificationCode">
                <el-input class="h-10" v-model="validEmailForm.verificationCode" placeholder="请输入邮件中的验证码">
                  <template #append>
                    <el-button :disabled="!isEmailValid || coolTime > 0" @click="handleValidateEmail">
                      {{ coolTime > 0 ? coolTime + 's' : '获取验证码' }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 验证邮箱信息 结束 -->

          <!-- 按钮区域 开始 -->
          <div class="w-full">
            <el-button type="primary" class="w-full !h-10" @click="handleValidEmail(validEmailFormRef)">重置</el-button>
            <el-button class="w-full !h-10 mt-2 !mx-0" @click="router.replace('/welcome')">取消</el-button>
          </div>
          <!-- 按钮区域 结束 -->
        </div>
        <div class="w-full" v-if="active === 1">
          <!-- 修改密码标题 开始 -->
          <div class="w-full text-4xl font-bold mb-[8px] text-center">修改密码</div>
          <!-- 修改密码标题 结束 -->

          <!-- 修改密码表单 开始 -->
          <div class="w-full">
            <el-form ref="changePasswordFormRef" :model="changePasswordForm" class="max-w-[400px]"
                     :rules="changePasswordFormRules">
              <el-form-item prop="password">
                <el-input class="h-10" :prefix-icon="Lock" v-model="changePasswordForm.password"
                          placeholder="请输入密码"
                          type="password"/>
              </el-form-item>
              <el-form-item prop="password2">
                <el-input class="h-10" :prefix-icon="Lock" v-model="changePasswordForm.password2"
                          placeholder="请再次输入密码"
                          type="password"/>
              </el-form-item>
            </el-form>
          </div>
          <!-- 修改密码表单 结束 -->

          <!-- 按钮区域 开始 -->
          <div class="w-full">
            <el-button type="primary" class="w-full !h-10" @click="handleChangePassword(changePasswordFormRef)">
              确认修改
            </el-button>
            <el-button class="w-full !h-10 mt-2 !mx-0" @click="router.replace('/welcome')">返回首页</el-button>
          </div>
          <!-- 按钮区域 结束 -->
        </div>
      </div>
    </transition>


  </div>
</template>

<style scoped>

</style>