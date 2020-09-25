// components/marquee/marquee.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '热烈祝贺丰德百旺义乌展馆中心启动！全国一乡一品秋冬销售季圆满成功！预祝丰德百旺直供基地、一乡一品产业基地签约会在中国义乌丰德百旺农业园顺利举行！热烈欢迎各界领导，为支持和参与中国农业发展的各位同仁以及社会各界人士莅临丰德百旺指导工作，共谋发展！'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    marqueePace: 1,
    marqueeDistance: 0,
    size: 14,
    orientation: 'left',
    interval: 60
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _scrolling: function() {
      var _this = this;
      var timer = setInterval(()=> {
        if(-_this.data.marqueeDistance < _this.data.length) {
          _this.setData({
            marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace
          })
        } else {
          clearInterval(timer);
          _this.setData({
            marqueeDistance: _this.data.windowWidth
          });
          _this._scrolling();
        }
      },_this.data.interval);
    }
  },

  created: function() {
    var _this = this;
    var length = _this.data.text.length * _this.data.size;
    var windowWidth = wx.getSystemInfoSync().windowWidth
    _this.setData({
      length: length,
      windowWidth: windowWidth - 24
    });
    _this._scrolling();
  }
})
