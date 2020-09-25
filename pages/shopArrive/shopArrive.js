// pages/shopArrive/shopArrive.js
import http from '../../utils/api';
Page({

  data: {
    info: []
  },

  onLoad: function (options) {
    let that = this
    that.getUncollected()
  },
  getUncollected: function () {
    let that = this
    http.uncollected({
      data: {
        type: 56
      },
      success: res => {
        // console.log('接口请求成功', res)
        that.setData({
          info: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})