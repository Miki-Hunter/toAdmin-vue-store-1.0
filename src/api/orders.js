import request from './request'

export const getOrders = (params) => {
    return request({
        url: '/user/order/getOrderBySearch/',
        method: 'get',
        params
    })
}

export const deleteOrder = (id) => {
    return request({
        url: `/user/order/deleteOrder/${id}/`,
        method: 'delete'
    })
}

export const getOrdersInfo = () => {
    return request({
        url: '/user/order/getOrdersInfo/',
        method: 'get'
    })
}
