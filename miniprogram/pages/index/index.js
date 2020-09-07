//index.js
const app = getApp()

Page({
  data: {
    searchValue: '',
    timeout: null,
    searchLoading: false,
    formAnimation: {}, // 表单动画
    listViewAnimation: {}, // 查询动画
    showList: false,
    list: [1,2,3,4,5,6,7,8,9,10]
  },
  onLoad: function() {
  },
  onShow(){
    this.showAnimationFn('formAnimation')
  },
  onChange(e){
    this.setData({
      searchValue: e.detail.value
    })
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
    // self.searchBtnUseStatus(true)
    self.hideAnimationFn('formAnimation')
    self.showAnimationFn('listViewAnimation')
    return;
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
    this.setData({
      searchLoading: bool
    });
  },
  loadMore(e){
    console.log(e)
  },
  closeView(){
    this.hideAnimationFn('listViewAnimation')
   setTimeout(()=>{
    wx.nextTick(()=>{
      this.showAnimationFn('formAnimation')
    })
   },200)
  },
  showAnimationFn(target){
    if(!this.showAnimation){
      let showAnimation = wx.createAnimation({
        timingFunction: 'ease-in-out',
        duration: 300
      })
      this.showAnimation = showAnimation
    }
    this.showAnimation.top(0).opacity(1).step()
    this.setData({
      [target]: this.showAnimation.export()
    })
  },
  hideAnimationFn(target){
    if(!this.hideAnimation){
      let hideAnimation = wx.createAnimation({
        timingFunction: 'ease-out',
        duration: 200
      })
      this.hideAnimation = hideAnimation
    }
    this.hideAnimation.top(-50).opacity(0).step()
    this.setData({
      [target]: this.hideAnimation.export()
    })
    setTimeout(()=>{
      this.setData({
        showList: target === 'formAnimation'
      })
    },200)
  }
})
