// 登录页面逻辑
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading: false,
    userInfo: null
  },

  onLoad: function() {
    console.log('登录页面加载')
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp()
    if (app.globalData.userInfo) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  // 微信登录
  onWechatLogin: function() {
    this.setData({ loading: true })
    
    wx.login({
      success: (res) => {
        if (res.code) {
          this.getUserProfile(res.code)
        } else {
          console.error('登录失败！' + res.errMsg)
          this.setData({ loading: false })
        }
      }
    })
  },

  // 获取用户信息
  getUserProfile: function(code) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log('获取用户信息成功', res)
        this.loginToServer(code, res.userInfo)
      },
      fail: (err) => {
        console.error('获取用户信息失败', err)
        this.setData({ loading: false })
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none'
        })
      }
    })
  },

  // 向服务器发送登录请求
  loginToServer: function(code, userInfo) {
    const app = getApp()
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/auth/login`,
      method: 'POST',
      data: {
        code: code,
        userInfo: userInfo
      },
      success: (res) => {
        console.log('服务器登录响应', res)
        
        if (res.statusCode === 200 && res.data.success) {
          // 保存token和用户信息
          wx.setStorageSync('token', res.data.token)
          app.globalData.userInfo = res.data.user
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          // 跳转到首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('登录请求失败', err)
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  // 游客模式
  onGuestMode: function() {
    wx.showModal({
      title: '游客模式',
      content: '游客模式下部分功能受限，建议登录获得完整体验',
      confirmText: '继续',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  }
}) 