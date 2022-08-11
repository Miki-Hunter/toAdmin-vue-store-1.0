import request from './request'

export const login = (data) => {
  return request({
    url: 'users/loginAdmin/',
    method: 'POST',
    data
  })
}
