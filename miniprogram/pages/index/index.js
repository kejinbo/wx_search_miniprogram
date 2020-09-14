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
    list: [],
    pageNumber: 1, //当前页数
    pageSize: 10, //页大小
    totalPage: 0, //总页数
    isMore: false
  },
  onLoad: function () {},
  onShow() {
    this.showAnimationFn('formAnimation')
  },
  onChange(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  searchClick(e) {
    let immediate = e.target.dataset.immediate
    let self = this;
    if (!this.data.searchValue) {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return;
    }
    self.setData({
      list: [],
      pageNumber: 1, //当前页数
      pageSize: 10, //页大小
      totalPage: 0, //总页数
      isMore: false
    })
    if (self.data.timeout) {
      clearTimeout(self.data.timeout)
    }
    if (immediate == 'true') {
      let callNow = !self.data.timeout
      self.data.timeout = setTimeout(function () {
        self.setData({
          timeout: null
        })
      }, 1000)
      if (callNow) {
        self.getInfo()
      }
    } else {
      self.getInfo()
    }
  },
  getInfo() {
    let self = this;
    self.searchBtnUseStatus(true)
    wx.request({
      url: 'https://pi.roothk.top/health/api/food/search',
      method: 'GET',
      data: {
        pageNumber: self.data.pageNumber,
        pageSize: self.data.pageSize,
        search: self.data.searchValue
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.content.length > 0) {
            self.hideAnimationFn('formAnimation')
            self.showAnimationFn('listViewAnimation')
            self.setData({
              list: self.data.list.concat(res.data.content || []),
              totalPage: res.data.totalPages
            })
          } else {
            wx.showToast({
              title: '暂无数据~',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: res.data.message || '服务器错误',
            icon: 'none'
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: err.message || '服务器错误',
          icon: 'none'
        })
      },
      complete(err) {
        self.searchBtnUseStatus(false)
      }
    })
  },
  searchBtnUseStatus(bool = true) {
    this.setData({
      searchLoading: bool
    });
  },
  loadMore(e) {
    if (this.data.searchLoading) {
      return
    }
    let pageNum = ++this.data.pageNumber
    let totalPage = this.data.totalPage
    if (pageNum < totalPage) {
      this.setData({
        pageNumber: pageNum,
        isMore: true
      })
      this.getInfo()
    } else {
      this.setData({
        pageNumber: totalPage,
        isMore: false
      })
    }
  },
  closeView() {
    this.hideAnimationFn('listViewAnimation')
    setTimeout(() => {
      wx.nextTick(() => {
        this.showAnimationFn('formAnimation')
      })
    }, 200)
  },
  showAnimationFn(target) {
    if (!this.showAnimation) {
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
  hideAnimationFn(target) {
    if (!this.hideAnimation) {
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
    setTimeout(() => {
      this.setData({
        showList: target === 'formAnimation'
      })
    }, 200)
  }
})