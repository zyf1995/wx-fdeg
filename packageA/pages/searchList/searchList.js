// packageA/pages/goodsList/goodsList.js
import http from '../../../utils/api';
const app = getApp();
Page({
  data: {
    currentType: 0,
    keyword: '',
    sortType: 'normal',
    user_level: '',
    user_level_next: '',
    page: 1,
    hasMoreData: true,
    goodsList: [],
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      keyword: options.keyword
    })
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
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
        if(that.data.user_level < 5){
          that.setData({
            user_level_next: parseInt(res.data.level.level) + 1
          }) 
        }
      },
      fail: err => {
        console.log(err)
      }
    })
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
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  }, 
  getList: function (type) {
    let that = this
    let json = {
      name: that.data.keyword,
      id: '-1',
      types: that.data.sortType,
      cate_id: -1,
      is_coupon: 0,
      is_tmall: 0,
      sort: '',
      page: that.data.page
    }
    http.mallCateGoodsList({ // 调用接口，传入参数
      data: json,
      success: res => {
        console.log('接口请求成功', res)
        if (type == 'scrolltobottom') {
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
  changeVal: function (e) {
    let that = this
    that.setData({
      keyword: e.detail.value
    })
  },
  search: function () {
    let that = this
    that.setData({
      page: 1,
      hasMoreData: true
    })
    that.getList()
  },
  tabS: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      sortType: type,
      page: 1,
      hasMoreData: true
    })
    that.getList()
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  toMallGoodsInfo: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + id,
    })
  }
})