<template>
    <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input v-model="queryForm.productSearch" placeholder="输入商品ID或名称" clearable  size="medium" @keyup.enter="getData"></el-input>
      </el-col>
        <el-button type="primary" :icon="Search" @click="getData">{{$t('table.search')}}</el-button>
    </el-row>
    <br><br>
    <el-form status-icon class="demo-ruleForm" :label-position="left" ref="resetFormData">
    <el-form-item label="商品名称" prop="product_name">
      <el-input v-model="productDetails.product_name" clearable />
    </el-form-item>
    <el-form-item label="商品概述" prop="product_title">
      <el-input v-model="productDetails.product_title" clearable  />
    </el-form-item>
    <el-form-item label="商品介绍"  prop="product_intro">
      <el-input type="textarea" v-model="productDetails.product_intro"  :autosize="{ minRows: 2, maxRows: 7 }" />
    </el-form-item>
    <el-form :inline="true" class="demo-form-inline" :label-position="left" ref="resetFormData">
      <el-form-item label="商品ID"  prop="product_id">
        <el-input v-model.number="productDetails.product_id" clearable disabled />
      </el-form-item>
      <el-form-item label="原价"  prop="product_price">
        <el-input v-model.number="productDetails.product_price" clearable />
      </el-form-item>
      <el-form-item label="已售出"  prop="product_sales">
        <el-input v-model.number="productDetails.product_sales" clearable disabled />
      </el-form-item>
      <el-form-item label="现价" prop="product_selling_price">
        <el-input v-model.number="productDetails.product_selling_price" clearable  />
      </el-form-item>
      <el-form-item label="库存量" prop="product_num">
        <el-input v-model.number="productDetails.product_num" />
      </el-form-item>
      <el-form-item label="所属种类" prop="category_id">
        <el-select v-model.number="productDetails.category_id"  @change="categoryChanged">
        <el-option
        v-for="(it,index) in categoryList"
        :key="index"
        :label="it.category_name"
        :value="it.category_id"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button type="success" @click="submitForm">提交更新</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
      <el-button type="warning" @click="confirmDel(productDetails.product_id)">删除</el-button>
      <el-button type="primary" @click="toImag(productDetails.product_id,productDetails.category_id)">查看图片</el-button>
    </el-form-item>
  </el-form>
  </el-card>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductDetails, deleteProduct, updateProduct, getCatetory } from '@/api/goods'
const router = useRoute()
const queryForm = ref({
  productSearch: '1'
})
const productDetails = ref([])
// 挂载时获取数据
onMounted(
  () => {
    if (router.query.id !== undefined) { queryForm.value.productSearch = router.query.id }
    _getCatetory()
    getData()
  }
)
// 获取分类列表
const categoryList = ref('')
const _getCatetory = async () => {
  const data = await getCatetory()
  if (data.code === '001') {
  categoryList.value = data.category
  } else {
    tips(data)
  }
}

// 获取数据
const resetFormData = ref(null)
const getData = async () => {
  const data = await getProductDetails(queryForm.value)
  if (data.code === '001') {
    productDetails.value = data.Product[0]
  } else {
    tips(data)
  }
}
// 弹出框提示
const tips = (res) => {
    if (res.code === '001') {
    ElMessage({
    message: '获取成功',
    type: 'success'
  })
  } else {
      ElMessage({
      message: res.msg || '获取失败',
      type: 'error'
    })
    }
}

// 删除
const remainNum = ref('')
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
        getData()
      } else { tips(res) }
      } else {
        ElMessage({
          type: 'info',
          message: '输入错误，请重新操作'
      })
      }
    })
}

// 提交表单
const submitForm = async () => {
  if (checkIsNum([productDetails.value.product_price, productDetails.value.product_selling_price, productDetails.value.product_num])) {
  const res = await updateProduct(productDetails.value)
  if (res.code === '001') {
    ElMessage({
      message: res.msg,
      type: 'success'
    })
    getData()
  } else { tips(res) }
  }
}

const checkIsNum = (nums) => {
  nums.forEach(num => {
    if (num !== '' || num !== null) {
      var numReg = /^[0-9]+$/
      var numRe = new RegExp(numReg)
      if (!numRe.test(num)) {
        ElMessage.error('ID只能是数字哦')
        return false
      }
    } else {
      ElMessage.error('请填写完整信息')
      return false
    }
    })
    return true
}

// 修改商品所属种类
const categoryChanged = (val) => {
  productDetails.value.category_id = val
}

// 跳转到商品图片页面
const sendRouter = useRouter()
const toImag = (id1, id2) => {
  sendRouter.push({
    path: '/admin/productImageList',
    query: { productID: id1, categoryID: id2 }
  })
}

const resetForm = () => {
  resetFormData.value.resetFields()
}
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  width: 600px;
  margin-right: auto
}
</style>
