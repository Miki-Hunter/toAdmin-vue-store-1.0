<template>
    <el-dialog
    :model-value="dialogVisible"
    :title="dialogTitle"
    width="40%"
    @close="handleClose"
    >
        <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
            <el-form-item prop="userName" :label="$t('table.username')">
                <el-input v-model="form.userName" />
            </el-form-item>
            <el-form-item prop="password" :label="$t('table.password')" v-if="dialogTitle === '添加用户' ">
                <el-input v-model="form.password"  type="password"/>
            </el-form-item>
            <el-form-item prop="userEmail" :label="$t('table.email')">
                <el-input v-model="form.userEmail" />
            </el-form-item>
            <el-form-item prop="userPhoneNumber" :label="$t('table.mobile')">
                <el-input v-model="form.userPhoneNumber" />
            </el-form-item>
        </el-form>

        <template #footer>
        <span class="dialog-footer">
            <el-button @click="handleClose">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="handleConfirm">{{$t('button.confirm')}}</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps, watch } from 'vue'
import { addUser, editUser } from '@/api/user'
import i18n from '@/i18n'
import { ElMessage } from 'element-plus'
const formRef = ref(null)
const form = ref({
    userName: '',
    password: '',
    userEmail: '',
    userPhoneNumber: ''
})

// 接收标题、编辑数据
const propsData = defineProps({
    dialogTitle: {
        type: String,
        default: '',
        required: true
    },
    dialogUserData: {
        type: Object,
        default: () => {}
    }
})

// 监听，接收父组件传递的数据
watch(() => propsData.dialogTitle,
    () => { form.value = propsData.dialogUserData }, { deep: true, immediate: true }
    )

// 数据规则
const rules = ref({
    userName: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' }
    ],
userEmail: [
    { required: true, message: 'Please input email address', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
    ],
userPhoneNumber: [
    { required: true, message: 'Please input mobile number', trigger: 'blur' }
    // { type: 'number', message: 'Please input correct mobile number', trigger: ['blur', 'change'] }
    ],
password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
    ]
})

// 关闭弹出的界面
const emits = defineEmits(['update:modelValue', 'initUserList'])
const handleClose = () => {
    emits('update:modelValue', false)
}

// 编辑、添加,共用一个提交方法
const handleConfirm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            propsData.dialogTitle === '添加用户' ? await addUser(form.value) : await editUser(form.value)
                ElMessage({
                message: i18n.global.t('message.updeteSuccess'),
                type: 'success'
                })
                handleClose()
                emits('initUserList')
        } else {
        console.log('error submit!!')
        return false
        }
    })
}

</script>
