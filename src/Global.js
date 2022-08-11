exports.install = function (Vue) {
    Vue.prototype.$target = 'http://localhost:5000/' // 本地后端地址  部署后改为服务器地址

    Vue.prototype.notifySucceed = function (msg) { // 提示成功的弹出框
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success',
        offset: 100
      })
    }
    Vue.prototype.notifyError = function (msg) {
      this.$notify.error({
        title: '错误',
        message: msg,
        offset: 100
      })
    }
  }
