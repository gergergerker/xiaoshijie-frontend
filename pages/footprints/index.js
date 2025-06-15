// 足迹列表页面
Page({
  /**
   * 页面的初始数据
   */
  data: {
    footprints: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadFootprints();
  },

  /**
   * 加载足迹数据
   */
  loadFootprints: function () {
    try {
      // 从本地存储获取足迹数据
      const footprints = wx.getStorageSync('city_footprints') || [];
      
      // 对足迹按时间排序，最新的排在前面
      footprints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      this.setData({
        footprints: footprints
      });
    } catch (error) {
      console.error('加载足迹失败', error);
      wx.showToast({
        title: '加载足迹失败',
        icon: 'none'
      });
    }
  },

  /**
   * 查看某个城市详情
   */
  viewCity: function (e) {
    const city = e.currentTarget.dataset.city;
    // 跳转到时城漫游页面并传入城市ID
    wx.navigateTo({
      url: `/pages/timeSequence/index?cityId=${city.cityId}`
    });
  },

  /**
   * 返回上一页
   */
  goBack: function () {
    wx.navigateBack();
  },

  /**
   * 跳转到时城漫游页面
   */
  goToTimeSequence: function () {
    wx.navigateTo({
      url: '/pages/timeSequence/index'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 每次显示页面时刷新足迹数据
    this.loadFootprints();
  },

  /**
   * 清除所有足迹（可选功能）
   */
  clearAllFootprints: function () {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有足迹记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('city_footprints');
          this.setData({
            footprints: []
          });
          wx.showToast({
            title: '足迹已清除',
            icon: 'success'
          });
        }
      }
    });
  }
}) 