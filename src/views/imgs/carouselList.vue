<template>
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="(item,index) in carousel" :key="item.carousel_id" :label="index+1">
          <img style="height:460px;" :src="baseUrl + item.imgPath" />
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
      <el-select v-model="selectID" class="m-2" placeholder="选择图片序号" size="">
        <el-option
          v-for="(item,index) in carousel"
          :key="item.carousel_id"
          :label="index+1"
          :value="item.carousel_id"
        />
      </el-select>
    </div>
    <div class="main">
      <el-button type="warning" @click="confirmDel">删除</el-button>
    </div>
</template>

<script setup>
import { carouselLists, delelteCarousel, newCarousel } from '@/api/imgs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
const carousel = ref()
const selectID = ref(1)
const baseUrl = 'http://localhost:5000/'
// 添加图片
const handleChange = async(file) => {
  const param = new FormData()
  param.append('file', file.file)
  console.log(param)
  const res = await newCarousel(param)
  console.log(res)
  tips(res)
  if (res.code === '001') {
    getCarousel()
  }
}
onMounted(() => {
  getCarousel()
})

const getCarousel = async () => {
  const data = await carouselLists()
  if (data.code === '001') {
    carousel.value = data.carousel
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
        const res = await delelteCarousel(selectID.value)
        if (res.code === '001') {
          ElMessage({
          message: res.msg,
          type: 'success'
        })
        getCarousel()
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
