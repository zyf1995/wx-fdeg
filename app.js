//app.js
let loginCheck = require('utils/loginCheck');
import http from 'utils/api';
import wxToast from 'toast/toast.js'; 
App({
  wxToast,
  onShow(options) {
    if(options.scene == 1007 || options.scene == 1008 || options.scene == 1044 || options.scene == 1011 || options.scene == 1012 || options.scene == 1014 || options.scene == 1036 || options.scene == 1047 || options.scene == 1048 || options.scene == 1049){
        // if(!loginCheck.toLoginCheck()){
        //   return false
        // }else{
        //   console.log('分享二维码进入已登录')
        // }
        http.userInfo({
          data:{},
          success: res => {
            this.globalData.userInfo = res.data
          },
          fail: err => {
            console.log(err)
          }
        })
    }
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
       // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){

        }else{
          console.log('登陆失败' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.mobileInfo = res
      }
    })
  },
  globalData: {
    userInfo: null,
    mobileInfo: null,
    upUrl:'https://hdt.hdtapp.com/',
    cdnUrl:'http://cdn.weitaosong.com/'
  }
})