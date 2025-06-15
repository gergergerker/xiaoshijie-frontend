// 晓时节微信小程序 - 主应用入口
App({
  // 应用生命周期
  onLaunch: function (options) {
    console.log('晓时节小程序启动', options)
    
    // 检查登录状态
    this.checkLoginStatus()
    
    // 获取系统信息
    this.getSystemInfo()
    
    // 初始化小树数量
    // 从本地存储获取树的数量
    const lantingTrees = wx.getStorageSync('lantingTrees') || 0;
    const timeSequenceTrees = wx.getStorageSync('timeSequenceTrees') || 0;
    const totalTrees = lantingTrees + timeSequenceTrees;
    const consumedTrees = wx.getStorageSync('consumedTrees') || 0;
    
    // 设置全局数据
    this.globalData.lantingTrees = lantingTrees;
    this.globalData.timeSequenceTrees = timeSequenceTrees;
    this.globalData.treeCount = totalTrees - consumedTrees; // 总树木数减去已消费树木数
    this.globalData.consumedTrees = consumedTrees;
  },

  onShow: function (options) {
    console.log('晓时节小程序显示', options)
  },

  onHide: function () {
    console.log('晓时节小程序隐藏')
  },

  onError: function (msg) {
    console.error('晓时节小程序错误:', msg)
  },

  // 全局数据
  globalData: {
    userInfo: null,
    systemInfo: null,
    apiBaseUrl: 'https://api.xiaoshijie.com',
    version: '1.0.0',
    themeColor: '#e8f5e9',
    lantingTrees: 0,  // LanTing页面获得的小树
    timeSequenceTrees: 0, // 时序漫游获得的小树
    treeCount: 0,  // 总的小树数量（LanTing + TimeSequence - 已消费）
    consumedTrees: 0  // 已消费的小树数量
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 验证token有效性
      this.validateToken(token)
    }
  },

  // 验证token
  validateToken: function(token) {
    wx.request({
      url: `${this.globalData.apiBaseUrl}/auth/validate`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.userInfo = res.data.user
        } else {
          wx.removeStorageSync('token')
        }
      }
    })
  },

  // 获取系统信息
  getSystemInfo: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        console.log('系统信息:', res)
      }
    })
  }
}) 