// pages/shopCenter/shopCenter.js
import http from '../../utils/api';
Page({

  data: {
    userInfo: {
      level: {
        name: ''
      }
    },
    shopInfo: {
      p_info: {
        mobile: ''
      }
    }
  },
  onLoad: function (options) {
    let that = this
    that.getUserInfo()
    that.getShopInfo()
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getShopInfo: function () {
    let that = this
    http.shopCenter({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          shopInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goShopTeamOrder: function () {
    wx.navigateTo({
      url: '/pages/shopTeamOrder/shopTeamOrder',
    })
  },
  goTeamList: function () {
    wx.navigateTo({
      url: '/pages/teamList/teamList',
    })
  },
  goApplyHelp: function () {
    wx.navigateTo({
      url: '/pages/applyHelp/applyHelp',
    })
  }
})