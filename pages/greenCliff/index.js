// pages/greenCliff/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showScrolls: true,
    selectedType: '',
    treeCount: 215,
    showChapterMenu: false,
    showAreaMenu: false,
    filteredChapter: '',
    filteredArea: '',
    selectedSeasonArea: '', // 当前选中的博物馆区域
    solarTerms: [
      { name: '立春', phenology: ['东风解冻', '蛰虫始振', '鱼陟负冰'] },
      { name: '雨水', phenology: ['獭祭鱼', '鸿雁来', '草木萌动'] },
      { name: '惊蛰', phenology: ['桃始华', '仓庚鸣', '鹰化为鸠'] },
      { name: '春分', phenology: ['玄鸟至', '雷乃发声', '始电'] },
      { name: '清明', phenology: ['桐始华', '田鼠化为鴽', '虹始见'] },
      { name: '谷雨', phenology: ['萍始生', '鸣鸠拂其羽', '戴胜降于桑'] },
      { name: '立夏', phenology: ['蝼蝈鸣', '蚯蚓出', '王瓜生'] },
      { name: '小满', phenology: ['苦菜秀', '靡草死', '麦秋至'] },
      { name: '芒种', phenology: ['螳螂生', '鵙始鸣', '反舌无声'] },
      { name: '夏至', phenology: ['鹿角解', '蜩始鸣', '半夏生'] },
      { name: '小暑', phenology: ['温风至', '蟋蟀居宇', '鹰始挚'] },
      { name: '大暑', phenology: ['腐草为萤', '土润溽暑', '大雨时行'] },
      { name: '立秋', phenology: ['凉风至', '白露降', '寒蝉鸣'] },
      { name: '处暑', phenology: ['鷹乃祭鳥', '天地始肃', '禾乃登'] },
      { name: '白露', phenology: ['鸿雁来宾', '玄鸟归', '群鸟养羞'] },
      { name: '秋分', phenology: ['雷始收声', '蛰虫坯户', '水始涸'] },
      { name: '寒露', phenology: ['鸿雁来宾', '雀入大水为蛤', '菊有黄华'] },
      { name: '霜降', phenology: ['豺乃祭兽', '草木黄落', '蜇虫咸俯'] },
      { name: '立冬', phenology: ['水始冰', '地始冻', '雉入大水为蜃'] },
      { name: '小雪', phenology: ['虹藏不见', '天气上升地气下降', '闭塞而成冬'] },
      { name: '大雪', phenology: ['鹖旦不鸣', '虎始交', '荔挺出'] },
      { name: '冬至', phenology: ['蚯蚓结', '麋角解', '水泽腹坚'] },
      { name: '小寒', phenology: ['雁北乡', '鹊始巢', '雉始雊'] },
      { name: '大寒', phenology: ['鸡始乳', '征鸟厉疾', '水泽腹坚'] }
    ],
    cityMuseum: {
      chapters: [
        { id: 'concept', name: '概念篇' },
        { id: 'origin', name: '起源篇' },
        { id: 'ancient', name: '古城篇' },
        { id: 'scale', name: '规模篇' },
        { id: 'function', name: '职能篇' },
        { id: 'location', name: '位置篇' },
        { id: 'form', name: '形态篇' },
        { id: 'capital', name: '首都篇' },
        { id: 'literature', name: '名著篇' },
        { id: 'ranking', name: '名称篇' }
      ]
    },
    seasonMuseum: {
      areas: [
        { id: 'astronomy', name: '天文区', description: '探索二十四节气与天文学的关系' },
        { id: 'climate', name: '气候区', description: '了解二十四节气与气候变化的关联' },
        { id: 'tools', name: '工具区', description: '古代农具与二十四节气的农事活动' },
        { id: 'calendar', name: '历法区', description: '中国传统历法与节气划分' },
        { id: 'crops', name: '作物区', description: '不同节气适宜种植的农作物' },
        { id: 'painting', name: '绘画区', description: '二十四节气主题的传统绘画' },
        { id: 'literature', name: '文学区', description: '古诗词中的二十四节气' },
        { id: 'music', name: '音乐区', description: '节气相关的传统音乐' }
      ]
    },
    // 城市博物馆章节
    cityMuseumChapters: [
      // ... existing code ...
    ],
    
    // 诗画古城数据
    cityPoetry: [
      {
        verse: "念天地之悠悠，独怆然而涕下",
        title: "登幽州台歌",
        poet: "陈子昂",
        city: "北京"
      },
      {
        verse: "洛阳自古多才子，唯爱春风烂漫游",
        title: "和秋游洛阳",
        poet: "徐凝",
        city: "洛阳"
      },
      {
        verse: "一骑红尘妃子笑，无人知是荔枝来",
        title: "过华清宫",
        poet: "杜牧",
        city: "西安"
      },
      {
        verse: "旧时王谢堂前燕，飞入寻常百姓家",
        title: "乌衣巷",
        poet: "刘禹锡",
        city: "南京"
      },
      {
        verse: "接天莲叶无穷碧，映日荷花别样红",
        title: "晓出净慈寺送林子方",
        poet: "杨万里",
        city: "杭州"
      },
      {
        verse: "晓看红湿处，花重锦官城",
        title: "春夜喜雨",
        poet: "杜甫",
        city: "成都"
      },
      {
        verse: "两岸猿声啼不住，轻舟已过万重山",
        title: "早发白帝城",
        poet: "李白",
        city: "重庆"
      },
      {
        verse: "姑苏城外寒山寺，夜半钟声到客船",
        title: "枫桥夜泊",
        poet: "张继",
        city: "苏州"
      },
      {
        verse: "孤帆远影碧空尽，唯见长江天际流",
        title: "黄鹤楼送孟浩然之广陵",
        poet: "李白",
        city: "武汉"
      },
      {
        verse: "落霞与孤鹜齐飞，秋水共长天一色",
        title: "滕王阁序",
        poet: "王勃",
        city: "南昌"
      },
      {
        verse: "宫女如花满春殿，只今惟有鹧鸪飞",
        title: "越中览古",
        poet: "李白",
        city: "绍兴"
      },
      {
        verse: "风流最数宣城，奇山秀水神仙府",
        title: "水龙吟",
        poet: "李廷忠",
        city: "宣城"
      },
      {
        verse: "八月书空雁字联，岳阳楼上俯晴川",
        title: "题岳阳楼",
        poet: "刘仙伦",
        city: "岳阳"
      },
      {
        verse: "浔阳江头夜送客，枫叶荻花秋瑟瑟",
        title: "琵琶行",
        poet: "白居易",
        city: "九江"
      },
      {
        verse: "春风十里扬州路，卷上珠帘总不如",
        title: "赠别",
        poet: "杜牧",
        city: "扬州"
      },
      {
        verse: "金华山色与天齐，一径盘纡尽石梯",
        title: "金华山",
        poet: "袁吉",
        city: "金华"
      },
      {
        verse: "清晨入古寺，初日照高林",
        title: "题破山寺后禅院",
        poet: "常建",
        city: "常熟"
      },
      {
        verse: "潮平两岸阔，风正一帆悬",
        title: "次北固山下",
        poet: "王湾",
        city: "镇江"
      },
      {
        verse: "新丰美酒斗十千，咸阳游侠多少年",
        title: "少年行四首",
        poet: "王维",
        city: "咸阳"
      },
      {
        verse: "好水好山看不足，马蹄催趁月明归",
        title: "登池州翠微亭诗",
        poet: "岳飞",
        city: "池州"
      },
      {
        verse: "野芳发而幽香，佳木秀而繁阴",
        title: "醉翁亭记",
        poet: "欧阳修",
        city: "滁州"
      },
      {
        verse: "大风起兮云飞扬",
        title: "大风歌",
        poet: "刘邦",
        city: "徐州"
      },
      {
        verse: "天门中断楚江开，碧水东流至此回",
        title: "望天门山",
        poet: "李白",
        city: "马鞍山"
      },
      {
        verse: "行遍江南清丽地，人生只合住湖州",
        title: "湖州",
        poet: "戴表元",
        city: "湖州"
      },
      {
        verse: "五色罗裙风摆动，好将蝴蝶斗春归",
        title: "怀潍县",
        poet: "郑板桥",
        city: "潍坊"
      },
      {
        verse: "大堤欲上谁相伴，马踏春泥半是花",
        title: "襄阳寒食寄宇文籍",
        poet: "窦巩",
        city: "襄阳"
      },
      {
        verse: "烟云侵岭路，草木半炎洲",
        title: "过虔州登郁孤台",
        poet: "苏轼",
        city: "赣州"
      },
      {
        verse: "树深时见鹿，溪午不闻钟",
        title: "访戴天山道士不遇",
        poet: "李白",
        city: "江油"
      },
      {
        verse: "日月之行，若出其中",
        title: "观沧海",
        poet: "曹操",
        city: "昌黎"
      },
      {
        verse: "雕车竞驻于天街，宝马争驰于御路",
        title: "东京梦华录",
        poet: "孟元老",
        city: "开封"
      },
      {
        verse: "孤舟蓑笠翁，独钓寒江雪",
        title: "江雪",
        poet: "柳宗元",
        city: "永州"
      },
      {
        verse: "白日依山尽，黄河入海流",
        title: "登鹳雀楼",
        poet: "王之涣",
        city: "永济"
      },
      {
        verse: "桃花潭水深千尺，不及汪伦送我情",
        title: "赠汪伦",
        poet: "李白",
        city: "泾县"
      }
    ],
    currentPoetryIndex: 0,
    showSeasonAreaMenu: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 处理诗句，添加换行
    this.processPoetry();
    
    // 获取树的数量
    const app = getApp();
    if (app.globalData && app.globalData.treeCount !== undefined) {
      this.setData({
        treeCount: app.globalData.treeCount
      });
    } else {
      // 如果全局数据不存在，尝试从本地存储获取
      const lantingTrees = wx.getStorageSync('lantingTrees') || 0;
      const timeSequenceTrees = wx.getStorageSync('timeSequenceTrees') || 0;
      const consumedTrees = wx.getStorageSync('consumedTrees') || 0;
      const treeCount = lantingTrees + timeSequenceTrees - consumedTrees;
      
      this.setData({
        treeCount: treeCount
      });
    }

    // 随机初始化诗词索引，让每次打开页面显示不同的诗
    const randomIndex = Math.floor(Math.random() * this.data.cityPoetry.length);
    this.setData({
      currentPoetryIndex: randomIndex
    });
  },

  // 处理诗句，添加换行
  processPoetry() {
    const poetry = this.data.cityPoetry;
    poetry.forEach((item, index) => {
      if (item.verse.includes('，')) {
        poetry[index].verse = item.verse.replace('，', '，\n');
      } else if (item.verse.includes('。')) {
        poetry[index].verse = item.verse.replace('。', '。\n');
      }
    });
    this.setData({
      cityPoetry: poetry
    });
  },

  // 选择画轴
  onSelectScroll(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      showScrolls: false,
      selectedType: type
    });
  },

  // 返回画轴选择
  onBack() {
    this.setData({
      showScrolls: true,
      selectedType: '',
      showChapterMenu: false,
      showAreaMenu: false,
      filteredChapter: '',
      filteredArea: ''
    });
  },

  // 切换章节菜单
  toggleChapterMenu() {
    this.setData({
      showChapterMenu: !this.data.showChapterMenu
    });
  },

  // 切换区域菜单
  toggleAreaMenu() {
    this.setData({
      showAreaMenu: !this.data.showAreaMenu,
      showChapterMenu: false
    });
  },

  // 选择章节
  selectChapter(e) {
    const chapter = e.currentTarget.dataset.chapter;
    this.setData({
      filteredChapter: chapter,
      showChapterMenu: false
    });
  },

  // 选择区域
  selectArea(e) {
    const area = e.currentTarget.dataset.area;
    this.setData({
      selectedSeasonArea: area,
      showAreaMenu: false
    });
  },

  // 打开城市章节
  openCityChapter(e) {
    const chapter = e.currentTarget.dataset.chapter;
    // 检查是否需要树木解锁
    let requiredTrees = 0;
    
    // 恢复原始的树木需求
    switch(chapter) {
      case 'concept':
        // 概念篇是免费的
        break;
      case 'ranking':
        requiredTrees = 35;
        break;
      case 'origin':
      case 'ancient':
      case 'scale':
      case 'function':
        requiredTrees = 15;
        break;
      case 'capital':
        requiredTrees = 25;
        break;
      case 'location':
      case 'form':
      case 'literature':
        requiredTrees = 50;
        break;
      default:
        break;
    }
    
    // 检查是否已经解锁过
    const unlockedChapters = wx.getStorageSync('unlockedChapters') || [];
    const isUnlocked = unlockedChapters.includes(chapter);
    
    if (requiredTrees === 0 || isUnlocked) {
      // 免费或已经解锁过，直接显示内容
      wx.navigateTo({
        url: `/pages/articleDetail/index?type=city&chapter=${chapter}`
      });
    } else if (this.data.treeCount >= requiredTrees) {
      // 有足够的树，但未解锁过，询问是否解锁
      wx.showModal({
        title: '解锁章节',
        content: `首次查看此章节需要消耗${requiredTrees}颗小树，解锁后可永久免费查看。确定解锁吗？`,
        confirmText: '确定解锁',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 用户确认解锁
            // 更新已消费树木数量
            const app = getApp();
            const currentConsumedTrees = (app.globalData && app.globalData.consumedTrees) || 0;
            const newConsumedTrees = currentConsumedTrees + requiredTrees;
            
            if (app.globalData) {
              // 更新已消费树木数量
              app.globalData.consumedTrees = newConsumedTrees;
              // 更新总可用树木数量
              const lantingTrees = app.globalData.lantingTrees || 0;
              const timeSequenceTrees = app.globalData.timeSequenceTrees || 0;
              app.globalData.treeCount = lantingTrees + timeSequenceTrees - newConsumedTrees;
            }
            
            // 更新本地存储
            wx.setStorageSync('consumedTrees', newConsumedTrees);
            wx.setStorageSync('treeCount', app.globalData.treeCount);
            
            // 记录已解锁章节
            unlockedChapters.push(chapter);
            wx.setStorageSync('unlockedChapters', unlockedChapters);
            
            // 更新UI
            this.setData({
              treeCount: app.globalData.treeCount
            });
            
            // 导航到章节内容
            wx.navigateTo({
              url: `/pages/articleDetail/index?type=city&chapter=${chapter}`
            });
          }
        }
      });
    } else {
      // 树不够，提示解锁
      wx.showModal({
        title: '需要解锁',
        content: `查看此章节需要${requiredTrees}颗小树，您当前有${this.data.treeCount}颗。可以通过参与问答获得更多小树。`,
        confirmText: '知道了',
        showCancel: false
      });
    }
  },

  /**
   * 打开时节博物馆区域
   */
  openSeasonArea(e) {
    const area = e.currentTarget.dataset.area;
    
    // 检查是否需要树木解锁
    let requiredTrees = 0;
    
    // 设置各区域所需树木数量
    switch(area) {
      case 'music':
        // 音乐区免费
        break;
      case 'tools':
        requiredTrees = 5;
        break;
      case 'astronomy':
      case 'crops':
      case 'painting':
        requiredTrees = 10;
        break;
      case 'climate':
        requiredTrees = 20;
        break;
      case 'calendar':
      case 'literature':
        requiredTrees = 50;
        break;
      default:
        break;
    }
    
    // 检查是否已经解锁过
    const unlockedAreas = wx.getStorageSync('unlockedAreas') || [];
    const isUnlocked = unlockedAreas.includes(area);
    
    if (requiredTrees === 0 || isUnlocked) {
      // 免费或已经解锁过，直接显示内容
      wx.navigateTo({
        url: `/pages/articleDetail/index?type=season&area=${area}`
      });
    } else if (this.data.treeCount >= requiredTrees) {
      // 有足够的树，但未解锁过，询问是否解锁
      // 找到区域信息
      const areaInfo = this.data.seasonMuseum.areas.find(item => item.id === area);
      wx.showModal({
        title: '解锁区域',
        content: `首次查看${areaInfo ? areaInfo.name : '此区域'}需要消耗${requiredTrees}颗小树，解锁后可永久免费查看。确定解锁吗？`,
        confirmText: '确定解锁',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 用户确认解锁
            // 更新已消费树木数量
            const app = getApp();
            const currentConsumedTrees = (app.globalData && app.globalData.consumedTrees) || 0;
            const newConsumedTrees = currentConsumedTrees + requiredTrees;
            
            if (app.globalData) {
              // 更新已消费树木数量
              app.globalData.consumedTrees = newConsumedTrees;
              // 更新总可用树木数量
              const lantingTrees = app.globalData.lantingTrees || 0;
              const timeSequenceTrees = app.globalData.timeSequenceTrees || 0;
              app.globalData.treeCount = lantingTrees + timeSequenceTrees - newConsumedTrees;
            }
            
            // 更新本地存储
            wx.setStorageSync('consumedTrees', newConsumedTrees);
            wx.setStorageSync('treeCount', app.globalData.treeCount);
            
            // 记录已解锁区域
            unlockedAreas.push(area);
            wx.setStorageSync('unlockedAreas', unlockedAreas);
            
            // 更新UI
            this.setData({
              treeCount: app.globalData.treeCount
            });
            
            // 导航到区域内容
            wx.navigateTo({
              url: `/pages/articleDetail/index?type=season&area=${area}`
            });
          }
        }
      });
    } else {
      // 树不够，提示解锁
      // 找到区域信息
      const areaInfo = this.data.seasonMuseum.areas.find(item => item.id === area);
      wx.showModal({
        title: '需要解锁',
        content: `查看${areaInfo ? areaInfo.name : '此区域'}需要${requiredTrees}颗小树，您当前有${this.data.treeCount}颗。可以通过参与问答获得更多小树。`,
        confirmText: '知道了',
        showCancel: false
      });
    }
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
    // 页面显示时，重新获取树的数量
    const app = getApp();
    if (app.globalData && app.globalData.treeCount !== undefined) {
      this.setData({
        treeCount: app.globalData.treeCount
      });
    }
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

  },

  /**
   * 选择某个节气，显示详情
   */
  selectSolarTerm(e) {
    const index = e.currentTarget.dataset.index;
    this.showSolarTermDetail(index);
  },

  /**
   * 显示节气详情
   */
  showSolarTermDetail(index) {
    const term = this.data.solarTerms[index];
    let content = term.phenology.join('\n');
    
    wx.showModal({
      title: term.name,
      content: content,
      showCancel: false,
      confirmText: '关闭'
    });
  },

  /**
   * 打开季节介绍页面
   */
  openSeasonIntro(e) {
    const season = e.currentTarget.dataset.season;
    let seasonName = '';
    
    switch(season) {
      case 'all':
        seasonName = '二十四节气概览';
        break;
      case 'spring':
        seasonName = '春季节气';
        break;
      case 'summer':
        seasonName = '夏季节气';
        break;
      case 'autumn':
        seasonName = '秋季节气';
        break;
      case 'winter':
        seasonName = '冬季节气';
        break;
      default:
        seasonName = '节气介绍';
    }
    
    wx.navigateTo({
      url: `/pages/articleDetail/index?type=seasonIntro&season=${season}&title=${seasonName}`
    });
  },

  // 诗画古城轮播图改变事件
  onPoetrySwiperChange: function(e) {
    const current = e.detail.current;
    this.setData({
      currentPoetryIndex: current
    });
  },
  
  // 显示诗词详情
  showPoetryDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const poetry = this.data.cityPoetry[index];
    wx.showModal({
      title: poetry.title,
      content: `${poetry.verse}\n\n${poetry.poet} · ${poetry.city}`,
      showCancel: false,
      confirmText: '关闭'
    });
  },
  
  onFilterChapterTap: function(e) {
    // ... existing code ...
  },

  /**
   * 切换节气区域选择菜单显示状态
   */
  toggleSeasonAreaMenu() {
    this.setData({
      showSeasonAreaMenu: !this.data.showSeasonAreaMenu
    });
  },

  /**
   * 选择要显示的节气区域
   */
  selectSeasonArea(e) {
    const area = e.currentTarget.dataset.area;
    this.setData({
      filteredArea: area,
      showSeasonAreaMenu: false
    });
    // 根据选择的区域筛选内容
    this.openSeasonArea(e);
  },
})