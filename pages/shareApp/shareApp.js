// pages/shareApp/shareApp.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    imgUrl: [],
    showDialog: false,
    poster: ''
  },
  onLoad: function (options) {
    let that = this
    that.getHomeShare()
  },
  getHomeShare: function () {
    let that = this
    wx.showLoading({								
      title: "正在加载···",
    })
    http.homeShare({
      data: {},
      success: res => {
        wx.hideLoading()
        that.setData({
          imgUrl: res.data,
          poster: res.data[0]
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onSlideChange(e){
    let that = this
    that.setData({
      poster: that.data.imgUrl[e.detail.current]
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
  },
})