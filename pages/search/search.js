// pages/search/search.js
import http from '../../utils/api';
Page({
  data: {
    keywords: '',
    goodsList: [],
    sortType: 'normal',
    page: 1,
    hasMoreData: true
  },
  onLoad: function (options) {

  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData) {
      var page = that.data.page + 1
      that.setData({
        page: page
      })
      that.getList('scrolltobottom')
    } else {
      
    }
  },
  getList: function (type) {
    let that = this
    http.mallCateGoodsList({ // 调用接口，传入参数
      data: {
        id: -1,
        cate_id: -1,
        types: that.data.sortType,
        name: that.data.keywords,
        page: that.data.page
      },
      success: res => {
        console.log('接口请求成功', res)
        if (type == 'scrolltobottom') {
          console.log(11)
          var arr1 = that.data.goodsList
          var arr2 = res.data.pagedata.data
          arr1 = arr1.concat(arr2)
          that.setData({
            goodsList: arr1
          })
          if (that.data.page > res.data.pagedata.last_page) {
            that.setData({
              hasMoreData: false
            })
          }
        } else {
          that.setData({
            goodsList: res.data.pagedata.data
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  changeVal: function(e) {
    let that = this
    that.setData({
      keywords: e.detail.value
    })
  },
  search: function (e) {
    let that = this
    that.getList()
  },
  sortTypeS: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      sortType: type,
      page: 1
    })
    that.getList()
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  toMallGoodsInfo: function (e) {
    let that = this
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + goodsId
    }) 
  }
})