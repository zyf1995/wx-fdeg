// pages/technicianList/technicianList.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    technicianList: [],
    store_id: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      store_id: options.store_id
    })
    that.getTechnicianList()
  },
  getTechnicianList(){
    let that = this
    http.technician_list({
      data: {
        store_id: that.data.store_id || '7'
      },
      success: res => {
        that.setData({
          technicianList: res.data.list
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goBack(){
    wx.navigateBack()
  },
  selectTechnician(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      technicianList: item,
    })
    prevPage.go_update();
    wx.navigateBack({
        delta: 1,
    })
  }
})