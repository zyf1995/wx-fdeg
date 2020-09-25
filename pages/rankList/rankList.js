// pages/rankList/rankList.js
import http from '../../utils/api';
Page({
  data: {
    rankList: []
  },
  onLoad: function (options) {
    let that = this
    that.getRankList()
  },
  getRankList(){
    let that = this
    http.get_ranking({
      data: {},
      success: res => {
        that.setData({
          rankList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})