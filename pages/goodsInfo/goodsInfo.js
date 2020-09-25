// pages/goodsInfo/goodsInfo.js
import http from '../../utils/api';
let wxparse = require("../../wxParse/wxParse.js");
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    buyInfo: {
      goods_id: '',
      goods_num: 1,
      goods_sku_id: '',
      handle: 'buy',
      goods_stock: 0,
      goods_price: 0,
      line_price: 0
    },
    goodsInfo: {},
    goods_id: '',
    current: 0,
    user_level: 0,
    user_level_next: 0,
    user_level_last: 0,
    buyType: '',
    showDialog: false,
    showModel: false,
    poster: "",
    userInfo: {},
    isSelect: ["standardNormal", "standardSelected", "standardDisable"],
    goods: {
      goods_name: "男鞋",
      stock_num: 158,
      goods_price: "10.00",
      original_img: "/images/commodity.jpg",
    },
    selectedId: [],
    selectedStandard: [],
    standardObject: {},
    commodityNum: 1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    if (options.scene) {
      let getQueryString = {}
      let strs = decodeURIComponent(options.scene).split('&')
      for (var i = 0; i < strs.length; i++) {
        getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
      that.setData({
        goods_id: getQueryString['goodsId']
      })
      wx.setStorage({
        key: 'pid',
        data: getQueryString['pid']
      })
    } else {
      that.setData({
        goods_id: options.goodsId
      })
      wx.setStorage({
        key: 'pid',
        data: options.pid || ''
      })
    }
    that.mallGoodsInfo()
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
    let goods = that.data.goods;
    let standardObject = that.data.standardObject;
    standardObject.goods_price = goods.goods_price;
    standardObject.stock_num = goods.stock_num;
    let store_count = goods.stock_num;
    that.setData({
      standardObject,
      store_count
    })
  },
  onShareAppMessage: function () {
    console.log(this.data.userInfo.id)
    return {
      title: this.data.goodsInfo.detail.goods_name, //转发页面的标题
      path: '/pages/goodsInfo/goodsInfo?goodsId=' + this.data.goods_id + '&pid=' + this.data.userInfo.id,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  shareFriend: function () {
    let that = this
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      that.setData({
        showModel: true
      })
      that.getMallShare()
      wx.showLoading({								//显示 loading 提示框
        title: "正在生成海报···",
      })
    }
  },
  getMallShare: function () {
    let that = this
    http.goodsShare({
      data: {
        goods_id: that.data.goods_id,
        product_id: '',
        pid: that.data.userInfo.id,
        type: 1
      },
      success: res => {
        wx.hideLoading()
        that.setData({
          poster: res.data.url
        })
        console.log(that.data.poster)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goMallPage: function () {
    wx.switchTab({
      url: '/pages/mall/mall',
    })
  },
  attrS: function (e) {
    let that = this
    let standardIndex = e.currentTarget.dataset.standardIndex;
    let id = e.currentTarget.dataset.itemid;
    let index = e.currentTarget.dataset.index;
    let commodityStandard = that.data.goodsInfo.specData.spec_attr;
    let standardLength = commodityStandard[standardIndex].spec_items.length;
    let selectedId = that.data.selectedId;
    selectedId[standardIndex] = id;
    let selectedStandard = that.data.selectedStandard;
    for (let i = 0; i < standardLength; i++) {
      // 找到对应的单个规格索引，并设置isClick及单个规格名称
      if (index == i) {
        commodityStandard[standardIndex].spec_items[index].isClick = 1;
        var isClick = "goodsInfo.specData.spec_attr[" + standardIndex + "].spec_items[" + index + "].isClick"
        that.setData({
          [isClick]: 1
        })
        selectedStandard[standardIndex] = commodityStandard[standardIndex].spec_items[index].spec_value;
      } else {
        commodityStandard[standardIndex].spec_items[i].isClick = 0;
        var isClick = "goodsInfo.specData.spec_attr[" + standardIndex + "].spec_items[" + i + "].isClick"
        that.setData({
          [isClick]: 0
        })
      }
    }
    // 将id用_连接起来
    let mergeId = selectedId.join('_');
    let mergeStandard = selectedStandard.join('  ');
    let standardInfo = that.data.goodsInfo.specData.spec_list;
    let standardInfoLength = standardInfo.length;
    // 用于存储选中的规格
    let standardObject = {};
    for (let i = 0; i < standardInfoLength; i++) {
      if (standardInfo[i].spec_sku_id == mergeId) {
        standardObject = standardInfo[i];
        break;
      } else {
        standardObject = that.data.standardObject;
      }
    }
    standardInfo.forEach(function (ele, i) {
      if (ele.spec_sku_id == mergeId) {
        that.setData({
          "buyInfo.goods_stock": ele.form.stock_num,
          "buyInfo.goods_price": ele.form.goods_price,
          "buyInfo.goods_sku_id": ele.spec_sku_id
        })
      }
    })
    that.setData({
      currentId: id,
      commodityStandard,
      selectedId,
      standardObject,
      mergeStandard,
      selectedStandard,
    })
  },
  preventTouchMove: function () {
    this.setData({
      showModel: false
    })
  },
  share: function () {
    wx.showLoading({
      title: "正在下载···",
    })
    this.wxToPromise('downloadFile', {
      url: this.data.poster
    })
      .then(res => this.wxToPromise('saveImageToPhotosAlbum', {
        filePath: res.tempFilePath
      }))
      .then(res => {
        console.log(res);
        wx.hideLoading()
        wx.showToast({
          title: '保存成功~',
          icon: 'success',
        });
      })
      .catch(({ errMsg }) => {
        console.log(errMsg)
        wx.hideLoading()
        // if (~errMsg.indexOf('cancel')) return;
        if (!~errMsg.indexOf('auth')) {
          wx.showToast({ title: '图片保存失败，稍后再试', icon: 'none' });
        } else {
          // 调用授权提示弹框
          this.setData({
            showDialog: true
          })
        };
      })
  },
  wxToPromise(method, opt) {
    return new Promise((resolve, reject) => {
      wx[method]({
        ...opt,
        success(res) {
          opt.success && opt.success();
          resolve(res)
        },
        fail(err) {
          opt.fail && opt.fail();
          reject(err)
        }
      })
    });
  },
  confirm() {
    this.setData({
      showDialog: false
    })
  },
  cancel() {
    this.setData({
      showDialog: false
    })
  },
  getUserInfo: function (options) {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        that.setData({
          userInfo: res.data,
          user_level: res.data.level.level
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  swiperChange: function (e) {
    var that = this;
    that.setData({
      current: e.detail.current
    })
  },
  previewImg: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index;
    let listarray = that.data.goodsInfo.detail.imgs_url;
    wx.previewImage({
      current: listarray[index],
      urls: listarray,
    })
  },
  mallGoodsInfo: function () {
    let that = this
    http.mallGoodsInfo({ // 调用接口，传入参数
      data: {
        goods_id: that.data.goods_id
        // goods_id: 185
      },
      success: res => {
        console.log('接口请求成功', res)
        wx.hideToast()
        that.setData({
          goodsInfo: res.data,
          "buyInfo.goods_id": res.data.detail.goods_id,
          "buyInfo.goods_stock": res.data.detail.spec[0].stock_num,
          "buyInfo.goods_price": res.data.detail.spec[0].goods_price,
          "buyInfo.line_price": res.data.detail.spec[0].line_price,
          user_level_last: res.data.detail.reward_data.length - 1
        })
        wxparse.wxParse('dkcontent', 'html', res.data.detail.content, this, 0);
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  updateValue: function (e) {
    let that = this;
    let goods_num = e.detail.value;
    that.setData({
      "buyInfo.goods_num": goods_num
    })
  },
  changeNum: function (e) {
    let that = this
    let type = e.target.dataset.type
    if (type == 'minus') {
      if (that.data.buyInfo.goods_num == 1) {
        console.log('不能再少啦')
        return false;
      } else {
        let goods_num = that.data.buyInfo.goods_num
        goods_num--
        that.setData({
          "buyInfo.goods_num": goods_num
        })
      }
    } else {
      if (that.data.buyInfo.goods_num > that.data.buyInfo.goods_stock) {
        console.log('只能买这么多了')
        return false;
      } else {
        let goods_num = that.data.buyInfo.goods_num
        goods_num++
        that.setData({
          "buyInfo.goods_num": goods_num
        })
        console.log(that.data.buyInfo.goods_num)
      }
    }
  },
  // 显示遮罩层
  cartPanelS: function (e) {
    var that = this;
    if (!loginCheck.toLoginCheck()) {
      return false
    }
    let type = e.target.dataset.type
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 400)
    that.setData({
      "buyInfo.handle": type,
      buyType: type
    })
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 400)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  attrComputed: function (e) {
    let that = this
    let type = e.target.dataset.type
    let buyInfo = JSON.stringify(that.data.buyInfo)
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    that.fadeDown();
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 400)
    if (that.data.goodsInfo.specData && that.data.goodsInfo.specData.spec_attr) {
      if (!that.data.buyInfo.goods_sku_id && that.data.goodsInfo.specData.spec_attr.length != 0) {
        toast: {
          //调用
          app.wxToast({
            title: "请选择属性"
          })
        };
        return false
      }
    }
    if (type == 'cart') {
      console.log('加入购物车')
      http.mallAddCart({
        data: that.data.buyInfo,
        success: res => {
          console.log('接口请求成功', res)
          toast: {
            //调用
            app.wxToast({
              title: res.msg
            })
          };
        },
        fail: err => {
          console.log(err)
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/orderConfirm/orderConfirm?buyInfo=' + buyInfo + '&is_virtual=' + that.data.goodsInfo.detail.is_virtual,
      })
    }
  }
})