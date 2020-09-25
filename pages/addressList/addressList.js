// pages/addressAdd/addressAdd.js
import http from '../../utils/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromPage:"",
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.data.fromPage = options.fromPage || ""
    that.addressList()
  },
  addressList: function (options) {
    let that = this
    http.addressList({ // 调用接口，传入参数
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          list: res.data.list
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  defaultS: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    http.addressDefault({
      data: {
        id: id
      },
      success: res => {
        console.log('接口请求成功', res)
        that.data.list.forEach(function (ele, index) {
          if (ele.address_id == id) {
            that.setData({
              "ele.isdefault": 1
            })
            that.addressList()
          } else {
            that.setData({
              "ele.isdefault": 0
            })
          }
        })
        if (that.data.fromPage == 'orderConfirm') {
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.setData({
            txt: '修改数据了'
          })
          beforePage.go_update();   
          wx.navigateBack({         
            delta: 1
          })
        } else {
          console.log(res.msg)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  //更新本页面
  go_update() {
    let that = this
    console.log('我更新啦')
    that.addressList()
  },
  edit: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/addressAdd/addressAdd?handle=edit&id=' + item.address_id,
    })
  },
  deleteAddress: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if (item.isdefault == 1) {
      toast: {
        //调用
        app.wxToast({
          title: '无法删除默认项'
        })
      };
      return false
    } else {
      http.addressDelete({
        data:{
          id: item.address_id
        },
        success: res => {
          console.log('接口请求成功', res)
          that.addressList()
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },

})