//index.js
const app = getApp()

Page({
  data: {
    list: [],
    pageNumber: 1, //当前页数
    pageSize: 10, //页大小
    totalPage: 0, //总页数
  },
  onLoad: function () { },
  onShow() {
    this.getInfo();
  },
  getInfo() {
    const self = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getFoodCollect',
      data: {
        pageIndex: 1,
        pageSize: 1000
      }
    }).then(res => {
      console.log(res);
      if (res.result.returnCode === 0) {
        self.setData({
          list: res.result.returnData
        })
      } else {
        wx.showToast({
          title: res.result.returnMsg || "查询失败",
          icon: 'none'
        })
      }
      wx.hideLoading();
    })
  },
})