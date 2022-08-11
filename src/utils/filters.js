const dayjs = require('dayjs')

const filterTimes = (val, format = 'YYYY-MM-DD HH:MM') => {
    if (!isNull(val)) {
        // 若是秒级时间戳，则
        // val = parseInt(val) * 1000
        return dayjs(val).format(format)
    } else {
        return '--'
    }
}

export const isNull = (val) => {
    if (!val) {
        return true
    }
    if (JSON.stringify(val) === '{}') {
        return true
    }
    if (JSON.stringify(val) === '[]') {
        return true
    }
}

export default app => {
    app.config.globalProperties.$filters = {
        filterTimes
    }
}
