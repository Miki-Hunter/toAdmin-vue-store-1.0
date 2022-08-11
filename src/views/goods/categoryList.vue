<template>
  <div class="goods" id="goods" name="goods">

    <div class="nav">
      <div class="product-nav">
        <div class="title">分类</div>
        <el-tabs @tab-click="handleClick" type="card">
          <el-tab-pane
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :name="''+item.category_id"
          ></el-tab-pane>
        </el-tabs>
        <el-table :data="product7" stripe style="width: 100%">
        <el-table-column v-for="(item,index) in options" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
          <template #default="{ row }"  v-if="item.prop === 'action'"  >
            <el-button type="primary" size="small" :icon="Edit" @click="goTo(row.product_id)">编辑</el-button>
            <el-button type="warning" size="small" :icon="Delete" @click="confirmDel(row.product_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      v-model:currentPage="queryForm.currentPage"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[2, 5, 10, 15]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCatetory, getProductByCategory, deleteProduct } from '@/api/goods'
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { options } from './options'
// import router from '@/router/index.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const queryForm = ref({
  categoryID: '',
  pageSize: 7,
  currentPage: 1
})
const total = ref('0')
const activeName = ref('1')
const categoryList = ref('')
const product7 = ref('')
const remainNum = ref('')
// 获取列表
const initGetInfo = async () => {
  const data = await getCatetory()
  if (data.code === '001') {
  categoryList.value = data.category
  } else {
    tips(data)
  }
}

// 挂载时获取数据
onMounted(
  () => {
    initGetInfo()
    getGoodsList()
  }
)

// 导航栏点击事件
const handleClick = (tab) => {
  activeName.value = tab.props.name
  getGoodsList()
}

// 获取商品列表
const getGoodsList = async () => {
  queryForm.value.categoryID = [activeName.value]
  const data = await getProductByCategory(queryForm.value)
  if (data.code === '001') {
    product7.value = data.Product
    total.value = data.total
  } else {
    tips(data)
  }
}
// 弹出框提示
const tips = (res) => {
      ElMessage({
      message: res.msg,
      type: 'error'
    })
}

// 设置pageSize
const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  getGoodsList()
}

// 设置当前页
const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  getGoodsList()
}

// 跳转到商品详情页面
const goTo = (id) => {
  router.push({
    path: '/admin/productDetails',
    query: { id: id }
  })
}

// 删除
const confirmDel = (id) => {
    remainNum.value = '' + Math.floor((Math.random() * 10000000) % 10000)
    const sentence = `确定删除吗？请输入如下验证码:  ${remainNum.value}`
    ElMessageBox.prompt(sentence, '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async({ value }) => {
      if (value === remainNum.value) {
        const res = await deleteProduct(id)
        if (res.code === '001') {
          ElMessage({
          message: res.msg,
          type: 'success'
        })
        initGetInfo()
      } else { tips(res) }
      } else {
        ElMessage({
          type: 'info',
          message: '输入错误，请重新操作'
      })
      }
    })
}
</script>
<style>
.goods {
  background-color: #f5f5f5;
}
/* 面包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}
.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}
/* 面包屑CSS END */

/* 分类标签CSS */
.goods .nav {
  background-color: white;
}
.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}

::v-deep .el-pagination{
  padding-top: 16px;
  box-sizing: border-box;
  text-align: right;
}
/* 分类标签CSS END */

/* 主要内容区CSS */
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}
.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}
.goods .main .pagination {
  height: 50px;
  text-align: center;
}
.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}
/* 主要内容区CSS END */
</style>
