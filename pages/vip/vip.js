// pages/vip/vip.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const event = require("../../utils/event.js");
const app = getApp();
Page({
  data: {
    currentTab: 0,
    info:{},
    userInfo:{},
    vipPoster: ''
  },
  onLoad: function (options) {
    let that = this
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
    event.$on({
      name:"updateUserInfo",
      tg:this,
      success:(res)=>{
        console.log("收到消息了-------",res);
        that.getUserInfo()
      }
    })
    that.getInfo()
    that.getVipPoster()
  },
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  clickTab: function (e) {
    var that = this;
    let current = e.currentTarget.dataset.current
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
  },
  onPullDownRefresh() {
    let that = this
    that.getInfo();
    that.getVipPoster()
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
    wx.stopPullDownRefresh()
  },
  getUserInfo: function () {
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
  getVipPoster: function () {
    let that = this
    http.vipPoster({
      data: {},
      success: res => {
        that.setData({
          vipPoster: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goShopProfit: function () {
    wx.navigateTo({
      url: '/pages/shopProfitDetail/shopProfitDetail?type=baiWangJinDou',
    })
  },
  copy: function () {
    let that = this
    wx.setClipboardData({
      data: that.data.userInfo.mobile,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  shareApp: function () {
    if (!loginCheck.toLoginCheck()) {
      return false
    }
    wx.navigateTo({
      url: '/pages/shareApp/shareApp',
    })
  },
  getInfo(){
    let that = this
    http.shopPackage({ 
      data: {},
      success: res => {
        that.setData({
          info: res.data,
          "info.total_num": parseInt(res.data.total_num),
          "info.residue_num": parseInt(res.data.residue_num)
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  toVipGoodsInfo(e){
    let goodsid = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/vipGoodsInfo/vipGoodsInfo?goodsid=' + goodsid,
    })
  }
})