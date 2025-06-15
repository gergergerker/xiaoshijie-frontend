App({
  onLaunch: function () {
    console.log('App launched');
    
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
  globalData: {
    userInfo: null,
    themeColor: '#e8f5e9',
    lantingTrees: 0,  // LanTing页面获得的小树
    timeSequenceTrees: 0, // 时序漫游获得的小树
    treeCount: 0,  // 总的小树数量（LanTing + TimeSequence - 已消费）
    consumedTrees: 0  // 已消费的小树数量
  }
}) 