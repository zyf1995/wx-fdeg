// pages/cateList/cateList.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    list: [],
    currentIndex:0,
    currentList:[],
    leftMenuH: 0
  },
  onLoad: function (options) {
    let that = this
    that.getCateList()
    this.setData({
      leftMenuH: wx.getSystemInfoSync().windowHeight*2 - 120
    })
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/packageA/pages/goodsSearch/goodsSearch?currentType=1',
    })
  },
  getCateList(){
    let that = this
    http.mall_category({ 
      data: {},
      success: res => {
        that.setData({
          list: res.data.categorydata,
          currentList: res.data.categorydata[0]
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  cateS: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      currentIndex: index,
      currentList: that.data.list[index]
    })
  },
  toGoodsList(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packageA/pages/goodsList/goodsList?cate_id=' + id,
    })
  }
})