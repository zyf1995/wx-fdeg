// pages/teamList/teamList.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    info: {
      keyword: ''
    },
    list: [],
    teamInfo: {},
    type: '',
    page: 1,
    pageSize: 10,
    hasMoreData: true
  },
  onLoad: function (options) {
    let that = this
    that.getInfo()
    that.getList()
  },
  updateValue: function (e) {
    let that = this
    that.setData({
      "info.keyword": e.detail.value,
      page: 1
    })
    that.getList()
  },
  search: function () {
    var that = this
    that.setData({
      page: 1
    })
    that.getList()
  },
  typeS: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type
    if (that.data.type == type) {
      that.setData({
        type: ''
      })
    } else {
      that.setData({
        type: type
      })
    }
    that.setData({
      page: 1
    })
    that.getList()
  },
  getInfo: function () {
    let that = this
    http.teamAssets({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          teamInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData){
      var page = that.data.page + 1
      that.setData({
        page: page
      })
      that.getList('scrolltobottom')
    }else{
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }  
  }, 
  getList: function (type) {
    let that = this
    http.teamList({ // 调用接口，传入参数
      data: {
        keyword: that.data.info.keyword,
        type: that.data.type,
        page: that.data.page
      },
      success: res => {
        if (type == 'scrolltobottom'){
          var arr1 = that.data.list
          var arr2 = res.data
          arr1 = arr1.concat(arr2)
          that.setData({
            list: arr1
          })
          if (res.data.length == 0) {
            that.setData({
              hasMoreData: false
            })
          }
        }else{
          that.setData({
            list: res.data
          })
        }
        
      },
      fail: err => {
        console.log(err)
      }
    })
  },
})