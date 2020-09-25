// pages/orderList/orderList.js
import http from '../../utils/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArray: [{
      title: '全部',
      dataType: 'all'
    }, {
      title: '待付款',
      dataType: 'payment'
    }, {
      title: '待发货',
      dataType: 'delivery'
    }, {
      title: '待收货',
      dataType: 'received'
    }, {
      title: '已完成',
      dataType: 'finish'
    }],
    dataType:'all',
    list: [],
    page:1,
    hasMoreData: true,
    pageSize: 8,
    navigationBarHeight: (app.globalData.mobileInfo.statusBarHeight + 44) + 'px',
    orderList:[],
    left: 0,
    tabWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      dataType: options.dataType || 'all'
    })
    const query = wx.createSelectorQuery()
    query.select('.gs_t_item').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        tabWidth: res[0].width
      })
      if(that.data.dataType == 'all'){
        that.setData({
          left: that.data.tabWidth * 0
        })
      }else if (that.data.dataType == 'payment') {
        that.setData({
          left: that.data.tabWidth * 1
        })
      } else if (that.data.dataType == 'delivery') {
        that.setData({
          left: that.data.tabWidth * 2
        })
      } else if (that.data.dataType == 'received') {
        that.setData({
          left: that.data.tabWidth * 3
        })
      } else if (that.data.dataType == 'finish') {
        that.setData({
          left: that.data.tabWidth * 4
        })
      }
    })
    that.getList('正在加载数据...') 
  },
  onPullDownRefresh: function () {
    this.data.page = 1
    this.getList('正在刷新数据')
  },
  // onReachBottom: function () {
  //   if (this.data.hasMoreData) {
  //     this.getList('加载更多数据')
  //   } else {
  //     wx.showToast({
  //       title: '没有更多数据',
  //     })
  //   }
  // },    
  myCenterPage: function () {
    wx.reLaunch({
      url: '/pages/my/my',
    })
  },
  getList: function (message) {
    let that = this
    wx.showNavigationBarLoading()					//在当前页面显示导航条加载动画
    wx.showLoading({								//显示 loading 提示框
      title: message,
    })
    http.mallOrderList({ // 调用接口，传入参数
      data: {
        dataType: that.data.dataType,
        page: that.data.page
      },
      success: res => {
        console.log('接口请求成功', res)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        that.setData({
          list: res.data
        })
      //  if(res.data.length > 0){
      //    var contentlistTem = that.data.list;
      //    wx.hideNavigationBarLoading()	
      //    wx.hideLoading()
      //    if (that.data.page == 1) {
      //      contentlistTem = []
      //    }
      //    let list = res.data;
      //    if (list.length < that.data.pageSize) {
      //      console.log(list)
      //      that.setData({
      //        list: contentlistTem.concat(list),
      //        hasMoreData: false
      //      })
      //    } else {
      //      that.setData({
      //        list: contentlistTem.concat(list),
      //        hasMoreData: true,
      //        page: that.data.page + 1
      //      })
      //    }
      //  }else{
      //    wx.hideNavigationBarLoading()		
      //    wx.hideLoading()
      //    that.setData({
      //      list: res.data,
      //      hasMoreData: false
      //    })
      //  }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  tabS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      dataType: item.dataType,
      page: 1
    })
    this.changeline(index)
    that.getList('正在加载数据...')
  },
  changeline(index){
    const query = wx.createSelectorQuery()
    var that = this
    query.select('.gs_t_item').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        left: res[0].width * index
      })
    })
  },
  toMallGoodsInfo: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + id,
    })
  },
  updateOrderListFinish: function() {
    let that = this
    console.log('我更新啦')
    that.getList('正在加载数据...')
  },
  updateOrderList: function () {
    let that = this
    console.log('我更新啦')
    that.getList('正在加载数据...')
  },
  goOrderInfo: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderInfo/orderInfo?id=' + id,
    })
  },
})