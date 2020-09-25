// pages/groupShopList/groupShopList.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    groupGoodsList: []
  },
  onLoad: function (options) {
    let that = this
    that.getGroupGoodsList()
  },
  goGroupShopDetail(e){
    let that = this
    let goods_id = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/groupShopDetail/groupShopDetail?goods_id=' + goods_id,
    })
  },
  getGroupGoodsList(){
    let that = this
    http.groupGoodsList({
      data: {},
      success: res => {
        // console.log('接口请求成功', res)
        that.setData({
          groupGoodsList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})