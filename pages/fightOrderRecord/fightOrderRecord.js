// pages/fightOrderRecord/fightOrderRecord.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    goods_id: '',
    sucTeamList: []
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      goods_id: options.goods_id
    })
    that.getSuccessTeamList()
  },
  getSuccessTeamList(){
    let that = this
    http.getTeamList({
      data: {
        good_id: that.data.goods_id,
        status: 20
      },
      success: res => {
        that.setData({
          sucTeamList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
})