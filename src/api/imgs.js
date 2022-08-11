import request from './request'

export const getDetailsPicture = (data) => {
  return request({
    url: 'product/getDetailsPicture/',
    method: 'POST',
    data
  })
}

export const carouselLists = () => {
    return request({
      url: 'resources/carousel/',
      method: 'get'
    })
}

export const delelteCarousel = (id) => {
    return request({
      url: 'resources/carousel/' + id + '/',
      method: 'delete'
    })
}

export const newCarousel = (data) => {
    return request({
      url: 'resources/carousel/',
      method: 'post',
      data
    })
}

export const getProductPicture = (params) => {
  return request({
    url: 'product/getDetailsPicture/',
    method: 'get',
    params
  })
}

export const deleteProductPicture = (id) => {
  return request({
    url: 'product/getDetailsPicture/' + id + '/',
    method: 'delete'
  })
}

export const newProductImag = (data) => {
  return request({
    url: 'product/getDetailsPicture/',
    method: 'post',
    data
  })
}
