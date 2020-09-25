// pages/guideInfo/guideInfo.js
import http from '../../utils/api';
const loginCheck = require('../../utils/loginCheck');
Page({
  data: {
    info: {},
    id: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      id: options.id
    })
    that.getInfo()
  },
  getInfo(){
    let that = this
    http.user_guideInfo({ 
      data: {
        id:that.data.id
      },
      success: res => {
        let content = loginCheck.formatRichText(res.data.content)
        that.setData({
          info: res.data,
          "info.content": content
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})