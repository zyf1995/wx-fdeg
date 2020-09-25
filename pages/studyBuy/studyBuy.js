// pages/studyBuy/studyBuy.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    id: '34',
    showModel: false,
    payInfo: {
      type: 'miniapp',
      password: ''
    },
    userInfo: {},
  },

  onLoad: function (options) {
    let that = this
    that.setData({
      id: options.id
    })
    that.getDetail();
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
  },
  getUserInfo: function (options) {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        that.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getDetail: function () {
    let that = this
    http.vcDetail({ // 调用接口，传入参数
      data: {
        course_id: that.data.id
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          vc_detail: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  payPanelS(){
    let that = this
    that.setData({
      showModel: true
    })
  },
  preventTouchMove(){
    let that = this
    that.setData({
      showModel: false
    })
  },
  updateValue: function (e) {
    let that = this;
    that.setData({
      "payInfo.password": e.detail.value
    })
  },
  payTypeS(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      "payInfo.type": type
    })
  },
  submit(){
    let that = this
    that.setData({
      showModel: false
    })
    let json = {}
    json = {
      course_id:that.data.vc_detail.id,
      type:that.data.payInfo.type
    }
    if (that.data.payInfo.type == 'money') {
      json.password = that.data.payInfo.password;
      if (!that.data.payInfo.password) {
          toast: {
            app.wxToast({
              title: '请输入支付密码'
            })
          };
          return false;
      }
    }else if(that.data.payInfo.type == 'miniapp'){
      wx.showLoading({
        title: "正在调起支付···",
        mask: true
      })
    }
    http.vc_course_pay({
      data: json,
      success: res => {
        wx.hideLoading()
        if(res.code == 1){
          if(that.data.payInfo.type == 'miniapp'){
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function (res) {
                toast: {
                  app.wxToast({
                    title: '支付成功'
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
              fail: function (err) {
                toast: {
                  app.wxToast({
                    title: '支付失败'
                  })
                };
              }
            })
          }else if(that.data.payInfo.type == 'money'){
            toast: {
              app.wxToast({
                title: '支付成功'
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
          }
        }else{
          toast: {
            app.wxToast({
              title: res.msg
            })
          };
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})