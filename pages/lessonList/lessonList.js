// packageB/pages/lessonList/lessonList.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    courseList:[],
    upUrl: app.globalData.upUrl,
    dataType: '0',
    tabArray: [{
      title: '种草',
      dataType: '0'
    },{
      title: '课程',
      dataType: '1'
    }],
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
    wxLivePage:1,
    vc_slide: {},
    vc_hot: {},
    vc_hao: {},
    vc_type: {},
    vc_detail: {},
    coursePoster: '',
    left: 0
  },
  onLoad: function (options) {
    let that = this
    that.getCourseList()
    that.getData()
    that.getLiveHotsale()
    that.getWechatLive()
    that.getCoursePoster()
  },
  getCourseList: function () {
    let that = this
    http.courseList({
      data: {},
      success: res => {
        that.setData({
          courseList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getCoursePoster: function () {
    let that = this
    http.coursePoster({
      data: {},
      success: res => {
        that.setData({
          coursePoster: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goLessonDetail: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/lessonDetail/lessonDetail?course_id=' + item.id,
    })
  },
  onPullDownRefresh(){
    let that = this
    that.getCourseList()
    that.getCoursePoster()
    that.getData()
    that.getLiveHotsale()
    that.getWechatLive()
    wx.stopPullDownRefresh()
  },
  goOrderList: function () {
    wx.navigateTo({
      url: '/pages/buyLessonList/buyLessonList',
    })
  },
  tabS(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      dataType: item.dataType
    })
    that.changeline(index)
    if(that.data.dataType == 2){
      that.getBanner()
      that.getVcType()
      that.getHotRank()
      that.getGoodLesson()      
    }
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
  onReachBottom: function () {
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
  toGoodsInfo(e){
    let that = this
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + goodsId
    })
  },
  getBanner: function () {
    let that = this
    http.vcSlide({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          vc_slide: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getVcType: function () {
    let that = this
    http.vcType({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          vc_type: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getHotRank: function () {
    let that = this
    http.vcHot({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          vc_hot: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getGoodLesson: function () {
    let that = this
    http.vcHao({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          vc_hao: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goMovie: function (e) {
    let that = this 
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/studyOnline/studyOnline?id=' + id,
    })
  },
  fnAllLessonList(e){
    let that = this 
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/studyAll/studyAll?id=' + id,
    })
  }
})