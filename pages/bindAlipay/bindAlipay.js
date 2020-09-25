// pages/bindAlipay/bindAlipay.js
import http from '../../utils/api';
const app = getApp();
let loginCheck = require('../../utils/loginCheck');
Page({
  data: {
    userInfo: {},
    sendable: true,
    info: {
      number: 60,
      mobile: '',
      code: '',
      alipay: '',
      alipay_name: '',
      type: 'alipay',
      handle: 'bind'
    }
  },
  onLoad: function (options) {
    let that = this
    that.getUserInfo()
    that.getInfo()
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          userInfo: res.data,
          "info.mobile": res.data.mobile
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getInfo: function () {
    let that = this
    http.bindAlipay({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        if (!res.data) {
          that.setData({
            "info.handle": 'bind'
          })
        } else {
          that.setData({
            "info.handle": 'update',
            "info.alipay": res.data.alipay,
            "info.alipay_name": res.data.alipay_name
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  updateValue: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    if(type == 'name'){
      that.setData({
        "info.alipay_name": e.detail.value
      })
    } else if (type == 'alipay'){
      that.setData({
        "info.alipay": e.detail.value
      })
    } else if (type == 'mobile') {
      that.setData({
        "info.mobile": e.detail.value
      })
    } else if (type == 'code') {
      that.setData({
        "info.code": e.detail.value
      })
    }
  },
  sendMsg: function () {
    let that = this;
    if (!that.data.info.mobile || !loginCheck.mobileVerify(that.data.info.mobile)) {
      toast: {
        app.wxToast({
          title: "请输入正确的账号"
        })
      };
      return false
    }
    http.sendSms({
      data: {
        mobile: that.data.info.mobile,
        event: 'band_account'
      },
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        that.countDown()
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  countDown: function () {
    var that = this;
    that.setData({
      sendable: false,
      "info.number": 60
    })
    var timer1 = setInterval(function () {
      if (that.data.info.number == 0) {
        clearInterval(timer1);
        that.setData({
          sendable: true
        })
      } else {
        that.data.info.number--
        that.setData({
          "info.number": that.data.info.number
        })
      }

    }, 1000)
  },
  bind: function () {
    var that = this
    if (!that.data.info.alipay_name) {
      toast: {
        app.wxToast({
          title: "请填写姓名"
        })
      };
      return false
    }
    if (!that.data.info.alipay) {
      toast: {
        app.wxToast({
          title: "请填写支付宝账号"
        })
      };
      return false
    }
    if (!that.data.info.code) {
      toast: {
        app.wxToast({
          title: "请填写验证码"
        })
      };
      return false
    }
    http.bindAlipay1({
      data: that.data.info,
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        beforePage.setData({
          txt: '修改数据了'
        })
        beforePage.go_update();
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
})