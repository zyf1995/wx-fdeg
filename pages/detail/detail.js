// pages/detail/detail.js
var util = require('../../utils/util.js');
Page({
  data: {
    list: [],
    haslist: false,
    errmsg: ''
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var logistics = [options.type, options.postid]
    //数据内容
    var RequestData = "{'OrderCode':'','ShipperCode':'" + logistics[0] + "','LogisticCode':'" + logistics[1] + "'}"
    //utf-8编码的数据内容
    console.log(RequestData)
    var RequestDatautf = encodeURI(RequestData)
    console.log("RequestDatautf:" + RequestDatautf)
    //签名
    console.log(RequestData + '08b8585e-ff8d-4bd2-88ed-470c178960a1')
    var DataSign = encodeURI(util.Base64((util.md5(RequestData + '08b8585e-ff8d-4bd2-88ed-470c178960a1'))))
    console.log("DataSign:" + DataSign)
    if (logistics != null) {
      wx.request({
        url: 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
        data: {
          //数据内容(进行过url编码)
          'RequestData': RequestDatautf,
          //电商ID
          'EBusinessID': '1577735',
          //请求指令类型：1002
          'RequestType': '1002',
          //数据内容签名把（请求内容（未编码）+ApiKey）进行MD5加密，然后Base64编码，最后进行URL（utf-8）编码
          'DataSign': DataSign,
          //请求、返回数据类型： 2-json；
          'DataType': '2',
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.State == 0) {
            that.setData({
              errmsg: res.data.Reason,
              haslist: false
            })
          } else {
            that.setData({
              list: res.data.Traces,
              haslist: true
            })
          }
        },
        fail: function (err) {
          that.setData({
            errmsg: res.data.Reason,
            haslist: false
          })
        }
      })
    }
  },

})