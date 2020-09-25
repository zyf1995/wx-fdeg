// packageA/pages/goodsList/goodsList.js
import http from '../../../utils/api';
const app = getApp();
Page({
  data: {
    keyword: '',
    goodsList: [],
    store_id: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      keyword: options.keyword,
      store_id: options.store_id
    })
    that.getSearchList()
  },
  changeVal: function (e) {
    let that = this
    that.setData({
      keyword: e.detail.value
    })
  },
  search: function () {
    let that = this
    that.getSearchList()
  },
  getSearchList: function () {
    let that = this
    http.dsSearchList({
      data: {
        name: that.data.keyword,
        store_id: that.data.store_id
      },
      success: res => {
        that.setData({
          goodsList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getshopDetail: function (e) {
    let that = this
    let product_id = e.currentTarget.dataset.item.store_product_id
    console.log(product_id)
    wx.navigateTo({
      url: '/pages/dsShopDetail/dsShopDetail?product_id=' + product_id,
    })
  }
})