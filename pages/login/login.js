// pages/login/login.js
const app = getApp();
import http from '../../utils/api';
const event = require("../../utils/event.js");
Page({
  data: {
    session_key: '',
    showModal: false,
    avatar: "",
    nickname: "",
    pid: "",
    showModal1: false,
    code: '',
    inviterInfo: {},
    isObj: {},
    upUrl: app.globalData.upUrl
  },

  onLoad: function (options) {
    let that = this
    that.setData({
      pid: wx.getStorageSync('pid') || '',
      isObj: JSON.stringify({})
    })

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
        } else {
          //用户没有授权
          console.log("用户没有授权");
        }
      }
    })
  },
  cancel: function () {
    wx.reLaunch({
      url: '/pages/mall/mall',
    })
  },
  changeVal: function (e) {
    let that = this
    that.setData({
      code: e.detail.value
    })
  },
  query: function () {
    var that = this
    if(!that.data.code){
      toast: {
        app.wxToast({
          title: "邀请码不能为空"
        })
      };
      return false
    }
    http.checkRecommender({
      data: {
        mobile: that.data.code
      },
      success: res => {
        if (res.code == 1) {
          that.setData({
            inviterInfo: res.data,
            isObj: JSON.stringify(res.data)
          })
        } else {
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
  },
  submit: function () {
    let that = this
    console.log(that.data.isObj)
    if (that.data.isObj == '{}'){
      toast: {
        app.wxToast({
          title: "请您填写邀请人"
        })
      };
      return false
    }else{
      that.setData({
        showModal1: false,
        showModal: true
      })
    }
  },
  bindgetuserinfo: function (e) {
    let that = this
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      avatar: e.detail.userInfo.avatarUrl,
      nickname: e.detail.userInfo.nickName
    })
    if (e.detail) {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            http.wechatLogin({
              data: {
                pid: that.data.pid,
                js_code: res.code,
                encrypted_data: e.detail.encryptedData,
                iv: e.detail.iv,
              },
              success: res => {
                // toast: {
                //   app.wxToast({
                //     title: res.msg
                //   })
                // };
                that.setData({
                  session_key: res.data.session_key
                })
                if (res.code == 1) {
                  wx.setStorage({
                    key: 'hdt_userInfo',
                    data: res.data.userinfo,
                  })
                  wx.navigateBack({
                    delta: 1,
                    success: function (e) {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();
                    }
                  })
                }
                if (res.code == 0 && res.msg == '解密失败') {
                  toast: {
                    app.wxToast({
                      title: "登录失败，请重新登录"
                    })
                  };
                }
                if (res.code == 0 && res.msg == '请获取手机号进行登录' && res.data.is_pid == false) {
                  toast: {
                    app.wxToast({
                      title: "请您先认证邀请人"
                    })
                  };
                  that.setData({
                    showModal1: true
                  })
                }
                if (res.code == 0 && res.msg == '请获取手机号进行登录' && res.data.is_pid == true) {
                  toast: {
                    app.wxToast({
                      title: "请获取手机号进行登录"
                    })
                  };
                  that.setData({
                    showModal: true
                  })
                }
              },
              fail: err => {
                console.log(err)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  getPhoneNumber: function (e) {
    let that = this
    http.wechatMobileLogin({
      data: {
        pid: that.data.pid || that.data.inviterInfo.id,
        avatar: that.data.avatar,
        nickname: that.data.nickname,
        iv: e.detail.iv,
        encrypted_data: e.detail.encryptedData,
        session_key: that.data.session_key
      },
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if (res.code == 1) {
          wx.setStorage({
            key: 'hdt_userInfo',
            data: res.data.userinfo,
          })
          wx.navigateBack({
            delta: 1,
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})
