import { ROOT_URL, SUCCESS } from '../config/index'
const app =  getApp();

// 请求
function _http(r) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: ROOT_URL + r.url,
      data: r.data,
      header: r.header ? r.header : {},
      method: r.method ? r.method : 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (typeof res.data == 'string') {
          data = JSON.parse(data)
          resolve(data);
          return
        }
        if (res.data.code === SUCCESS) {
          resolve(res.data);
        } else {
          // do something
        }
			},
			fail: (res) => {
				 // do something
				reject(res)
			}
    })
  })
}

const request = options => {
  const token = wx.getStorageSync('token')
  if (token) {
    options.data = Object.assign(options.data ? options.data : {}, {token})
  }
  return _http(options)
}

export default request
