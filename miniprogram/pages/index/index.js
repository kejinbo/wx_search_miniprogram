//index.js
const app = getApp()

Page({
  data: {
    searchValue: '',
    timeout: null
  },
  onLoad: function() {
  },
  onChange(e){
    this.data.searchValue = e.detail.value
  },
  searchClick(e){
    let immediate = e.target.dataset.immediate
    let self = this;
    if(!this.data.searchValue){
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return;
    }
    if(self.data.timeout){
      clearTimeout(self.data.timeout)
    }
    if(immediate == 'true'){
      let callNow = !self.data.timeout
      self.data.timeout = setTimeout(function(){
        self.setData({
          timeout: null
        })
      }, 1000)
      if(callNow) {
        self.getInfo()
      }
    } else {
      self.getInfo()
    }
  },
  getInfo(){
    wx.request({
      url: 'https://pi.roothk.top/health/product/search',
      method: 'GET',
      data:{
        page: 0,
        size: 20,
        search: this.data.searchValue
      },
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err);
      }
    })
  }
})
