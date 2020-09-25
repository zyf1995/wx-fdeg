// pages/home/home.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveBanner:[],
    liveHotsale:[],
    cateList: [{ name: '全部',id:'all'}],
    top_data:[],
    tindex:0,
    on_line_list:[],
    toBottom:false,
    type:'all',
    page: 1,
    hasMoreData: true,
    hasMoreData1: true,
    pageSize: 8,
    animation:{},
    currentTab: 0,
    scrollLeft: 0, 
    winHeight:"",
    wechatLiveList:[],
    wxLivePage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getData()
    that.getLiveHotsale()
    that.getcateList()
    that.getOnLineList('正在加载数据...') 
    that.getWechatLive()
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  switchTab: function (e) {
    let that = this
    let typeid = that.data.cateList
    this.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
    that.setData({
      type: typeid[that.data.currentTab].id,
      page: 1
    })
    that.getOnLineList('正在刷新数据')
  },
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  swichNav: function (e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
    that.setData({
      type: e.currentTarget.dataset.title.id,
      page: 1
    })
    that.getOnLineList('正在刷新数据')
  },
  getWechatLive: function (){
    let that = this
    http.getwechatlive({ // 调用接口，传入参数
      data: {
        page: that.data.wxLivePage
      },
      success: res => {
        console.log('getwechatlive接口请求成功', res)
        if (res.data.length > 0) {
          var wechatLiveList1 = that.data.wechatLiveList;
          if (that.data.wxLivePage == 1) {
            wechatLiveList1 = []
          }
          let wechatLiveList = res.data;
          if (wechatLiveList.length < that.data.pageSize) {
            that.setData({
              wechatLiveList: wechatLiveList1.concat(wechatLiveList),
              hasMoreData1: false
            })
          } else {
            that.setData({
              wechatLiveList: wechatLiveList1.concat(wechatLiveList),
              hasMoreData1: true,
              page: that.data.wxLivePage + 1
            })
          }
        } else {
          that.setData({
            wechatLiveList: res.data,
            hasMoreData1: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goSearch(){
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      wx.navigateTo({
        url: '/pages/liveSearch/liveSearch',
      })
    }
  },
  goCart(){
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      wx.navigateTo({
        url: '/pages/shopCart/shopCart',
      })
    }
  },
  getData() {
    http.liveBanner({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          liveBanner: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onReachBottom: function () {
    // if (this.data.hasMoreData) {
    //   this.getOnLineList('加载更多数据')
    // } else {
    //   toast: {
    //     app.wxToast({
    //       title: '没有更多数据'
    //     })
    //   };
    // }
    if (this.data.hasMoreData1) {
      this.getWechatLive()
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  }, 
  getLiveHotsale() {
    http.liveHotSale({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          liveHotsale: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getcateList: function () {
    let that = this
    http.onLineList({
      data: {
        type_id: 'all',
        page: 1
      },
      success: res => {
        that.setData({
          cateList: that.data.cateList.concat(res.data.type),
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getOnLineList(message) {
    let that = this
    wx.showNavigationBarLoading()				
    wx.showLoading({								
      title: message,
    })
    http.onLineList({ // 调用接口，传入参数
      data: {
        type_id: that.data.type,
        page: that.data.page
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          top_data: res.data.top_data
        })
        if (res.data.on_line_list.length > 0){
          var contentlistTem = that.data.on_line_list;
          wx.hideNavigationBarLoading()		
          wx.hideLoading()
          if (that.data.page == 1) {
            contentlistTem = []
          }
          let on_line_list = res.data.on_line_list;
          if (on_line_list.length < that.data.pageSize) {
            that.setData({
              on_line_list: contentlistTem.concat(on_line_list),
              hasMoreData: false
            })
          } else {
            that.setData({
              on_line_list: contentlistTem.concat(on_line_list),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        }else{
          wx.hideNavigationBarLoading()	
          wx.hideLoading()
          that.setData({
            on_line_list: res.data.on_line_list,
            hasMoreData: false
          })
        }
        
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onPullDownRefresh(){
    let that = this
    that.getOnLineList('正在刷新数据')
    that.getLiveHotsale()
    that.getData()
    that.getWechatLive()
    wx.stopPullDownRefresh()
  },
  toGoodsInfo(e){
    let that = this
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + goodsId
    })
  },
  // tabS(e){
  //   let that = this
  //   let index = e.currentTarget.dataset.index
  //   that.setData({
  //     tindex: index,
  //     type: e.currentTarget.dataset.title.id,
  //     page:1
  //   })
  //   that.getOnLineList('正在刷新数据')
  //   let query = wx.createSelectorQuery()
  //   query.select('.headerUl .li').boundingClientRect(function (rect) {
  //     console.log(rect.width)
  //     let liWidth = rect.width
  //   }).exec()
    
  // },
  gowxLive: function (e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    let roomId = item.roomid;
    let title = item.name;
    let cover = item.cover_img;
    let start_time = item.start_time;
    let pid = wx.getStorageSync('hdt_userInfo').id;
    // let customParams = { pid: pid }
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      wx.navigateTo({
        url: '/pages/wxShare/wxShare?roomId=' + roomId + "&pid=" + pid,
      })
    }
  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  goSeeLive: function (e) {
    let that = this
    let room = e.currentTarget.dataset.room
    let room1 = encodeURIComponent(JSON.stringify(room))
    if (room.status == 2){
      wx.navigateTo({
        url: '/pages/watchLive/watchLive?room=' + room1,
      })
    }else{
      wx.navigateTo({
        url: '/pages/orderAnchor/orderAnchor?room=' + room1,
      })
    }
  }
})