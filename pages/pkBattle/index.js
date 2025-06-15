// 阵营PK对战页面
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 页面状态：'waiting'(等待), 'question'(答题), 'result'(结果)
    currentState: 'waiting',
    
    // 阵营数据
    towerCount: 258, // 楼台阵营人数，控制在500以内
    rainCount: 243, // 好雨阵营人数，控制在500以内
    towerScore: 0,
    rainScore: 0,
    
    // 用户数据
    userFaction: '', // 'tower' 或 'rain'
    
    // 问题相关
    currentQuestionIndex: 0,
    totalQuestions: 15, // 5单选+5多选+5填空
    currentQuestion: null,
    currentQuestionType: 'single', // 当前题目类型
    questions: {
      single: [], // 单选题
      multiple: [], // 多选题
      fill: [] // 填空题
    },
    optionLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    selectedOptions: [], // 选中的选项索引，初始为空数组
    fillAnswer: '', // 填空题答案
    
    // UI相关
    showTimer: false,
    timeRemaining: 30,
    statusText: '等待PK开始...',
    canSubmit: false,
    showAnswers: false, // 是否显示参考答案
    isPkTime: false, // 是否是PK时间
    
    // 用户答题统计
    answeredQuestions: 0,
    correctAnswers: 0,
    
    // 结果相关
    winnerFaction: 'tower',
    topPerformers: [],
    totalAnswers: 0,
    avgCorrectRate: 0,
    userRanking: 0, // 用户排名
    userScore: 0, // 用户得分
    userReward: 0, // 用户奖励
    
    // 抢答状态
    isAnswered: false, // 当前题目是否已被抢答
    firstAnswerFaction: '', // 第一个回答的阵营
    
    // 虚拟用户名单（50个用户）
    virtualUsers: [
      '春风归人', '雨巷漫步', '白鹭青洲', '墨池飞雪', '青衫故人',
      '烟雨江南', '雁南飞', '竹影清风', '云水禅心', '山间明月',
      '华灯初上', '烟波浩渺', '古道西风', '星辰大海', '风雨同舟',
      '花开半夏', '清风徐来', '木叶之秋', '湖光山色', '冬雪初霁',
      '梅花三弄', '杏花微雨', '兰亭序', '诗魂墨韵', '桃花扇',
      '渔樵问答', '闲云野鹤', '竹林七贤', '松风琴韵', '岁月如歌',
      '溪山行旅', '林泉高致', '江畔独步', '枫桥夜泊', '雨打芭蕉',
      '青山隐隐', '水墨丹青', '长亭外', '故园风雨', '烟雨楼台',
      '小桥流水', '落花流水', '飞花令', '红袖添香', '绿竹青青',
      '昭华旧事', '锦瑟年华', '流年似水', '梧桐细雨', '山水清音'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 设置初始状态为loading
    this.setData({
      currentState: 'loading',
      statusText: '加载中...'
    });
    
    // 获取用户的阵营信息
    const userFaction = wx.getStorageSync('userFaction') || '';
    
    if (!userFaction) {
      // 如果用户未选择阵营，返回到选择页面
      wx.showModal({
        title: '未选择阵营',
        content: '你需要先选择一个阵营才能参与PK大赛。注意：阵营一旦选择将无法更改！',
        showCancel: false,
        success: (res) => {
          wx.navigateBack();
        }
      });
      return;
    }
    
    // 确保初始化时selectedOptions为空数组
    this.setData({
      userFaction: userFaction,
      totalQuestions: 15, // 确保总题数为15
      selectedOptions: []  // 明确初始化为空数组
    });
    
    // 检查是否是PK时间（19:30-19:45）
    if (!this.checkPkTime()) {
      return; // 如果不是PK时间，不继续加载
    }
    
    // 设置一个定时器，每分钟检查一次是否仍然是PK时间
    this.pkTimeChecker = setInterval(() => {
      this.checkPkTime();
    }, 30000); // 每30秒检查一次
    
    // 连接后端API获取当前PK状态
    this.checkPkStatus();
    
    // 拉取题目数据
    this.fetchQuestions();
    
    // 生成随机的虚拟用户排行榜
    this.generateVirtualRanking();
  },
  
  /**
   * 拉取题目数据
   */
  fetchQuestions() {
    // 显示加载中
    wx.showLoading({
      title: '获取PK题目中...',
    });
    
    // 获取当前日期作为参数，确保获取每日最新题目
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // 发起API请求获取PK题目
    wx.request({
      url: 'https://api.example.com/pk/questions',
      method: 'GET',
      data: {
        date: dateStr, // 当前日期
        faction: this.data.userFaction, // 用户阵营
        version: '1.0' // API版本号
      },
      success: (res) => {
        if (res.data && res.data.success) {
          console.log('成功获取PK题目:', res.data);
          
          // 保存所有题目
          this.setData({
            'questions.single': res.data.questions.single || [],
            'questions.multiple': res.data.questions.multiple || [],
            'questions.fill': res.data.questions.fill || []
          });
          
          // 启动PK
          this.startPK();
          wx.hideLoading();
        } else {
          console.error('获取PK题目失败:', res.data?.message || '未知错误');
          wx.hideLoading();
          wx.showToast({
            title: '获取题目失败，使用备用题库',
            icon: 'none',
            duration: 2000
          });
          
          // 失败时使用本地备用题库
          this.useMockQuestions();
        }
      },
      fail: (error) => {
        console.error('PK题目API调用失败:', error);
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，使用备用题库',
          icon: 'none',
          duration: 2000
        });
        
        // 网络错误时使用本地备用题库
        this.useMockQuestions();
      }
    });
  },
  
  /**
   * 使用备用题库（当API请求失败时）
   */
  useMockQuestions() {
    // 模拟单选题
    const singleQuestions = [
      {
        id: 's1',
        text: '二十四节气中，哪个节气标志着春季的开始？',
        options: ['立春', '雨水', '惊蛰', '春分'],
        correctAnswer: 0
      },
      {
        id: 's2',
        text: '中国古代城市规划中的"里坊制"最早出现在哪个朝代？',
        options: ['汉朝', '唐朝', '宋朝', '元朝'],
        correctAnswer: 1
      },
      {
        id: 's3',
        text: '"好雨知时节，当春乃发生"出自谁的诗作？',
        options: ['杜甫', '李白', '白居易', '王维'],
        correctAnswer: 3
      },
      {
        id: 's4',
        text: '中国古代城市中，皇城一般位于整座城市的什么位置？',
        options: ['东部', '西部', '北部', '中央'],
        correctAnswer: 3
      },
      {
        id: 's5',
        text: '下列哪个不是中国传统园林的基本要素？',
        options: ['山水', '亭台楼阁', '花木', '霓虹灯'],
        correctAnswer: 3
      }
    ];
    
    // 模拟多选题
    const multipleQuestions = [
      {
        id: 'm1',
        text: '下列哪些节气属于春季？（多选）',
        options: ['立春', '小满', '清明', '谷雨', '小雪'],
        correctAnswers: [0, 2, 3]
      },
      {
        id: 'm2',
        text: '中国古代城市中，下列哪些是著名的皇家园林？（多选）',
        options: ['颐和园', '拙政园', '圆明园', '狮子林', '避暑山庄'],
        correctAnswers: [0, 2, 4]
      },
      {
        id: 'm3',
        text: '下列哪些诗句描写了雨景？（多选）',
        options: ['好雨知时节，当春乃发生', '空山新雨后，天气晚来秋', '漠漠水田飞白鹭，阴阴夏木啭黄鹂', '夜来风雨声，花落知多少'],
        correctAnswers: [0, 1, 3]
      },
      {
        id: 'm4',
        text: '下列哪些是中国古代著名的城市规划理念？（多选）',
        options: ['前朱雀，后玄武，左青龙，右白虎', '天人合一', '藏风聚气', '因地制宜', '对称布局'],
        correctAnswers: [0, 1, 2, 3, 4]
      },
      {
        id: 'm5',
        text: '下列哪些城市曾是中国的古都？（多选）',
        options: ['北京', '西安', '洛阳', '南京', '杭州', '开封'],
        correctAnswers: [0, 1, 2, 3, 5]
      }
    ];
    
    // 模拟填空题
    const fillQuestions = [
      {
        id: 'f1',
        text: '《诗经》中"__，有梅"描述的是早春景象。',
        correctAnswer: '南有乔木',
        alternativeAnswers: ['南有乔木']
      },
      {
        id: 'f2',
        text: '中国四大名园分别是：颐和园、__、拙政园、留园。',
        correctAnswer: '承德避暑山庄',
        alternativeAnswers: ['承德避暑山庄', '避暑山庄']
      },
      {
        id: 'f3',
        text: '杜甫的"__，万里无云"描述了晴朗天空的壮丽景象。',
        correctAnswer: '九天阊阖开宫殿',
        alternativeAnswers: ['九天阊阖开宫殿', '九天阊阖']
      },
      {
        id: 'f4',
        text: '在中国传统文化中，__被称为"天下第一福地，财富之地"。',
        correctAnswer: '江南',
        alternativeAnswers: ['江南', '江南地区']
      },
      {
        id: 'f5',
        text: '古代对城市的周围修建城墙，主要起到__和__的作用。（答案用逗号分隔）',
        correctAnswer: '防御,象征',
        alternativeAnswers: ['防御,象征', '军事防御,政治象征', '军事,象征']
      }
    ];
    
    this.setData({
      'questions.single': singleQuestions,
      'questions.multiple': multipleQuestions,
      'questions.fill': fillQuestions
    });
    
    // 启动PK
    this.startPK();
  },
  
  /**
   * 开始PK
   */
  startPK() {
    // 合并所有题目为一个数组
    const allQuestions = [
      ...this.data.questions.single,
      ...this.data.questions.multiple,
      ...this.data.questions.fill
    ];
    
    // 初始化第一题是单选题，创建适当的selectedOptions
    const firstQuestion = this.data.questions.single[0];
    const selectedOptions = []; // 单选题使用索引数组
    
    this.setData({
      currentState: 'question',
      statusText: '抢答模式：第一个抢答正确者得分！',
      showTimer: true,
      currentQuestionType: 'single', // 从单选题开始
      currentQuestion: firstQuestion,
      currentQuestionIndex: 0,
      allQuestions: allQuestions,
      isAnswered: false,
      firstAnswerFaction: '',
      selectedOptions: selectedOptions, // 设置为空数组
      canSubmit: false,  // 重置提交状态
      fillAnswer: ''     // 重置填空答案
    });
    
    console.log('PK开始，初始化selectedOptions:', selectedOptions); // 调试日志
    
    // 开始计时
    this.startTimer();
  },
  
  /**
   * 启动计时器
   */
  startTimer() {
    // 清除旧的计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    
    this.setData({
      timeRemaining: 30,
      isAnswered: false,
      firstAnswerFaction: ''
    });
    
    // 设置新的计时器
    const timerInterval = setInterval(() => {
      if (this.data.timeRemaining <= 1) {
        // 时间到了自动结束此题
        clearInterval(timerInterval);
        
        // 如果没有人回答，两个阵营都不得分
        if (!this.data.isAnswered) {
          wx.showToast({
            title: '时间到，无人答题',
            icon: 'none'
          });
          
          // 延迟后进入下一题
          setTimeout(() => {
            this.goToNextQuestion();
          }, 1500);
        }
      } else {
        this.setData({
          timeRemaining: this.data.timeRemaining - 1
        });
      }
    }, 1000);
    
    this.setData({
      timerInterval: timerInterval
    });
  },
  
  /**
   * 单选题选择选项
   */
  selectOption(e) {
    // 如果已经有人抢答过，则不能再选择
    if (this.data.isAnswered) {
      return;
    }
    
    const optionIndex = parseInt(e.currentTarget.dataset.optionIndex);
    
    // 立即设置选中状态，提供视觉反馈
    this.setData({
      selectedOptions: [optionIndex],
      canSubmit: true
    });
    
    // 提供触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    // 轻提示，增强用户体验
    wx.showToast({
      title: '已选择',
      icon: 'none',
      duration: 500
    });
  },
  
  /**
   * 多选题切换选项
   */
  toggleOption(e) {
    // 如果已经有人抢答过，则不能再选择
    if (this.data.isAnswered) {
      return;
    }
    
    const optionIndex = parseInt(e.currentTarget.dataset.optionIndex);
    
    // 获取当前的选项数量
    const optionsCount = this.data.currentQuestion.options.length;
    
    // 创建或获取选中状态数组
    let selectedOptions = this.data.selectedOptions || [];
    
    // 确保数组长度与选项数量一致
    if (!Array.isArray(selectedOptions) || selectedOptions.length !== optionsCount) {
      selectedOptions = new Array(optionsCount).fill(false);
    } else {
      // 创建新数组，避免直接修改
      selectedOptions = [...selectedOptions];
    }
    
    // 切换选中状态
    selectedOptions[optionIndex] = !selectedOptions[optionIndex];
    
    // 检查是否至少有一个选中的选项
    const hasSelection = selectedOptions.some(item => item === true);
    
    console.log('多选题选项切换后:', selectedOptions); // 调试日志
    
    // 立即设置选中状态，提供视觉反馈
    this.setData({
      selectedOptions: selectedOptions,
      canSubmit: hasSelection
    });
    
    // 提供触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },
  
  /**
   * 更新填空题答案
   */
  updateFillAnswer(e) {
    // 如果已经有人抢答过，则不能再输入
    if (this.data.isAnswered) {
      return;
    }
    
    const value = e.detail.value;
    
    this.setData({
      fillAnswer: value,
      canSubmit: value.trim().length > 0
    });
  },
  
  /**
   * 提交答案
   */
  submitAnswer() {
    // 如果已经有人抢答过，则不能再提交
    if (this.data.isAnswered) {
      return;
    }
    
    // 清除计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    
    const { 
      currentQuestionType, 
      currentQuestion, 
      selectedOptions, 
      fillAnswer, 
      userFaction 
    } = this.data;
    
    // 标记该题已被抢答，记录抢答阵营
    this.setData({
      isAnswered: true,
      firstAnswerFaction: userFaction
    });
    
    // 检查答案是否正确
    let isCorrect = false;
    
    if (currentQuestionType === 'single') {
      isCorrect = selectedOptions[0] === currentQuestion.correctAnswer;
    } else if (currentQuestionType === 'multiple') {
      // 将布尔数组转换为选中的索引数组
      const selectedIndices = selectedOptions
        .map((selected, index) => selected ? index : -1)
        .filter(index => index !== -1);
      
      // 多选题要完全一致才算正确
      const correctAnswers = currentQuestion.correctAnswers;
      
      if (selectedIndices.length === correctAnswers.length) {
        isCorrect = selectedIndices.every(index => correctAnswers.includes(index)) &&
                   correctAnswers.every(index => selectedIndices.includes(index));
      }
    } else if (currentQuestionType === 'fill') {
      // 填空题检查答案
      const userAnswer = fillAnswer.trim();
      const correctAnswer = currentQuestion.correctAnswer;
      const alternativeAnswers = currentQuestion.alternativeAnswers || [];
      
      isCorrect = userAnswer === correctAnswer || 
                  alternativeAnswers.some(answer => userAnswer === answer);
    }
    
    // 抢答模式：答对得1分，答错不得分
    const score = isCorrect ? 1 : 0;
    
    // 更新阵营得分
    if (userFaction === 'tower') {
      this.setData({
        towerScore: this.data.towerScore + score
      });
    } else {
      this.setData({
        rainScore: this.data.rainScore + score
      });
    }
    
    // 更新个人答题统计
    let { answeredQuestions, correctAnswers } = this.data;
    answeredQuestions++;
    
    if (isCorrect) {
      correctAnswers++;
    }
    
    this.setData({
      answeredQuestions,
      correctAnswers
    });
    
    // 上传答题数据到后端
    this.uploadAnswer({
      questionId: currentQuestion.id,
      questionType: currentQuestionType,
      userAnswer: currentQuestionType === 'fill' ? fillAnswer : 
                 (currentQuestionType === 'multiple' ? 
                  selectedOptions.map((selected, index) => selected ? index : -1).filter(index => index !== -1) : 
                  selectedOptions),
      isCorrect: isCorrect,
      score: score,
      timeUsed: 30 - this.data.timeRemaining
    });
    
    // 显示答题结果提示
    wx.showToast({
      title: isCorrect ? '抢答正确 +1分' : '抢答错误',
      icon: isCorrect ? 'success' : 'error'
    });
    
    // 延迟后进入下一题
    setTimeout(() => {
      this.goToNextQuestion();
    }, 1500);
  },
  
  /**
   * 上传答题数据
   */
  uploadAnswer(answerData) {
    // 添加用户阵营和时间戳信息
    const data = {
      ...answerData,
      faction: this.data.userFaction,
      timestamp: new Date().getTime()
    };
    
    // 发送答题数据到服务器
    wx.request({
      url: 'https://api.example.com/pk/submit-answer',
      method: 'POST',
      data: data,
      success: (res) => {
        if (res.data && res.data.success) {
          console.log('答题数据上传成功:', res.data);
          
          // 如果服务器返回了最新的分数，则更新
          if (res.data.scores) {
            this.setData({
              towerScore: res.data.scores.tower || this.data.towerScore,
              rainScore: res.data.scores.rain || this.data.rainScore
            });
          }
        } else {
          console.error('上传答题数据失败:', res.data?.message || '未知错误');
        }
      },
      fail: (error) => {
        console.error('上传答题API调用失败:', error);
      }
    });
  },
  
  /**
   * 生成随机的虚拟用户排行榜
   */
  generateVirtualRanking() {
    // 获取今天的日期，用于每天更换排行榜
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // 获取种子数（根据日期生成固定的随机数，确保同一天看到的排行榜相同）
    const seed = this.hashCode(dateStr);
    
    // 将虚拟用户数组打乱顺序
    const shuffledUsers = this.shuffleWithSeed(this.data.virtualUsers.slice(), seed);
    
    // 虚拟用户数组
    const topUsers = [];
    
    // 创建固定的前10名用户，确保有前三名
    for (let i = 0; i < 10; i++) {
      // 确保前三名有更高分数，分数依次降低
      let score;
      if (i === 0) {
        score = 15; // 第一名
      } else if (i === 1) {
        score = 14; // 第二名
      } else if (i === 2) {
        score = 13; // 第三名
      } else {
        // 其他名次分数在8-12之间
        score = 12 - (i - 3) * 0.5;
      }
      
      // 根据种子决定用户分配到哪个阵营
      const factionSeed = (seed + i) % 2;
      
      const userObj = {
        name: shuffledUsers[i],
        faction: factionSeed === 0 ? 'tower' : 'rain',
        score: score,
        isCurrentUser: false // 确保这不是当前用户
      };
      
      topUsers.push(userObj);
    }
    
    console.log("已生成虚拟用户排行榜:", topUsers);
    
    // 保存排行榜数据
    this.topRankingUsers = topUsers;
    
    // 直接更新到页面数据中，确保初始化时就有排行榜数据
    this.setData({
      topPerformers: topUsers
    });
  },
  
  /**
   * 字符串哈希函数，用于生成固定的随机数种子
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // 转换为32位整数
    }
    return Math.abs(hash);
  },
  
  /**
   * 根据种子打乱数组
   */
  shuffleWithSeed(array, seed) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    
    // 使用种子生成伪随机数
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    // Fisher-Yates 洗牌算法
    while (currentIndex !== 0) {
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    
    return array;
  },
  
  /**
   * 检查是否处于PK时间
   */
  checkPkTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // PK时间固定为19:30-19:45，仅限15分钟
    const isPkTime = (hour === 19 && minute >= 30 && minute < 45);
    
    // 更新页面状态
    this.setData({
      isPkTime: isPkTime
    });
    
    // 如果不在PK时间但页面已加载，需要提示用户并返回
    if (!isPkTime && this.data.currentState !== 'loading') {
      // 计算到下一场PK的时间
      let nextPkTime;
      if (hour < 19 || (hour === 19 && minute < 30)) {
        // 今天的PK还没开始
        nextPkTime = new Date();
        nextPkTime.setHours(19, 30, 0, 0);
      } else {
        // 今天的PK已结束，等待明天的PK
        nextPkTime = new Date();
        nextPkTime.setDate(nextPkTime.getDate() + 1);
        nextPkTime.setHours(19, 30, 0, 0);
      }
      
      // 格式化时间
      const formatTime = (time) => {
        const month = time.getMonth() + 1;
        const date = time.getDate();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        return `${month}月${date}日 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      };
      
      // 如果正在进行PK但时间已结束，显示结果
      if (this.data.currentState === 'question') {
        wx.showModal({
          title: 'PK已结束',
          content: '今天的PK时间已结束，请参加明天的PK！',
          showCancel: false,
          success: (res) => {
            this.showFinalResults(); // 直接显示结果
          }
        });
      } else if (this.data.currentState !== 'result') {
        // 如果不是正在显示结果，提示用户并返回
        wx.showModal({
          title: '非PK时间',
          content: `PK大赛仅在每天19:30-19:45开放，下一场PK时间：${formatTime(nextPkTime)}`,
          showCancel: false,
          success: (res) => {
            wx.navigateBack();
          }
        });
      }
    }
    
    return isPkTime;
  },
  
  /**
   * 检查PK状态
   */
  checkPkStatus() {
    if (!this.data.isPkTime) {
      // 如果不是PK时间，不启动PK
      return;
    }
    
    // 实际应连接后端API，这里使用模拟数据
    // TODO: 使用wx.request连接实际API
    
    // 模拟API调用
    setTimeout(() => {
      // 模拟PK正在进行中的状态
      this.startPK();
    }, 2000);
  },
  
  /**
   * 显示最终结果
   */
  showFinalResults() {
    // 更新状态
    this.setData({
      currentState: 'waiting',
      statusText: '统计中...'
    });
    
    // 显示加载中
    wx.showLoading({
      title: '获取结果中...',
    });
    
    // 获取当前日期作为参数
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // 从服务器获取PK结果
    wx.request({
      url: 'https://api.example.com/pk/results',
      method: 'GET',
      data: {
        date: dateStr,
        faction: this.data.userFaction,
        correctAnswers: this.data.correctAnswers,
        answeredQuestions: this.data.answeredQuestions
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.data && res.data.success) {
          console.log('成功获取PK结果:', res.data);
          
          // 更新结果数据
          this.setData({
            currentState: 'result',
            winnerFaction: res.data.winnerFaction,
            topPerformers: res.data.topPerformers || [],
            totalAnswers: res.data.totalAnswers || (this.data.towerCount + this.data.rainCount),
            avgCorrectRate: res.data.avgCorrectRate || 72,
            showAnswers: true,  // 默认展开参考答案
            userRanking: res.data.userRanking || 0,
            userScore: res.data.userScore || this.data.correctAnswers,
            userReward: res.data.userReward || (res.data.winnerFaction === this.data.userFaction ? 2 : 1)
          });
          
          // 更新用户的树木奖励
          this.updateUserReward(this.data.userReward);
        } else {
          console.error('获取PK结果失败:', res.data?.message || '未知错误');
          // 使用本地计算的结果代替
          this.useLocalResults();
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('获取PK结果API调用失败:', error);
        // 使用本地计算的结果代替
        this.useLocalResults();
      }
    });
  },
  
  /**
   * 使用本地计算的结果（当API请求失败时）
   */
  useLocalResults() {
    // 判断获胜阵营
    const winnerFaction = this.data.towerScore > this.data.rainScore ? 'tower' : 'rain';
    
    // 确定用户得分（当前的正确题目数）
    const userScore = this.data.correctAnswers;
    
    // 计算用户奖励（如果用户所在阵营获胜，则获得2颗树，否则获得1颗树）
    const userReward = (this.data.userFaction === winnerFaction) ? 2 : 1;
    
    // 确保topRankingUsers存在
    if (!this.topRankingUsers || this.topRankingUsers.length === 0) {
      this.generateVirtualRanking();
    }
    
    // 获取排行榜数据
    let topPerformers = [...this.topRankingUsers];
    
    // 用户名称
    const username = wx.getStorageSync('userName') || '我';
    
    // 检查排行榜中是否已有当前用户
    const userExistsInRanking = topPerformers.some(user => user.isCurrentUser);
    
    // 如果排行榜中没有真实用户，则添加当前用户
    if (!userExistsInRanking) {
      // 如果用户不在排行榜中，加入用户信息
      const userRankData = {
        name: username,
        faction: this.data.userFaction,
        score: userScore,
        isCurrentUser: true // 标记为当前用户
      };
      
      // 将用户加入排行榜
      topPerformers.push(userRankData);
      
      // 重新排序
      topPerformers.sort((a, b) => b.score - a.score);
    }
    
    // 限制只显示前10名
    topPerformers = topPerformers.slice(0, 10);
    
    // 查找用户排名
    let userRank = 0;
    for (let i = 0; i < topPerformers.length; i++) {
      if (topPerformers[i].isCurrentUser) {
        userRank = i + 1;
        break;
      }
    }
    
    // 更新结果数据
    this.setData({
      currentState: 'result',
      winnerFaction: winnerFaction,
      topPerformers: topPerformers,
      totalAnswers: this.data.towerCount + this.data.rainCount,
      avgCorrectRate: 72, // 模拟数据
      showAnswers: true,  // 默认展开参考答案
      userRanking: userRank,
      userScore: userScore,
      userReward: userReward
    });
    
    // 输出排行榜数据到控制台以便调试
    console.log('排行榜数据:', topPerformers);
    
    // 更新用户的树木奖励
    this.updateUserReward(userReward);
  },

  /**
   * 进入下一题
   */
  goToNextQuestion() {
    // 获取当前的问题索引和总题目数
    let { currentQuestionIndex, allQuestions } = this.data;
    
    // 判断是否已完成所有题目
    if (currentQuestionIndex >= 14) { // 0-indexed，所以14表示第15题
      // 所有题目都完成了，展示结果
      this.showFinalResults();
      return;
    }
    
    // 进入下一题
    const nextQuestionIndex = currentQuestionIndex + 1;
    
    // 确定下一题的类型
    let nextQuestionType;
    if (nextQuestionIndex < 5) {
      nextQuestionType = 'single';
    } else if (nextQuestionIndex < 10) {
      nextQuestionType = 'multiple';
    } else {
      nextQuestionType = 'fill';
    }
    
    // 获取下一题的题目对象
    const typeIndex = nextQuestionType === 'single' ? nextQuestionIndex : 
                      nextQuestionType === 'multiple' ? nextQuestionIndex - 5 : 
                      nextQuestionIndex - 10;
    
    const nextQuestion = this.data.questions[nextQuestionType][typeIndex];
    
    // 根据题目类型创建适当的selectedOptions
    let selectedOptions;
    if (nextQuestionType === 'multiple') {
      // 多选题使用与选项数量相同的布尔数组
      selectedOptions = new Array(nextQuestion.options.length).fill(false);
    } else {
      // 单选题和填空题使用空数组
      selectedOptions = [];
    }
    
    // 重置答题状态
    this.setData({
      currentQuestionIndex: nextQuestionIndex,
      currentQuestionType: nextQuestionType,
      currentQuestion: nextQuestion,
      currentState: 'waiting',
      selectedOptions: selectedOptions,  // 根据题目类型设置
      fillAnswer: '',
      canSubmit: false,
      isAnswered: false,
      firstAnswerFaction: ''
    });
    
    console.log('切换到新题目类型:', nextQuestionType, '选项状态:', selectedOptions); // 调试日志
    
    // 等待一段时间后开始下一题
    setTimeout(() => {
      this.setData({
        currentState: 'question',
        statusText: '抢答模式：第一个抢答正确者得分！'
      });
      this.startTimer();
    }, 1500);
  },
  
  /**
   * 更新用户奖励
   */
  updateUserReward(reward) {
    // 获取App实例
    const app = getApp();
    
    // 更新全局树木数量
    if (app && app.globalData) {
      const currentTrees = app.globalData.treeCount || 0;
      app.globalData.treeCount = currentTrees + reward;
      
      // 更新本地存储
      wx.setStorageSync('treeCount', app.globalData.treeCount);
      
      console.log('用户获得奖励：', reward, '棵树，当前总数：', app.globalData.treeCount);
    }
  },
  
  /**
   * 返回首页
   */
  returnToHome() {
    wx.navigateBack();
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 清除计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    
    // 清除PK时间检查定时器
    if (this.pkTimeChecker) {
      clearInterval(this.pkTimeChecker);
    }
  },
  
  /**
   * 切换参考答案区域的显示/隐藏状态
   */
  toggleAnswersDisplay() {
    this.setData({
      showAnswers: !this.data.showAnswers
    });
    
    // 提供振动反馈
    wx.vibrateShort({
      type: 'light'
    });
  }
});
