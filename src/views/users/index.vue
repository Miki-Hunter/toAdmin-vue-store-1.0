<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
          <el-input v-model="queryForm.query" :placeholder="$t('table.placeholder')" clearable @keyup.enter="initGetUsers"></el-input>
      </el-col>
        <el-button type="primary" :icon="Search" @click="initGetUsers">{{$t('table.search')}}</el-button>
        <el-button type="primary" @click="handleAddOrEditUser()">{{$t('table.adduser')}} </el-button>
    </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-for="(item,index) in options" :key="index" :prop="item.prop" :label="$t(`table.${item.label}`)" :width="item.width">
          <template v-slot="{ row }" v-if="item.prop === 'status'">
            <el-switch v-model="row.status" @change="changeStateOfUser(row)"></el-switch>
          </template>
          <template #default="{ row }"  v-else-if="item.prop === 'action'"  >
            <el-button type="primary" size="small" :icon="Edit" @click="handleAddOrEditUser(row)"></el-button>
            <el-button type="warning" size="small" :icon="Delete" @click="confirmDel(row.user_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      v-model:currentPage="queryForm.pagenum"
      v-model:page-size="queryForm.pagesize"
      :page-sizes="[2, 5, 10, 15]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <Dialog
  v-model="dialogVisible"
  :dialogTitle="dialogTitle"
  v-if="dialogVisible"
  @initUserList="initGetUsers"
  :dialogUserData="dialogUserData"
  />
</template>

<script setup>
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getUser, changeUserState, deleteUser } from '@/api/user'
import { options } from './options'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Dialog from './components/dialog'
import { isNull } from '@/utils/filters'
const total = ref(0)
// ??????????????? ??????3?????????????????????????????????????????????????????????????????????query(??????username???contain????????????)
const queryForm = ref({
  query: '',
  pagenum: 1,
  pagesize: 5
})

// ??????????????????
const tableData = ref([])
const initGetUsers = async () => {
  const data = await getUser(queryForm.value)
  console.log(data)
  tableData.value = data.users
  total.value = data.total
}
initGetUsers()

// ??????pageSize
const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  initGetUsers()
}

// ???????????????
const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initGetUsers()
}

// ???????????????
const tips = (res) => {
    if (res.code === '001') {
    ElMessage({
    message: res.msg,
    type: 'success'
  })
  }
    if (res.code === '002') {
      ElMessage({
      message: res.msg,
      type: 'error'
    })
    }
}
const i18n = useI18n()
// ?????????????????? ??????/??????
const changeStateOfUser = async (info) => {
  const data = {
    user_id: info.user_id,
    status: info.status,
    is_change_status: 1
  }
  const res = await changeUserState(data)
  tips(res)
}
// ???????????? ??? ????????????  ???????????????????????????????????????????????????????????????????????????
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogUserData = ref({})
const handleAddOrEditUser = (row) => {
  if (isNull(row)) {
    dialogTitle.value = '????????????'
    dialogUserData.value = {}
  } else {
    dialogTitle.value = '????????????'
    // ????????????is_change_status????????????????????????????????????
    const temp = JSON.parse(JSON.stringify(row))
    temp.is_change_status = 2
    dialogUserData.value = temp
    console.log(dialogUserData.value)
  }
  dialogVisible.value = true
}

// ????????????
const confirmDel = (id) => {
  ElMessageBox.confirm(
    i18n.t('dialog.deleteTitle'),
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      await deleteUser(id)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      initGetUsers()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
.header{
  padding-bottom: 10px;
  box-sizing: border-box;
}

::v-deep .el-input__suffix {
  align-items: center;
}

::v-deep .el-pagination{
  padding-top: 16px;
  box-sizing: border-box;
  text-align: right;
}

</style>
