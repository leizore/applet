import request from './request'
const app =  getApp();
// 获取用户信息
export const getUserInfor = (data) => {
  return request({ method: 'POST', url: 'Login/getWechatInfo', data})
}
