import request from './request'

export const getCatetory = () => {
    return request({
        url: '/product/getCategory/'
    })
}

export const getProductByCategory = (data) => {
    return request({
        url: '/product/getProductByCategory/',
        method: 'post',
        data
    })
}

export const getProductDetails = (data) => {
    return request({
        url: '/product/getDetails/',
        method: 'post',
        data
    })
}

export const deleteProduct = (id) => {
    return request({
        url: '/product/deleteProduct/' + id + '/',
        method: 'delete'
    })
}

export const updateProduct = (data) => {
    return request({
        url: '/product/updateProduct/',
        method: 'post',
        data
    })
}
