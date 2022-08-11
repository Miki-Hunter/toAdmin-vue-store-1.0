<template>
  <el-card>
    <el-row :gutter="20" class="header" :inline="true">
      <el-col :span="3">
        <el-input v-model.number="queryForm.user_id" placeholder="输入用户ID" clearable  size="medium" @keyup.enter="initGetOrders"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model.number="queryForm.product_id" placeholder="输入商品ID" clearable  size="medium" @keyup.enter="initGetOrders"></el-input>
      </el-col>
      <el-col :span="8">
      <el-date-picker
        v-model="orderTimeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :size="medium"
      />
      </el-col>
      <el-col :span="8">
      <el-date-picker
        v-model="queryForm.order_time"
        type="date"
        placeholder="选择日期"
        :size="medium"
      />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <el-button type="primary" :icon="Search" @click="initGetOrders">{{$t('table.search')}}</el-button>
      </el-col>
    </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-for="(item,index) in options" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
          <template v-slot="{ row }" v-if="item.prop === 'order_time'">
            {{$filters.filterTimes(row.order_time)}}
          </template>
          <template #default="{ row }"  v-else-if="item.prop === 'action'"  >
            <el-button type="warning" size="small" :icon="Delete" @click="confirmDel(row.id)"></el-button>
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
</template>

<script setup>
import { Search, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getOrders, deleteOrder } from '@/api/orders'
import { options } from './options'
import { ElMessage, ElMessageBox } from 'element-plus'
const total = ref(0)
const queryForm = ref({
  user_id: '',
  product_id: '',
  order_time: '',
  currentPage: 1,
  pageSize: 10,
  startTime: '',
  endTime: ''
})
const orderTimeRange = ref([])
const canBesent = ref(true)

// 获取用户数据
const tableData = ref([])
const initGetOrders = async () => {
  if (orderTimeRange.value.length) {
    queryForm.value.startTime = orderTimeRange.value[0].getTime()
    queryForm.value.endTime = orderTimeRange.value[1].getTime()
  }
  if (queryForm.value.order_time === null) {
    queryForm.value.order_time = ''
  }
  if (queryForm.value.order_time !== '') {
    queryForm.value.order_time = queryForm.value.order_time.getTime()
  }
  checkIsNum(queryForm.value.user_id)
  checkIsNum(queryForm.value.product_id)
  if (canBesent.value) {
    const data = await getOrders(queryForm.value)
    tips(data)
    tableData.value = data.Orders
    total.value = data.total
  }
  canBesent.value = true
}
initGetOrders()

// 设置pageSize
const handleSizeChange = (pageSize) => {
  queryForm.value.currentPage = 1
  queryForm.value.pageSize = pageSize
  initGetOrders()
}

// 设置当前页
const handleCurrentChange = (currentPage) => {
  queryForm.value.currentPage = currentPage
  initGetOrders()
}

// 弹出框提示
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

// 删除
const confirmDel = (id) => {
  ElMessageBox.confirm(
    '确定删除该订单记录？',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
    const res = await deleteOrder(id)
      tips(res)
      initGetOrders()
    })
}

const checkIsNum = (num) => {
  if (num !== '') {
    var numReg = /^[0-9]+$/
    var numRe = new RegExp(numReg)
    if (!numRe.test(num)) {
      ElMessage.error('ID只能是数字哦')
      canBesent.value = false
    }
  }
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
::v-deep .el-range__icon {
  display: none;
}

</style>
