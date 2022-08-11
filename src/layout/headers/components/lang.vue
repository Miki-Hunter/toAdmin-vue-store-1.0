<template>
  <el-dropdown @command="handleCommand">
    <svg-icon icon="language"></svg-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh" :disabled="currentLanguage === 'zh'"
          >中文</el-dropdown-item
        >
        <el-dropdown-item command="en" :disabled="currentLanguage === 'en'"
          >English</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useStore } from 'vuex'
const i18n = useI18n()
const store = useStore()
// 获取当前使用语言 , 当前选中的语言要做一个禁用选择的标记
const currentLanguage = computed(() => {
  return i18n.locale.value
})

const handleCommand = (val) => {
  i18n.locale.value = val
  store.commit('app/changLang', val)
  localStorage.setItem('lang', val)
}
</script>

<style lang="scss" scoped></style>
