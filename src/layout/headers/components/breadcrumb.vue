<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
    <!-- 最后一项 -->
      <span class="no-redirect" v-if="index === breadcrumbList.length - 1">{{item.name}}</span>
      <!-- 其余项 -->
      <span class="redirect" v-else @click="handleRedirect(item.path)">{{
        $t(`menus.${item.name}`)
      }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 路由对象
const route = useRoute()
const router = useRouter()

const breadcrumbList = ref([])

const initBreadcrumbList = () => {
  breadcrumbList.value = route.matched
  console.log(route.matched)
  // 查看路由表 结构
}

const handleRedirect = (path) => {
  router.push(path)
}
// 监听路由变化
watch(
  route,
  () => {
    initBreadcrumbList()
  },
  // 深度监听、立即执行
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}
.redirect {
  color: #666;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: $menuBg;
  }
}
</style>
