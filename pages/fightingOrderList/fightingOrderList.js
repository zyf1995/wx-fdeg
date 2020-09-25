// pages/fightingOrderList/fightingOrderList.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
function get_wxml(className, callback) {
  wx.createSelectorQuery().selectAll(className).boundingClientRect(callback).exec()
}
Page({
  data: {
    dataType: '9',
    tabArray:[{
      title: '全部',
      dataType: '9'
    },{
      title: '进行中',
      dataType: '1'
    },{
      title: '已拼成',
      dataType: '2'
    },{
      title: '已失效',
      dataType: '4'
    }],
    tabArray1: [{
      title: '我参与的',
      status: '10'
    },{
      title: '我发起的',
      status: '20'
    }],
    orderList: [],
    status: "10",
    type: 1,
    page: 1,
    hasMoreData: true,
    orderStatus: '9'
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      dataType: options.dataType || '9',
      orderStatus: options.dataType || '9'
    })
    get_wxml('.gs_tabs.gs_tabs2 .gs_t_item', (res) => {
      let width = res[0].width 
      if(that.data.dataType == '9'){
        that.setData({
          subleft1: width * 0
        })
      }else if(that.data.dataType == '1'){
        that.setData({
          subleft1: width * 1
        })
      }else if(that.data.dataType == '2'){
        that.setData({
          subleft1: width * 2
        })
      }else if(that.data.dataType == '4'){
        that.setData({
          subleft1: width * 3
        })
      }
    })
    that.getOrderList()
  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData) {
      var page = that.data.page + 1
      that.setData({
        page: page
      })
      that.getOrderList('scrolltobottom')
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  }, 
  getOrderList(type){
    let that = this
    that.data.orderStatus = that.data.orderStatus || that.data.dataType
    http.getOrderList({
      data: {
        status: that.data.orderStatus,
        type: that.data.status,
        page: that.data.page
      },
      success: res => {
        if (type == 'scrolltobottom') {
          var arr1 = that.data.orderList
          var arr2 = Object.values(res.data.data)
          arr1 = arr1.concat(arr2)
          that.setData({
            orderList: arr1
          })
          if (res.data.data.length == 0) {
            that.setData({
              hasMoreData: false
            })
          }
        } else {
          that.setData({
            orderList: Object.values(res.data.data)
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  typeS(e){
    let that = this
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    if(type == 1){
      that.data.orderStatus = '2'
    }else{
      that.data.orderStatus = '5'
    }
    get_wxml('.gs_tabs.gs_tabs1 .gs_t_item', (res) => {
      that.setData({
        subleft2: res[0].width * index
      })
    })
    that.setData({
      type: type,
      page: 1,
      orderStatus: that.data.orderStatus
    })
    that.getOrderList()
  },
  tabS1(e){
    let that = this
    let status = e.currentTarget.dataset.item.status
    let index = e.currentTarget.dataset.index
    that.setData({
      status: status,
      dataType: '9',
      page: 1,
      subleft1: 0,
      subleft2: 0
    })
    get_wxml('.gs_tabs.gs_tabs1 .gs_t_item', (res) => {
      that.setData({
        tableft: res[0].width * index
      })
    })
    that.getOrderList()
  },
  tabS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      dataType: item.dataType,
      orderStatus: item.dataType,
      type: '1',
      page: 1,
      subleft2: 0
    })
    get_wxml('.gs_tabs.gs_tabs2 .gs_t_item', (res) => {
      that.setData({
        subleft1: res[0].width * index
      })
    })
    that.getOrderList()
  },
  goOrderInfo(e){
    let that = this
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/fightingOrder/fightingOrder?pageFrom=orderList&goods_id=' + item.good_id + '&team_id=' + item.team_id + '&good_spec_id=' + item.good_spec_id + '&team_status=' + item.team_status,
    })
  },
  go_update(){
    let that = this
    that.getOrderList()
  },
  receive(e){
    let order_id = e.currentTarget.dataset.id
    let goods_id = e.currentTarget.dataset.goodid
    wx.navigateTo({
      url: '/pages/receiveProduct/receiveProduct?goods_id=' + goods_id + '&order_id=' + order_id,
    })
  },
  convert(e){
    let that = this
    let order_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '您确定要兑换百旺金豆吗？',
      success (res) {
        if (res.confirm) {
          http.forVouchers({
            data: {
              order_id: order_id
            },
            success: res => {
              toast: {
                app.wxToast({
                  title: res.msg
                })
              };
              that.getOrderList()
            },
            fail: err => {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})