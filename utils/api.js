// API工具类 - 统一管理网络请求
const app = getApp()

class ApiService {
  constructor() {
    this.baseUrl = 'https://api.xiaoshijie.com'
    this.timeout = 10000
  }

  // 通用请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token')
      
      wx.request({
        url: `${this.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.header
        },
        timeout: this.timeout,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else if (res.statusCode === 401) {
            // token过期，清除本地存储
            wx.removeStorageSync('token')
            app.globalData.userInfo = null
            wx.showToast({
              title: '登录已过期',
              icon: 'none'
            })
            // 跳转到登录页
            wx.navigateTo({
              url: '/pages/login/login'
            })
            reject(new Error('登录已过期'))
          } else {
            reject(new Error(res.data.message || '请求失败'))
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err)
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
          reject(err)
        }
      })
    })
  }

  // GET请求
  get(url, data = {}) {
    return this.request({
      url,
      method: 'GET',
      data
    })
  }

  // POST请求
  post(url, data = {}) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }

  // PUT请求
  put(url, data = {}) {
    return this.request({
      url,
      method: 'PUT',
      data
    })
  }

  // DELETE请求
  delete(url, data = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data
    })
  }

  // 用户相关API
  user = {
    // 登录
    login: (code, userInfo) => {
      return this.post('/auth/login', { code, userInfo })
    },

    // 获取用户信息
    getProfile: () => {
      return this.get('/user/profile')
    },

    // 更新用户信息
    updateProfile: (data) => {
      return this.put('/user/profile', data)
    },

    // 获取用户小树数量
    getTreeCount: () => {
      return this.get('/user/trees')
    }
  }

  // 内容相关API
  content = {
    // 获取首页内容
    getHomeContent: () => {
      return this.get('/content/home')
    },

    // 获取兰亭内容
    getLantingContent: () => {
      return this.get('/content/lanting')
    },

    // 获取时序漫游内容
    getTimeSequenceContent: () => {
      return this.get('/content/timesequence')
    },

    // 提交阅读记录
    submitReadingRecord: (data) => {
      return this.post('/content/reading', data)
    }
  }

  // 小树相关API
  tree = {
    // 获取小树
    earnTree: (source, amount = 1) => {
      return this.post('/tree/earn', { source, amount })
    },

    // 消费小树
    consumeTree: (purpose, amount) => {
      return this.post('/tree/consume', { purpose, amount })
    },

    // 获取小树历史
    getHistory: () => {
      return this.get('/tree/history')
    }
  }
}

// 创建单例
const apiService = new ApiService()

module.exports = apiService 