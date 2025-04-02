<script setup lang="ts">
import {reactive, ref} from "vue";
import {deleteRequest, get, getWithParams, post, put} from "@/axios/axios-config.ts";
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus";

interface IRole {
  id?: number | null,
  name?: string | null,
  zhName?: string | null,
}

interface IRoleVO extends IRole {
  current: number,
  size: number,
  total: number
}

const roleQueryVO = ref<IRoleVO>({
  current: 1,
  size: 10,
  total: 0
})

// 角色查询参数
const roleVO = ref<IRoleVO>({
  current: 1,
  size: 10,
  total: 0
})

const getRoleList = () => {
  getWithParams("/api/role/page", roleQueryVO.value, success => {
    roleData.value = success.records
    roleQueryVO.value.current = success.current
    roleQueryVO.value.size = success.size
    roleQueryVO.value.total = success.total
  })
}

const handleQueryReset = () => {
  roleQueryVO.value.name = null
  roleQueryVO.value.zhName = null
  roleQueryVO.value.current = 1
  roleQueryVO.value.size = 10
  getRoleList()
}

// 角色列表
const roleData = ref<Array<IRole>>([])
getRoleList()

const dialogVisible = ref<boolean>(false)
const dialogTile = ref<string>('')
const opt = ref<'view' | 'add' | 'edit'>('view')

const showRoleDialog = (id: number | null, option: 'view' | 'add' | 'edit') => {
  dialogVisible.value = true
  opt.value = option
  if (id !== null) {
    get("/api/role/" + id, success => {
      roleVO.value.id = success.id
      roleVO.value.name = success.name
      roleVO.value.zhName = success.zhName
    })
  }
  switch (option) {
    case 'view':
      dialogTile.value = '查看角色信息'
      break;
    case 'add':
      dialogTile.value = '新增角色信息'
      break;
    case 'edit':
      dialogTile.value = '编辑角色信息'
      break;
  }
}

const roleFormRef = ref<FormInstance>()

const validateName = (_rule: any, value: any, callback: any) => {
  if (value.includes(' ')) {
    callback(new Error('角色名称不能包含空格'))
  }
  if (!/^[A-Z]{1,50}$/.test(value)) {
    callback(new Error('角色名称只能由大写字母组成'))
  }
  callback()
}

const rules = reactive<FormRules<IRole>>({
  name: [
    {required: true, message: '请输入系统内部名称', trigger: 'blur'},
    {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'},
    {validator: validateName, trigger: 'blur'}
  ],
  zhName: [
    {required: true, message: '请输入中文名称', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
  ]
})

const handleSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(valid => {
    if (valid) {
      switch (opt.value) {
        case 'add':
          post("/api/role", roleVO.value, {
            headers: {
              'Content-Type': 'application/json'
            }
          }, () => {
            ElMessage.success("新增成功")
            handleClose()
          })
          break;
        case 'edit':
          put("/api/role", roleVO.value, {
            headers: {
              'Content-Type': 'application/json'
            }
          }, () => {
            ElMessage.success("保存成功")
            handleClose()
          })
          break;
      }
    }
  })

}

const handleClose = () => {
  roleFormRef.value?.resetFields()
  dialogVisible.value = false
  roleVO.value.id = null
  roleVO.value.name = null
  roleVO.value.zhName = null
  getRoleList()
}

const handleDelete = (id: number) => {
  ElMessageBox.confirm(
      '确定删除该角色信息吗？',
      '提示',
      {
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    // 删除角色信息
    deleteRequest('/api/role/' + id, () => {
      ElMessage.success("删除成功")
      getRoleList()
    })
  }).catch(() => {
   ElMessage.info('已取消删除')
  })
}

</script>

<template>
  <div class="w-full h-full">
    <!-- 顶部查询相关操作栏 开始 -->
    <el-form :model="roleQueryVO" class="w-full">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="系统内部名称" prop="name">
            <el-input v-model="roleQueryVO.name" placeholder="请输入系统内部名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="中文名称" prop="zhName">
            <el-input v-model="roleQueryVO.zhName" placeholder="请输入中文名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="getRoleList" class="mr-2">搜索</el-button>
          <el-button class="mr-2" @click="handleQueryReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 顶部查询相关操作栏 结束 -->

    <!-- 顶部操作栏 开始 -->
    <el-row :gutter="20" class="mb-2">
      <el-col :span="2">
        <el-button type="primary" plain size="small" class="w-full" @click="showRoleDialog(null, 'add')">新增角色
        </el-button>
      </el-col>
    </el-row>
    <!-- 顶部操作栏 结束 -->

    <!-- 列表展示部分 开始 -->
    <el-table :data="roleData" border class="w-full mb-2">
      <el-table-column prop="name" label="系统内部名称" align="center"/>
      <el-table-column prop="zhName" label="中文名称" align="center"/>
      <el-table-column fixed="right" label="操作" min-width="120" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="showRoleDialog(scope.row.id, 'view')">
            查看
          </el-button>
          <el-button link type="primary" size="small" @click="showRoleDialog(scope.row.id, 'edit')">
            编辑
          </el-button>
          <el-button link type="primary" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表展示部分 结束 -->

    <!-- 分页器部分 开始 -->
    <el-pagination
        v-model:current-page="roleQueryVO.current"
        v-model:page-size="roleQueryVO.size"
        :page-sizes="[1, 5, 10, 100, 200, 300, 400]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleQueryVO.total"
        @size-change="getRoleList"
        @current-change="getRoleList"
    />
    <!-- 列表展示部分 结束 -->

    <!-- 表单展示、编辑部分 开始 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTile"
        width="80%"
        :before-close="handleClose"
    >
      <el-form ref="roleFormRef" :model="roleVO" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="系统内部名称" prop="name">
              <el-input v-model="roleVO.name" placeholder="请输入系统内部名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名称" prop="zhName">
              <el-input v-model="roleVO.zhName" placeholder="请输入中文名称"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="handleSave(roleFormRef)" v-show="opt !== 'view'">保存</el-button>
          <el-button type="primary" @click="handleClose">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 表单展示、编辑部分 结束 -->
  </div>
</template>

<style scoped>

</style>