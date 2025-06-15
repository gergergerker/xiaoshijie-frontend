Page({
  /**
   * 页面的初始数据
   */
  data: {
    treeCount: 0,
    lantingTrees: 0,
    timeSequenceTrees: 0,
    consumedTrees: 0,
    isVIP: false,
    isLoggedIn: false, // 登录状态标志
    username: '未登录',
    avatarUrl: '',
    currentSeason: {
      name: '小雪',
      date: '2023年11月22日',
      description: '小雪节气，天气渐冷，偶有小雪。时值深秋将尽、冬季将临之际，大地即将进入一段相对"休眠"的时期。',
      quote: '草枯鹰眼疾，雪尽马蹄轻。'
    },
    footprints: [], // 用户足迹数据
    activities: [
      {
        id: 1,
        time: '今天 14:30',
        text: '完成"楼台烟雨中"队伍的知识竞答',
        reward: 5
      },
      {
        id: 2,
        time: '昨天 09:15',
        text: '阅读了《城市概念篇》'
      },
      {
        id: 3,
        time: '3天前',
        text: '参与互动获得小树奖励',
        reward: 2
      },
      {
        id: 4,
        time: '上周',
        text: '加入晓时节社区'
      }
    ],
    // 关于我们弹窗
    showAboutDialog: false,
    aboutInfo: {
      name: '晓时节',
      version: 'v1.0.0',
      description: '晓时节是一款基于二十四节气的地理时节探索小程序，致力于在传承和推广中国传统节气文化的同时，带领大家足不出户"看"世界！',
      copyright: '© 2025 晓学习团队',
      email: 'xiao_shi_jie@126.com'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取各种树的数量
    const app = getApp();
    if (app.globalData) {
      const lantingTrees = app.globalData.lantingTrees || 0;
      const timeSequenceTrees = app.globalData.timeSequenceTrees || 0;
      const consumedTrees = app.globalData.consumedTrees || 0;
      const treeCount = app.globalData.treeCount || 0;
      
      this.setData({
        lantingTrees: lantingTrees,
        timeSequenceTrees: timeSequenceTrees,
        consumedTrees: consumedTrees,
        treeCount: treeCount
      });
    } else {
      // 如果全局数据不存在，尝试从本地存储获取
      const lantingTrees = wx.getStorageSync('lantingTrees') || 0;
      const timeSequenceTrees = wx.getStorageSync('timeSequenceTrees') || 0;
      const consumedTrees = wx.getStorageSync('consumedTrees') || 0;
      const treeCount = wx.getStorageSync('treeCount') || 0;
      
      this.setData({
        lantingTrees: lantingTrees,
        timeSequenceTrees: timeSequenceTrees,
        consumedTrees: consumedTrees,
        treeCount: treeCount
      });
    }
    
    // 加载用户信息
    this.loadUserInfo();
    
    // 更新当前时节信息
    this.updateCurrentSeason();

    // 加载用户足迹
    this.loadUserFootprints();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    
    if (userInfo && userInfo.phoneNumber) {
      // 用户已登录
      this.setData({
        isLoggedIn: true,
        username: userInfo.username || '晓时用户',
        avatarUrl: userInfo.avatarUrl || ''
      });
    } else {
      // 用户未登录
      this.setData({
        isLoggedIn: false,
        username: '未登录',
        avatarUrl: ''
      });
    }
  },

  /**
   * 更新当前时节信息
   */
  updateCurrentSeason() {
    // 从API获取节气信息
    this.fetchSeasonData();
  },

  /**
   * 从API获取节气信息
   */
  fetchSeasonData() {
    // 显示加载中
    wx.showLoading({
      title: '加载节气信息',
      mask: true
    });
    
    // 调用真实API获取节气信息
    wx.request({
      url: 'https://api.xiaoshijie.com/v1/seasons/current',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          // 更新UI展示
          this.setData({
            currentSeason: res.data.currentSeason,
            nextSeasonName: res.data.nextSeason.name,
            daysToNextSeason: res.data.daysToNextSeason,
            isExactlyOnSolarTerm: res.data.isExactlyOnSolarTerm
          });
          
          // 缓存数据以便离线使用
          wx.setStorageSync('season_data', {
            data: res.data,
            timestamp: Date.now()
          });
        } else {
          console.error('获取节气数据失败', res);
          this.calculateLocalSeasonInfo();
        }
      },
      fail: (err) => {
        console.error('请求节气API失败', err);
        // 如果API请求失败，使用本地缓存或计算
        const cachedData = wx.getStorageSync('season_data');
        if (cachedData && (Date.now() - cachedData.timestamp < 86400000)) { // 24小时有效期
          this.setData({
            currentSeason: cachedData.data.currentSeason,
            nextSeasonName: cachedData.data.nextSeason.name,
            daysToNextSeason: cachedData.data.daysToNextSeason,
            isExactlyOnSolarTerm: cachedData.data.isExactlyOnSolarTerm
          });
        } else {
          this.calculateLocalSeasonInfo();
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  /**
   * 本地计算节气信息（API不可用时的备选方案）
   */
  calculateLocalSeasonInfo() {
    // 这里可以根据当前日期判断实际的节气
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 简化的节气日期映射（实际项目应使用更准确的计算或从服务器获取）
    const solarTerms = [
      { name: '立春', month: 2, day: 4 },
      { name: '雨水', month: 2, day: 19 },
      { name: '惊蛰', month: 3, day: 5 },
      { name: '春分', month: 3, day: 20 },
      { name: '清明', month: 4, day: 5 },
      { name: '谷雨', month: 4, day: 20 },
      { name: '立夏', month: 5, day: 5 },
      { name: '小满', month: 5, day: 21 },
      { name: '芒种', month: 6, day: 6 },
      { name: '夏至', month: 6, day: 21 },
      { name: '小暑', month: 7, day: 7 },
      { name: '大暑', month: 7, day: 22 },
      { name: '立秋', month: 8, day: 7 },
      { name: '处暑', month: 8, day: 23 },
      { name: '白露', month: 9, day: 8 },
      { name: '秋分', month: 9, day: 23 },
      { name: '寒露', month: 10, day: 8 },
      { name: '霜降', month: 10, day: 23 },
      { name: '立冬', month: 11, day: 7 },
      { name: '小雪', month: 11, day: 22 },
      { name: '大雪', month: 12, day: 7 },
      { name: '冬至', month: 12, day: 22 },
      { name: '小寒', month: 1, day: 5 },
      { name: '大寒', month: 1, day: 20 }
    ];
    
    // 计算当前属于哪个节气以及下一个节气
    let currentTermIndex = -1;
    let nextTermIndex = -1;
    let isExactlyOnSolarTerm = false; // 是否正好处于节气当天
    let daysToNextSeason = 0;
    
    // 检查是否正好是某个节气的当天
    for (let i = 0; i < solarTerms.length; i++) {
      if (month === solarTerms[i].month && day === solarTerms[i].day) {
        currentTermIndex = i;
        nextTermIndex = (i + 1) % solarTerms.length; // 下一个节气
        isExactlyOnSolarTerm = true;
        break;
      }
    }
    
    // 如果不是节气当天，确定当前所处的节气区间
    if (!isExactlyOnSolarTerm) {
      let currentDate = new Date(now.getFullYear(), month - 1, day);
      
      // 为每个节气创建日期对象
      let termDates = solarTerms.map(term => {
        // 创建节气日期，考虑年份变化
        let year = now.getFullYear();
        
        // 如果当前是12月，但节气在1月，意味着是下一年的节气
        if (month === 12 && term.month === 1) {
          year += 1;
        }
        // 如果当前是1月，但节气在12月，意味着是上一年的节气
        else if (month === 1 && term.month === 12) {
          year -= 1;
        }
        
        return {
          term: term,
          date: new Date(year, term.month - 1, term.day)
        };
      });
      
      // 按日期排序
      termDates.sort((a, b) => a.date - b.date);
      
      // 找出当前日期所处的节气区间
      for (let i = 0; i < termDates.length; i++) {
        if (currentDate < termDates[i].date) {
          // 当前日期在这个节气之前，所以上一个节气是当前节气
          nextTermIndex = i;
          currentTermIndex = (i - 1 + termDates.length) % termDates.length;
          
          // 计算到下一个节气的天数
          const diffTime = termDates[i].date.getTime() - currentDate.getTime();
          daysToNextSeason = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          break;
        }
      }
      
      // 如果没找到，说明当前日期在最后一个节气之后，下一个就是下一年的第一个节气
      if (currentTermIndex === -1) {
        // 复制第一个节气并设置为下一年
        const firstTermNextYear = {
          term: solarTerms[0],
          date: new Date(now.getFullYear() + 1, solarTerms[0].month - 1, solarTerms[0].day)
        };
        
        currentTermIndex = termDates.length - 1;
        nextTermIndex = 0;
        
        // 计算到下一个节气的天数
        const diffTime = firstTermNextYear.date.getTime() - currentDate.getTime();
        daysToNextSeason = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }
    
    // 获取当前节气和下一个节气的信息
    const currentTerm = solarTerms[currentTermIndex];
    const nextTerm = solarTerms[nextTermIndex];
    
    // 获取详细信息
    let seasonInfo = this.getSeasonInfo(currentTerm.name);
    
    // 更新数据
    this.setData({
      currentSeason: seasonInfo,
      isExactlyOnSolarTerm: isExactlyOnSolarTerm,
      nextSeasonName: nextTerm.name,
      daysToNextSeason: daysToNextSeason
    });
  },
  
  /**
   * 根据节气名称获取详细信息
   */
  getSeasonInfo(seasonName) {
    // 格式化日期函数（用于本地计算时的日期格式化）
    const formatDate = (year, month, day) => {
      return `${year}年-${month}月-${day}日`;
    };
    
    const currentYear = new Date().getFullYear();
    
    // 这些数据在实际项目中应从API获取
    const seasonMap = {
      '立春': {
        name: '立春',
        date: formatDate(currentYear, 2, 4),
        description: '立春是二十四节气的第一个节气，标志着万物闭藏的冬季已过去，开始进入风和日暖、万物生长的春季。',
        quote: '律回岁晚冰霜少，春到人间草木知。',
        imageUrl: '../../images/season-lichun.jpg'
      },
      '雨水': {
        name: '雨水',
        date: formatDate(currentYear, 2, 19),
        description: '雨水节气，意味着降雨开始增多，气温回升，冰雪融化。此时雨量较小，以小雨或毛毛雨为主。',
        quote: '好雨知时节，当春乃发生。',
        imageUrl: '../../images/season-yushui.jpg'
      },
      '清明': {
        name: '清明',
        date: formatDate(currentYear, 4, 5),
        description: '清明节气，气候清爽明朗，万物皆显生机勃勃。既是节气，也是中国重要的传统节日之一。',
        quote: '清明时节雨纷纷，路上行人欲断魂。',
        imageUrl: '../../images/season-qingming.jpg'
      },
      '小雪': {
        name: '小雪',
        date: formatDate(currentYear, 11, 22),
        description: '小雪节气，天气渐冷，偶有小雪。时值深秋将尽、冬季将临之际，大地即将进入一段相对"休眠"的时期。',
        quote: '草枯鹰眼疾，雪尽马蹄轻。',
        imageUrl: '../../images/season-current.jpg'
      },
      '大雪': {
        name: '大雪',
        date: formatDate(currentYear, 12, 7),
        description: '大雪节气，意味着降雪的可能性和雪量增大。北方地区开始出现大范围降雪，气温显著下降。',
        quote: '燕山雪花大如席，片片吹落轩辕台。',
        imageUrl: '../../images/season-daxue.jpg'
      }
      // 可以添加其他节气...
    };
    
    // 如果没有该节气的信息，返回默认信息
    return seasonMap[seasonName] || {
      name: seasonName,
      date: formatDate(currentYear, 1, 1),
      description: '暂无该节气的详细介绍。',
      quote: '静以修身，俭以养德。',
      imageUrl: '../../images/season-default.jpg'
    };
  },

  /**
   * 开通会员
   */
  upgradeMembership() {
    wx.navigateTo({
      url: '/pages/membership/index'
    });
  },

  /**
   * 导航到其他页面
   */
  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    
    // 使用switchTab而不是navigateTo，因为这些都是Tab页面
    wx.switchTab({
      url: `/pages/${page}/index`
    });
  },

  /**
   * 打开设置页面
   */
  openSettings: function() {
    // 尝试从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || {
      username: '晓时用户',
      avatarUrl: ''
    };
    
    wx.showActionSheet({
      itemList: ['设置用户名', '上传头像'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 设置用户名
          wx.showModal({
            title: '设置用户名',
            content: '请输入您的用户名',
            editable: true,
            placeholderText: userInfo.username || '晓时用户',
            success: (res) => {
              if (res.confirm && res.content) {
                // 保存新用户名
                const updatedUserInfo = {
                  username: res.content,
                  avatarUrl: userInfo.avatarUrl || ''
                };
                wx.setStorageSync('userInfo', updatedUserInfo);
                
                // 更新页面显示
                this.setData({
                  username: res.content
                });
                
                wx.showToast({
                  title: '用户名已更新',
                  icon: 'success'
                });
              }
            }
          });
        } else if (res.tapIndex === 1) {
          // 选择图片作为头像
          wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: (res) => {
              const tempFilePath = res.tempFiles[0].tempFilePath;
              
              // 更新用户信息
              const updatedUserInfo = {
                username: userInfo.username || '晓时用户',
                avatarUrl: tempFilePath
              };
              wx.setStorageSync('userInfo', updatedUserInfo);
              
              // 更新页面显示
              this.setData({
                avatarUrl: tempFilePath
              });
              
              wx.showToast({
                title: '头像已更新',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时，重新获取各种树的数量
    const app = getApp();
    if (app.globalData) {
      const lantingTrees = app.globalData.lantingTrees || 0;
      const timeSequenceTrees = app.globalData.timeSequenceTrees || 0;
      const consumedTrees = app.globalData.consumedTrees || 0;
      const treeCount = app.globalData.treeCount || 0;
      
      this.setData({
        lantingTrees: lantingTrees,
        timeSequenceTrees: timeSequenceTrees,
        consumedTrees: consumedTrees,
        treeCount: treeCount
      });
    }
    
    // 重新加载用户信息
    this.loadUserInfo();

    // 更新用户足迹数据（每次页面显示时刷新）
    this.loadUserFootprints();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
      title: '晓时节',
      path: '/pages/cloudDwelling/index'
    };
  },

  /**
   * 加载用户足迹数据
   */
  loadUserFootprints() {
    try {
      // 从本地存储获取足迹数据
      const footprints = wx.getStorageSync('city_footprints') || [];
      
      // 对足迹按时间排序，最新的排在前面
      footprints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // 只显示最新的5个足迹
      const recentFootprints = footprints.slice(0, 5);
      
      this.setData({
        footprints: recentFootprints
      });
    } catch (error) {
      console.error('加载足迹失败', error);
    }
  },

  /**
   * 查看某个足迹对应的城市详情
   */
  viewFootprintCity(e) {
    const city = e.currentTarget.dataset.city;
    // 跳转到时城漫游页面并传入城市ID
    wx.navigateTo({
      url: `/pages/timeSequence/index?cityId=${city.cityId}`
    });
  },

  /**
   * 查看全部足迹记录
   */
  viewAllFootprints() {
    // 可以跳转到一个专门的足迹列表页面
    wx.navigateTo({
      url: '/pages/footprints/index'
    });
  },

  /**
   * 导航到系统页面
   */
  navigateToSystemPage(e) {
    const page = e.currentTarget.dataset.page;
    
    if (page === 'about') {
      // 显示关于我们弹窗
      this.setData({
        showAboutDialog: true
      });
      return;
    }
    
    let url = '';
    
    // 根据不同的页面类型跳转到不同的路径
    switch(page) {
      case 'userAgreement':
        url = '/pages/agreement/index?type=user';
        break;
      case 'privacyPolicy':
        url = '/pages/agreement/index?type=privacy';
        break;
      case 'contactUs':
        url = '/pages/contact/index';
        break;
      default:
        return;
    }
    
    wx.navigateTo({
      url: url
    });
  },
  
  /**
   * 关闭关于我们弹窗
   */
  closeAboutDialog() {
    this.setData({
      showAboutDialog: false
    });
  },
  
  /**
   * 复制邮箱
   */
  copyEmail() {
    wx.setClipboardData({
      data: this.data.aboutInfo.email,
      success() {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        });
      }
    });
  },
  
  /**
   * 阻止事件冒泡
   */
  catchDialogTap() {
    // 防止点击弹窗内容时关闭弹窗
    return;
  },
  
  /**
   * 清除缓存
   */
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？这不会删除您的账号数据。',
      success: (res) => {
        if (res.confirm) {
          // 保留用户基本信息
          const userInfo = wx.getStorageSync('userInfo');
          const lantingTrees = wx.getStorageSync('lantingTrees');
          const timeSequenceTrees = wx.getStorageSync('timeSequenceTrees');
          const consumedTrees = wx.getStorageSync('consumedTrees');
          
          // 清除所有缓存
          wx.clearStorageSync();
          
          // 恢复用户基本信息
          if (userInfo) wx.setStorageSync('userInfo', userInfo);
          if (lantingTrees) wx.setStorageSync('lantingTrees', lantingTrees);
          if (timeSequenceTrees) wx.setStorageSync('timeSequenceTrees', timeSequenceTrees);
          if (consumedTrees) wx.setStorageSync('consumedTrees', consumedTrees);
          
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 获取微信手机号并登录
   */
  getPhoneNumber: function(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 用户同意授权手机号
      // 正常情况下，这里要将 e.detail.code 发送到服务端，换取手机号
      // 出于演示目的，这里直接模拟成功获取手机号

      wx.showLoading({
        title: '登录中...',
        mask: true
      });

      // 模拟网络请求延迟
      setTimeout(() => {
        // 创建用户信息
        const userInfo = {
          username: '晓时用户',
          avatarUrl: '',
          phoneNumber: '已授权' // 实际应用中这里会是真实手机号
        };
        
        // 保存到本地
        wx.setStorageSync('userInfo', userInfo);
        
        // 更新页面数据
        this.setData({
          isLoggedIn: true,
          username: userInfo.username
        });
        
        wx.hideLoading();
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      }, 1000);
    } else {
      // 用户拒绝授权手机号
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  },
}); 