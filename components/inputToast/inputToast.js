// components/inputToast/inputToast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputToast:{
      type: Object,
      value: {
        isShowConfirm: true,
        title: '确认支付',
        value: '输入支付密码',
        text: Number
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setValue(e){
      let that = this
      that.setData({
        "inputToast.text": e.detail.value
      })
    },
    cancel () {
      var that = this
      that.setData({
        "inputToast.isShowConfirm": false
      })
    },
  },
  created: function() {
    var that = this;
    
  }
})
