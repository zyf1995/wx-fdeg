Component({
  properties: {
    header: {
      type: Object,
      value: {
        homeCapsule: false,
        headerbg: "#fff",
        title: "",
        fontColor: "#000",
        fontSize: '16',
        hiddenBlock: false,
        capsulebg: 'rgba(0,0,0,0.2)',
        capsuleborder: '1px solid rgba(0, 0, 0, 0.1)',
        capsulesep: '1px solid rgba(255,255,255,0.2)',
        slot: false
      }
    },
    /**
     * 自定义返回事件处理
     * customBackReturn="{{true}}" bind:customBackReturn="customBackReturn"
     */
    customBackReturn: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    backClick() {
      if (this.data.customBackReturn) {
        this.triggerEvent("customBackReturn")
      } else {
        if (getCurrentPages().length == 1) {
          wx.switchTab({
            url: '/pages/doorShop/doorShop',
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    },
    homeClick() {
      wx.switchTab({
        url: '/pages/doorShop/doorShop',
      })
    }
  },
  attached() {
    var self = this;
    wx.getSystemInfo({
      success(res) {
        var isIos = res.system.indexOf('iOS') > -1;
        self.setData({
          statusHeight: res.statusBarHeight,
          navHeight: isIos ? 44 : 48
        })
      }
    })
  }
})
