// pages/receiveProduct/receiveProduct.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    goods_id: '',
    order_id: '',
    goodsInfo: {},
    address:{},
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      goods_id: options.goods_id,
      order_id: options.order_id
    })
    that.getGoodDetail()
    that.getAddressDefault()
  },
  getGoodDetail(){
    let that = this
    http.getgoodsdetail({
      data: {
        good_id: that.data.goods_id
      },
      success: res => {
        that.setData({
          goodsInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goAddressAdd() {
    wx.navigateTo({
      url: '/pages/addressAdd/addressAdd'
    })
  },
  getAddressDefault: function () {
    let that = this
    http.dsAddressDefault({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          address: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  go_update() {
    let that = this
    console.log('我更新啦1111')
    that.getAddressDefault()
  },
  goAddressList() {
    wx.navigateTo({
      url: '/pages/addressList/addressList?fromPage=orderConfirm'
    })
  },
  submit(){
    let that = this
    http.forGood({
      data: {
        order_id: that.data.order_id,
        address_id: that.data.address.address_id
      },
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if(res.code == 1){
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.setData({
            txt: '修改数据了'
          })
          beforePage.go_update();
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})