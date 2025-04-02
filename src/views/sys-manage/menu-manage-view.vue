<script setup lang="ts">
import {reactive, ref} from "vue";
import {deleteRequest, get, getWithParams, post, put} from "@/axios/axios-config.ts";
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus";
import {useAuthStore} from "@/stores/auth-store.ts";
import {refreshRouter} from "@/router";

interface IMenuVO {
  id?: number,
  name?: string,
  zhName?: string,
  path?: string,
  componentPath?: string,
  parentId?: number,
  level?: number,
  remark?: string,
  orderNum?: number,
  children?: IMenuVO[]
}

// 菜单查询条件
const menuQueryVO = ref<IMenuVO>({})
// 菜单信息
const menuVO = ref<IMenuVO>({})
// 菜单数据
const menuData = ref<Array<IMenuVO>>([])
// 个人信息
const authStore = useAuthStore()

// 获取菜单列表
const getMenuList = () => {
  getWithParams("/api/menu/list", menuQueryVO.value, (data, status) => {
    if (status === 200) {
      menuData.value = data
    }
  })
}

// 菜单信息查看、新增、编辑对话框显示状态
const dialogVisible = ref<boolean>(false)
// 菜单信息查看、新增、编辑对话框标题
const dialogTile = ref<string>('')
// 当前操作类型
const opt = ref<'view' | 'add' | 'edit'>('view')
// 菜单信息查看
const showRoleDialog = (id: number | null, level: number | null, option: 'view' | 'add' | 'edit') => {
  dialogVisible.value = true
  opt.value = option
  if (id !== null && option !== 'add') {
    get('/api/menu/' + id, success => {
      menuVO.value.id = success.id
      menuVO.value.name = success.name
      menuVO.value.zhName = success.zhName
      menuVO.value.path = success.path
      menuVO.value.parentId = success.parentId
      menuVO.value.componentPath = success.componentPath
      menuVO.value.level = success.level
      menuVO.value.orderNum = success.orderNum
      menuVO.value.remark = success.remark
      menuVO.value.children = success.children
    })
  } else {
    menuVO.value.orderNum = 0
    menuVO.value.parentId = id as number
    menuVO.value.level = level as number
  }
  switch (option) {
    case 'view':
      dialogTile.value = '查看菜单信息'
      break;
    case 'add':
      dialogTile.value = '新增菜单'
      break;
    case 'edit':
      dialogTile.value = '编辑菜单信息'
      break;
  }
}

const menuFormRef = ref<FormInstance>()

const validateName = (_rule: any, value: any, callback: any) => {
  if (value.includes(' ')) {
    callback(new Error('菜单名称不能包含空格'))
  }
  if (!/^[a-zA-Z0-9_-]{1,50}$/.test(value)) {
    callback(new Error('菜单名称只能由大小写字母0-9和下划线和-组成，且长度在1-50个字符内'))
  }
  callback()
}

const rules = reactive<FormRules<Omit<IMenuVO, 'children'>>>({
  orderNum: [
    {required: true, message: '请输入排序号', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入系统内部名称', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
    {validator: validateName, trigger: 'blur'}
  ],
  zhName: [
    {required: true, message: '请输入中文名称', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
  ],
  path: [
    {required: true, message: '请输入路由地址', trigger: 'blur'},
    {min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur'}
  ],
  componentPath: [
    {min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur'}
  ],
  level: [
    {required: true, message: '请输入菜单层级', trigger: 'blur'}
  ],
})

const handleClose = () => {
  menuFormRef.value?.resetFields()
  dialogVisible.value = false
  menuVO.value = {}
  getMenuList()
}

// 新增菜单信息
const handleSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(valid => {
    if (valid) {
      switch (opt.value) {
        case 'add':
          post('/api/menu', menuVO.value, {
            headers: {
              'Content-Type': 'application/json'
            }
          }, () => {
            ElMessage.success("新增成功")
            get("/api/user/me", data => {
              authStore.user = data
              refreshRouter()
            })
            handleClose()
          })
          break;
        case 'edit':
          put('/api/menu', menuVO.value, {
            headers: {
              'Content-Type': 'application/json'
            }
          }, () => {
            ElMessage.success("修改成功")
            get("/api/user/me", data => {
              authStore.user = data
              refreshRouter()
            })
            handleClose()
          })
          break;
      }
    }
  })
}

// 删除菜单信息
const handleDelete = (id: number) => {
  ElMessageBox.confirm(
      '确定删除该菜单信息吗？',
      '提示',
      {
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    // 删除菜单信息
    deleteRequest('/api/menu/' + id, () => {
      ElMessage.success("删除成功")
      get("/api/user/me", data => {
        authStore.user = data
        refreshRouter()
      })
      getMenuList()
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

getMenuList()
</script>

<template>
  <div class="w-full h-full">
    <!-- 顶部操作栏 开始 -->
    <el-row :gutter="20" class="mb-2">
      <el-col :span="2">
        <el-button type="primary" plain size="small" class="w-full" @click="showRoleDialog(null, 1, 'add')">
          新增菜单
        </el-button>
      </el-col>
    </el-row>
    <!-- 顶部操作栏 结束 -->
    <!-- 列表展示部分 开始 -->
    <el-table :data="menuData" row-key="id" border default-expand-all>
      <el-table-column fixed prop="zhName" label="菜单名称" align="center" show-overflow-tooltip/>
      <el-table-column prop="path" label="路由地址" align="center" show-overflow-tooltip/>
      <el-table-column prop="componentPath" label="组件路径" align="center" show-overflow-tooltip/>
      <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" min-width="120" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="showRoleDialog(scope.row.id, null, 'view')">
            查看
          </el-button>
          <template
              v-if="scope.row.level === 1 ||
              (scope.row.level === 2 && 
              (scope.row.componentPath === undefined || scope.row.componentPath === null || scope.row.componentPath === ''))">
            <el-button link type="primary" size="small" @click="showRoleDialog(scope.row.id, scope.row.level + 1, 'add')">
              新增
            </el-button>
          </template>
          <el-button link type="primary" size="small" @click="showRoleDialog(scope.row.id, null, 'edit')">
            编辑
          </el-button>
          <el-button link type="primary" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表展示部分 结束 -->

    <!-- 表单展示、编辑部分 开始 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTile"
        width="80%"
        :before-close="handleClose"
    >
      <el-form ref="menuFormRef" :model="menuVO" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="菜单排序" prop="orderNum">
              <el-input-number min="0" v-model="menuVO.orderNum" :disabled="opt === 'view'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="菜单层级" prop="level">
              <el-input v-model="menuVO.level" placeholder="请输入菜单层级" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统内部名称" prop="name">
              <el-input v-model="menuVO.name" placeholder="请输入系统内部名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中文名称" prop="zhName">
              <el-input v-model="menuVO.zhName" placeholder="请输入中文名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuVO.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="(menuVO.componentPath !== undefined && menuVO.componentPath !== '' && opt === 'view') ||
                  (opt !== 'view' && menuVO.level !== undefined && menuVO.level > 1)">
            <el-form-item label="组件路径" prop="componentPath">
              <el-input v-model="menuVO.componentPath" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="menuVO.remark" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div>
          <el-button v-show="opt !== 'view'" @click="handleSave(menuFormRef)">保存</el-button>
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