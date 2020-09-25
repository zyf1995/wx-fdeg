// packageA/pages/goodsList/goodsList.js
import http from '../../../utils/api';
const app = getApp();
Page({
  data: {
    currentType: 0,
    keyword: '',
    store_id: '',
    from: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      currentType: options.currentType,
      store_id: options.store_id || '',
      from: options.from || ''
    })
  },
  changeVal: function (e) {
    let that = this
    that.setData({
      keyword: e.detail.value
    })
  },
  search: function () {
    let that = this
    if(!that.data.keyword){
      toast: {
        app.wxToast({
          title: '搜索关键词不能为空'
        })
      };
      return false
    }
    if(that.data.currentType == 0){
      wx.navigateTo({
        url: '/packageA/pages/dsSearchList/dsSearchList?keyword=' + that.data.keyword + '&store_id=' + that.data.store_id, 
      })
    }else if(that.data.currentType == 1){
      wx.navigateTo({
        url: '/packageA/pages/searchList/searchList?keyword=' + that.data.keyword,
      })
    }
  },
  tabS: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      currentType: index
    })
  }
})