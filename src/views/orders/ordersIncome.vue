<template>
    <div>
    <!-- 数据统计-->
    <el-row :gutter="10">
        <el-col :span="6">
            <div class="statistics" style="background:#409eff" >
                <div class="title">
                    <p>用户统计</p>
                </div>
                <div class="num">{{queryForm.res.user_num}}</div>
                <div class="tip">用户总数量</div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="statistics" style="background:#E6A23C" >
                <div class="title">
                    <p>商品统计</p>
                </div>
                <div class="num">{{queryForm.sales.sales}}</div>
                <div class="tip">当前总售出商品数量</div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="statistics" style="background:#67C23A" >
                <div class="title">
                    <p>订单统计</p>
                </div>
                <div class="num">{{queryForm.res.order_num}}</div>
                <div class="tip">当前总订单数量</div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="statistics" style="background:#909399" >
                <div class="title">
                    <p>销售统计</p>
                </div>
                <div class="num">{{queryForm.sales.total_price}}</div>
                <div class="tip">当前总销售(元)</div>
            </div>
        </el-col>
    </el-row>
    </div>
    <br>
    <el-card class="box-card">
      <div id="echartLine" style="widht:300px;height:400px;">
      </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrdersInfo } from '@/api/orders'
import * as echarts from 'echarts'
// 管理上半部分的数据
const queryForm = ref({
    res: {},
    sales: {}
})
// onMounted(
//   () => {
//   }
// )

const initGetOrders = async () => {
    const data = await getOrdersInfo()
    tips(data)
    if (data.code === '001') {
        queryForm.value.res = data.res
        queryForm.value.sales = data.sales
        const dataInfo = data.dataInfo
        // 数据加载，画图
        echartOption(dataInfo)
    }
}
initGetOrders()

// 绘制图表
const echartOption = (dataInfo) => {
    const seriesData = []
    const xdata = []
    dataInfo.forEach(key => {
        xdata.push(key[0])
        seriesData.push(key[1])
    })
    const option = {
        title: { text: '月销量变化曲线图' },
        xAxis: {
            data: xdata
        },
        yAxis: {},
        series: [
            {
            data: seriesData,
            type: 'line',
            label: {
                show: true,
                position: 'bottom',
                textStyle: {
                fontSize: 20
                }
            }
            }
        ]
        }
    echarts.init(document.getElementById('echartLine')).setOption(option)
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
</script>

<style lang="scss" scoped>
.el-row{
    padding: 0 9px;
    .statistics{
        color: white;
        height: 100px;
        border-radius:4px;
        padding: 0 8px;
        .title{
            display: flex; // 弹性布局
            justify-content: space-between; // 两边对齐
            align-items: center; // 垂直居中
        }
        p{
            font-size: 13px;
            font-weight: bold;
        }
        .num{
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
        .tip{
            font-size: 12px;
        }
    }
}
</style>
