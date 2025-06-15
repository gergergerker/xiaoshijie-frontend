Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    imageUrl: '',   // 会员宣传图片URL
    membershipInfo: {
      prices: []    // 价格方案
    },
    selectedPlan: 0  // 默认选中的会员方案
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载会员信息
    this.fetchMembershipInfo();
  },

  /**
   * 从API获取会员信息
   */
  fetchMembershipInfo() {
    this.setData({ loading: true });
    
    wx.request({
      url: 'https://api.xiaoshijie.com/v1/membership/info',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          this.setData({
            imageUrl: res.data.bannerImage,
            membershipInfo: {
              prices: res.data.prices || []
            },
            loading: false
          });
          
          // 缓存会员信息
          wx.setStorageSync('membership_info', {
            data: res.data,
            timestamp: Date.now()
          });
        } else {
          console.error('获取会员信息失败', res);
          this.loadFallbackData();
        }
      },
      fail: (err) => {
        console.error('请求会员API失败', err);
        // 如果API请求失败，使用本地缓存
        const cachedData = wx.getStorageSync('membership_info');
        if (cachedData && (Date.now() - cachedData.timestamp < 86400000)) { // 24小时有效期
          this.setData({
            imageUrl: cachedData.data.bannerImage,
            membershipInfo: {
              prices: cachedData.data.prices || []
            },
            loading: false
          });
        } else {
          this.loadFallbackData();
        }
      }
    });
  },
  
  /**
   * 加载备用数据（当API不可用时）
   */
  loadFallbackData() {
    // 提供默认会员信息作为备用
    this.setData({
      imageUrl: '../../images/membership-banner.png', // 本地备用图片
      membershipInfo: {
        prices: [
          { id: 1, name: '月卡', price: 15, original: 30, unit: '元/月' },
          { id: 2, name: '季卡', price: 39, original: 78, unit: '元/季', recommend: true },
          { id: 3, name: '年卡', price: 128, original: 288, unit: '元/年' }
        ]
      },
      loading: false
    });
  },
  
  /**
   * 选择会员方案
   */
  selectPlan(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedPlan: index
    });
  },
  
  /**
   * 购买会员
   */
  purchaseMembership() {
    const selectedPlan = this.data.membershipInfo.prices[this.data.selectedPlan];
    
    wx.showLoading({
      title: '处理中',
      mask: true
    });
    
    // 实际项目中，这里应该调用支付API
    wx.request({
      url: 'https://api.xiaoshijie.com/v1/membership/purchase',
      method: 'POST',
      data: {
        planId: selectedPlan.id
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.paymentParams) {
          // 发起微信支付
          wx.requestPayment({
            ...res.data.paymentParams,
            success: () => {
              wx.showToast({
                title: '购买成功',
                icon: 'success'
              });
              
              // 更新全局会员状态
              getApp().globalData.isMember = true;
              getApp().globalData.membershipExpireDate = res.data.expireDate;
              
              // 延迟返回，给用户查看成功提示的时间
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            },
            fail: (err) => {
              console.error('支付失败', err);
              wx.showToast({
                title: '支付取消',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '处理失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '晓时节会员 - 探索更多节气文化',
      path: '/pages/cloudDwelling/index'
    };
  }
}) 