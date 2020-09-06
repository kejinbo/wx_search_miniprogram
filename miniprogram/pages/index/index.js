//index.js
const app = getApp()

Page({
  data: {
    searchValue: '',
    timeout: null,
    searchLoading: false
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
    let self = this;
    self.searchBtnUseStatus(true)
    wx.request({
      url: 'https://pi.roothk.top/health/api/food/search',
      method: 'GET',
      data:{
        pageNumber: 0,
        pageSize: 20,
        search: self.data.searchValue
      },
      success(res){
        if(res.statusCode == 200){

        } else {
          wx.showToast({
            title: res.data.message || '服务器错误',
            icon: 'none'
          })
        }
      },
      fail(err){
        wx.showToast({
          title: err.message || '服务器错误',
          icon: 'none'
        })
      },
      complete(err){
        self.searchBtnUseStatus(false)
      }
    })
  },
  searchBtnUseStatus(bool = true){
    if(!bool){
      this.setData({
        searchLoading: false
      });
    } else {
      this.setData({
        searchLoading: true
      });
    }
  },
  loadMore(e){
    console.log(e)
  }
})
