// pages/mall/mall.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    impotBg: '#000',
    groupGoodsList: [],
    info: {},
    goodsList:[],
    page: 1,
    hasMoreData: true,
    toBottom: false,
    fightGoodsList: [],
    logList: [],
    animate:false,
    swiperImg: [],
    title_list: [],
  },
  onLoad: function (options) {
    let that = this
    that.getInfo()
    that.getGroupGoodsList()
    that.getList()
    that.user_guide()
    that.myShopmyShop()
  },
  user_guide(){
    let that = this
    http.user_guide({ 
      data: {
        cate_id:2,
        page:1,
        type: 20
      },
      success: res => {
        that.setData({
          title_list: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  toInfo: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/guideInfo/guideInfo?id=' + id,
    })
  },
  getInfo(){
    let that = this
    http.mallHome({ 
      data: {},
      success: res => {
        that.setData({
          info: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getList(){
    let that = this
    http.getgoodslist({
      data: {
        key_word: ''
      },
      success: res => {
        that.setData({
          fightGoodsList: res.data.data.slice(0,5)
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getGroupGoodsList(){
    http.groupGoodsList({ 
      data: {},
      success: res => {
        this.setData({
          groupGoodsList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  changeSwiper(e){
    let that = this
    let realIndex = e.detail.current
    if (!that.data.info.bannerlist.main[realIndex].color) {
        that.setData({
          impotBg: '#000'
        })
    }else{
        that.data.impotBg = that.data.info.bannerlist.main[realIndex].color;
        that.setData({
          impotBg: that.data.impotBg
        })
    }
  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData) {
      var page = that.data.page + 1
      that.setData({
        page: page
      })
      that.myShopmyShop('scrolltobottom')
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  }, 
  myShopmyShop: function (type) {
    let that = this
    let json = {
      page:that.data.page,
      cate_id: '-2',
      id: '-2',
      name: '',
      types: 'normal'
    }
    http.mallCateGoodsList({ 
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
          if (res.data.pagedata.data.length == 0) {
            that.setData({
              hasMoreData: false,
              toBottom: true
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
  toGoodsList: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: '/packageA/pages/goodsList/goodsList?cate_id=' + item.category_id,
      })
    }else {
      wx.navigateTo({
        url: '/packageA/pages/goodsList/goodsList',
      })
    }
  },
  toMallGoodsInfo(e){
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + goodsId
    })
  },
  toGoodsInfo(e){
    let goodsId = e.currentTarget.dataset.goodsid
    if(goodsId != 0){
      wx.navigateTo({
        url: '/pages/goodsInfo/goodsInfo?goodsId=' + goodsId
      })
    }
  },
  toGoodsPage: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if(item.type == 'category'){
      wx.navigateTo({
        url: '/packageA/pages/goodsList/goodsList?cate_id=' + item.category_id,
      })
    }else if(item.type == 'goods'){
      if(item.goods_id != 0){
        wx.navigateTo({
          url: '/pages/goodsInfo/goodsInfo?goodsId=' + item.goods_id,
        })
      }
    }
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/packageA/pages/goodsSearch/goodsSearch?currentType=1',
    })
  },
  goCateList(){
    wx.navigateTo({
      url: '/pages/cateList/cateList',
    })
  },
  shareApp: function () {
    if (!loginCheck.toLoginCheck()) {
      return false
    }
    wx.navigateTo({
      url: '/pages/shareApp/shareApp',
    })
  },
  seeMore(){
    wx.navigateTo({
      url: '/pages/fightOrderList/fightOrderList',
    })
  },
  toFightGoodsInfo(e){
    let id = e.currentTarget.dataset.id
    let goodsid = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/fightOrderDetail/fightOrderDetail?id=' + id + '&goodsid=' + goodsid,
    })
  },
  seeVipMore(){
    wx.navigateTo({
      url: '/pages/groupShopList/groupShopList',
    })
  },
  goGroupShopDetail(e){
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/groupShopDetail/groupShopDetail?goods_id=' + goodsId,
    })
  },
  goShopCart(){
    if (!loginCheck.toLoginCheck()) {
      return false
    }
    wx.navigateTo({
      url: '/pages/shopCart/shopCart',
    })
  }
})