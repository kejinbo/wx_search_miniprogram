//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true,
      env: "health-zj"
    });
    this.globalData = {}
  },
  
})
