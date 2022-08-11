import request from './request'

export const getUser = (params) => {
    return request({
        url: '/users/getUsers/',
        method: 'get',
        params
    })
}

export const changeUserState = (data) => {
    return request({
        url: '/users/changeUserState/',
        method: 'post',
        data
    })
}

export const addUser = (data) => {
    return request({
        url: '/users/register/',
        method: 'post',
        data
    })
}

export const editUser = (data) => {
    return request({
        url: '/users/editUser/',
        method: 'post',
        data
    })
}

export const deleteUser = (id) => {
    return request({
        url: `/users/deleteUser/${id}/`,
        method: 'delete'
    })
}
