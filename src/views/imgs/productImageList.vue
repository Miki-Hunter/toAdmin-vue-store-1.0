<template>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input v-model="queryForm.productID" placeholder="输入商品ID查询" clearable  size="medium" @keyup.enter="getProducts"></el-input>
      </el-col>
        <el-button type="primary" :icon="Search" @click="getProducts">搜索</el-button>
    </el-row>
    <!-- 轮播图 -->
    <div class="block">
        <el-carousel :interval="4000" type="card" height="400px">
            <el-carousel-item v-for="(item,index) in pictures" :key="item.product_id" :label="index+1">
            <img style="height:400px;" :src="baseUrl + item.product_picture" />
            </el-carousel-item>
        </el-carousel>
    </div>
    <br>
    <div class="main-content">
    <div class="main">
        <el-upload
          class="upload-demo"
          action="#"
          :http-request="handleChange"
          :limit="1"
          >
          <el-button type="primary" >添加图片</el-button>
          <h5>只能上传jpg/png文件，且不超过5M
          </h5>
        </el-upload>
    </div>
    </div>
    <div class="main">
      <el-select v-model="queryForm.imagID" class="m-2" placeholder="选择图片序号" size="">
        <el-option
          v-for="(item,index) in pictures"
          :key="item.product_id"
          :label="index+1"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="main">
      <el-button type="warning" @click="confirmDel">删除</el-button>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { getProductPicture, deleteProductPicture, newProductImag } from '@/api/imgs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
const router = useRoute()
const pictures = ref()
const queryForm = ref({
    productID: '1',
    imagID: '1',
    categoryID: '1'
})
const baseUrl = 'http://localhost:5000/'
// 添加图片
const handleChange = async(file) => {
    const param = new FormData()
    param.append('file', file.file)
    param.append('productID', queryForm.value.productID)
    console.log(param)
    const res = await newProductImag(param)
    console.log(res)
    tips(res)
    if (res.code === '001') {
        getProducts()
    }
}
onMounted(() => {
    console.log(router.query.productID)
    if (router.query.productID !== undefined) { queryForm.value.productID = router.query.productID }
    if (router.query.categoryID !== undefined) { queryForm.value.categoryID = router.query.categoryID }
    getProducts()
})

const getProducts = async () => {
  const data = await getProductPicture(queryForm.value)
  if (data.code === '001') {
    pictures.value = data.ProductPicture
  } else {
    tips(data)
  }
}

// 删除图片
const remainNum = ref('')
const confirmDel = () => {
    remainNum.value = '' + Math.floor((Math.random() * 10000000) % 10000)
    const sentence = `确定删除吗？请输入如下验证码:  ${remainNum.value}`
    ElMessageBox.prompt(sentence, '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async({ value }) => {
      if (value === remainNum.value) {
        const res = await deleteProductPicture(queryForm.value.imagID)
        if (res.code === '001') {
          ElMessage({
          message: res.msg,
          type: 'success'
        })
        getProducts()
      } else { tips(res) }
      } else {
        ElMessage({
          type: 'info',
          message: '输入错误，请重新操作'
      })
      }
    })
}

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
</script>

<style lang="scss" scoped>
.main{
width:260px;
height:260px;
float: left;
margin-left: 20px
}

</style>
