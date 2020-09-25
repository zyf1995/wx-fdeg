// pages/wxShare/wxShare.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
Page({

  data: {
    roomId: "",
    title: "",
    cover: "",
    pid: "",
    poster: "",
    start_time: "",
    showDialog: false,
    showModel: false,
    wechatLiveInfo: {}
  },
  onShareAppMessage: function () {
    console.log(this.data.pid)
    return {
      title: this.data.wechatLiveInfo.name, //转发页面的标题
      path: '/pages/wxShare/wxShare?roomId=' + this.data.roomId + '&pid=' + this.data.pid,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    if (options.scene) {
      let getQueryString = {}
      let strs = decodeURIComponent(options.scene).split('&')
      for (var i = 0; i < strs.length; i++) {
        getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
      that.setData({
        roomId: getQueryString['roomId'],
        pid: getQueryString['pid']
      })
      wx.setStorage({
        key: 'pid',
        data: getQueryString['pid']
      })
    } else {
      let pid = ""
      if (options.pid) {
        pid = options.pid
      } else {
        pid = wx.getStorageSync('pid')
      }
      that.setData({
        roomId: options.roomId,
        pid: pid
      })
      wx.setStorage({
        key: 'pid',
        data: pid
      })
    }
    that.getWechatLiveInfo()
  },
  getWechatLiveInfo: function () {
    let that = this
    http.getWechatLiveInfo({
      data: {
        room_id: that.data.roomId
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          wechatLiveInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getWxLiveShare: function () {
    let that = this;
    let pid = wx.getStorageSync('hdt_userInfo').id || that.data.pid
    http.wxLiveShare({
      data: {
        room_id: that.data.roomId,
        pid: pid
      },
      success: res => {
        console.log('接口请求成功', res)
        wx.hideLoading()
        that.setData({
          poster: 'https://' + res.data.qr
        })
        console.log(that.data.poster)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  joinRoom: function () {
    let that = this
    let customParams = { pid: that.data.pid }
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${that.data.roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
      })
    }
  },
  shareProduct: function () {
    let that = this
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      that.setData({
        showModel: true
      })
      that.getWxLiveShare()
      wx.showLoading({								//显示 loading 提示框
        title: "正在生成海报···",
      })
    }
  },
  preventTouchMove: function () {
    this.setData({
      showModel: false
    })
  },
  share: function () {
    wx.showLoading({
      title: "正在下载···",
    })
    this.wxToPromise('downloadFile', {
      url: this.data.poster
    })
      .then(res => this.wxToPromise('saveImageToPhotosAlbum', {
        filePath: res.tempFilePath
      }))
      .then(res => {
        console.log(res);
        wx.hideLoading()
        wx.showToast({
          title: '保存成功~',
          icon: 'success',
        });
      })
      .catch(({ errMsg }) => {
        console.log(errMsg)
        wx.hideLoading()
        // if (~errMsg.indexOf('cancel')) return;
        if (!~errMsg.indexOf('auth')) {
          wx.showToast({ title: '图片保存失败，稍后再试', icon: 'none' });
        } else {
          // 调用授权提示弹框
          this.setData({
            showDialog: true
          })
        };
      })
  },
  wxToPromise(method, opt) {
    return new Promise((resolve, reject) => {
      wx[method]({
        ...opt,
        success(res) {
          opt.success && opt.success();
          resolve(res)
        },
        fail(err) {
          opt.fail && opt.fail();
          reject(err)
        }
      })
    });
  },
  confirm() {
    this.setData({
      showDialog: false
    })
  },
  cancel() {
    this.setData({
      showDialog: false
    })
  }
})