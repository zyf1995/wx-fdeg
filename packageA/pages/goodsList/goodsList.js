// packageA/pages/goodsList/goodsList.js
import http from '../../../utils/api';
const app = getApp();
Page({
  data: {
    info: {
      cate_id: '28',
      name: '',
      types: 'normal'
    },
    list: [],
    page: 2,
    user_level: 0,
    hasMoreData: true
  },
  onLoad: function (options) {
    let that = this
    that.data.info.id = options.cate_id || 28;
    that.setData({
      "info.id": that.data.info.id,
      "info.cate_id": options.cate_id
    })
    that.getList()
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
  },
  changeVal: function (e) {
    let that = this
    that.setData({
      "info.name": e.detail.value
    })
  },
  search: function () {
    let that = this
    that.setData({
      "info.page": 1,
      "info.id": -1,
    })
    that.getList()
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          user_level: parseInt(res.data.level.level)
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData) {
      var page = that.data.info.page + 1
      that.setData({
        page: page
      })
      that.getList('scrolltobottom')
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  }, 
  getList: function (type) {
    let that = this
    if (type == 'scrolltobottom') {
      that.data.info.page = that.data.page
    } else {
        that.data.info.page = 1;
        that.data.page = 2
    }
    http.mallCateGoodsList({ // 调用接口，传入参数
      data: that.data.info,
      success: res => {
        if (type == 'scrolltobottom') {
          var arr1 = that.data.list
          var arr2 = res.data.pagedata.data
          arr1 = arr1.concat(arr2)
          that.setData({
            list: arr1
          })
          if (res.data.pagedata.data.length == 0) {
            that.setData({
              hasMoreData: false,
              toBottom: true
            })
          }
        } else {
          that.setData({
            list: res.data.pagedata.data
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  tabS: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      "info.types": type,
      "info.page": 1
    })
    that.getList()
  },
  toMallGoodsInfo: function (e) {
    let that = this
    let goodsId = e.currentTarget.dataset.id
    console.log(goodsId)
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + goodsId
    })
  },
})