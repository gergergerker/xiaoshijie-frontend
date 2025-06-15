Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentState: 'home', // 'home', 'faction', 'quiz', 'training'
    selectedFaction: '',
    selectedTeam: '',
    teams: [],
    optionLetters: ['A', 'B', 'C', 'D'],
    questions: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    selectedOption: null,
    timeRemaining: 30,
    teamScores: [],
    showResult: false,
    resultData: {
      title: '',
      message: '',
      scores: [],
      reward: 0,
      isTraining: false
    },
    timerInterval: null,
    factionImages: {
      tower: 'pics/楼台烟雨中.jpg',
      rain: 'pics/好雨知时节.jpg'
    },
    towerMemberCount: 1256,  // 楼台烟雨中成员数
    rainMemberCount: 1378,   // 好雨知时节成员数
    leaderboardUsers: [],    // 排行榜用户
    trainingFaction: '',     // 当前训练的阵营
    answeredQuestions: 0,    // 已回答题目数量
    correctAnswers: 0,       // 正确回答数量
    correctRate: 0,          // 正确率
    dailyWinner: {           // 昨日获胜阵营
      faction: 'tower',
      score: 12580
    },
    isPkTime: false,         // 是否是PK时间（晚上7:30）
    pkCountdownText: '距离开始: --:--:--', // PK倒计时文本
    pkCountdownInterval: null, // PK倒计时定时器
    userFaction: '',          // 用户选择的阵营：'tower'或'rain'，空字符串表示未选择
    lantingTrees: 0,           // LanTing获得的小树数量
    
    // API预留端口
    trainingApiEndpoint: 'https://api.example.com/training', // 训练题目获取API
    questionType: 'single', // 'single'单选题, 'multi'多选题, 'fill'填空题
    trainingType: '', // 'city'城市训练, 'season'时节训练
    multipleQuestions: [], // 多选题列表
    fillQuestions: [], // 填空题列表
    singleQuestions: [], // 单选题列表
    currentQuestionList: [], // 当前题目类型的题目列表
    dailyTrainingCompleted: {
      city: false,
      season: false
    }, // 每日训练是否完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户选择的阵营
    const userFaction = wx.getStorageSync('userFaction') || '';
    
    // 获取LanTing获得的小树数量
    const app = getApp();
    let lantingTrees = 0;
    if (app.globalData && app.globalData.lantingTrees !== undefined) {
      lantingTrees = app.globalData.lantingTrees;
    } else {
      // 如果全局数据不存在，尝试从本地存储获取
      lantingTrees = wx.getStorageSync('lantingTrees') || 0;
    }
    
    this.setData({
      userFaction: userFaction,
      lantingTrees: lantingTrees
    });
    
    // 模拟获取热门选手数据
    this.getLeaderboardData();
    
    // 开始PK倒计时
    this.startCountdown();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取LanTing获得的小树数量
    const app = getApp();
    if (app.globalData && app.globalData.lantingTrees !== undefined) {
      this.setData({
        lantingTrees: app.globalData.lantingTrees
      });
    }
  },

  /**
   * 开始倒计时
   */
  startCountdown() {
    // 检查当前时间并设置倒计时信息
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 清除之前的倒计时定时器
    if (this.data.pkCountdownInterval) {
      clearInterval(this.data.pkCountdownInterval);
    }
    
    // 今天的 19:30
    const todayPkStart = new Date(now);
    todayPkStart.setHours(19, 30, 0, 0);
    
    // 今天的 19:45 (结束时间)
    const todayPkEnd = new Date(now);
    todayPkEnd.setHours(19, 45, 0, 0);
    
    // 明天的 19:30
    const tomorrowPkStart = new Date(now);
    tomorrowPkStart.setDate(now.getDate() + 1);
    tomorrowPkStart.setHours(19, 30, 0, 0);

    let countdownTarget;
    let isActive = false;
    let countdownText = '';

    // 情况1: PK正在进行中 (19:30-19:45)
    if (now >= todayPkStart && now < todayPkEnd) {
      isActive = true;
      countdownTarget = todayPkEnd;
      countdownText = '进行中: ';
    } 
    // 情况2: 今天的PK还没开始，且时间还没到19:30
    else if (now < todayPkStart) {
      countdownTarget = todayPkStart;
      countdownText = '距离开始: ';
    } 
    // 情况3: 今天的PK已结束，倒计时到明天的PK
    else {
      countdownTarget = tomorrowPkStart;
      countdownText = '距离开始: ';
    }

    // 计算初始倒计时
    const initialTimeLeft = countdownTarget - now;
    let hours = Math.floor(initialTimeLeft / (1000 * 60 * 60));
    let minutes = Math.floor((initialTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((initialTimeLeft % (1000 * 60)) / 1000);
    
    // 格式化时间显示
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    this.setData({
      isPkTime: isActive,
      pkCountdownText: countdownText + formattedTime
    });
    
    // 定时更新倒计时
    this.data.pkCountdownInterval = setInterval(() => {
      const currentTime = new Date();
      const timeLeft = countdownTarget - currentTime;
      
      if (timeLeft <= 0) {
        // 倒计时结束，重新启动倒计时逻辑
        clearInterval(this.data.pkCountdownInterval);
        this.startCountdown();
        return;
      }
      
      // 更新倒计时显示
      let hours = Math.floor(timeLeft / (1000 * 60 * 60));
      let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({
        pkCountdownText: countdownText + formattedTime
      });
    }, 1000);
  },

  /**
   * 选择阵营
   */
  selectFaction(e) {
    const faction = e.currentTarget.dataset.faction;
    
    // 显示确认对话框
    wx.showModal({
      title: '阵营选择确认',
      content: `你确定要加入${faction === 'tower' ? '楼台烟雨中' : '好雨知时节'}阵营吗？选择后将无法更改！`,
      confirmText: '确定加入',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          // 保存用户阵营选择
          wx.setStorageSync('userFaction', faction);
          
          // 更新页面数据
          this.setData({
            userFaction: faction
          });
          
          // 显示加入成功提示
          wx.showToast({
            title: `成功加入${faction === 'tower' ? '楼台烟雨中' : '好雨知时节'}`,
            icon: 'success'
          });
          
          // 更新阵营人数
          if (faction === 'tower') {
            this.setData({
              towerMemberCount: this.data.towerMemberCount + 1
            });
          } else {
            this.setData({
              rainMemberCount: this.data.rainMemberCount + 1
            });
          }
        }
      }
    });
  },

  /**
   * 阵营PK入口点击事件
   */
  navigateToPK() {
    // 检查用户是否已选择阵营
    if (!this.data.userFaction) {
      wx.showModal({
        title: '请先选择阵营',
        content: '参与PK大赛需要先选择加入一个阵营',
        confirmText: '知道了',
        showCancel: false
      });
      return;
    }
    
    // 检查是否在PK时间内 (19:30-19:45)
    const now = new Date();
    const pkStartTime = new Date(now);
    pkStartTime.setHours(19, 30, 0, 0);
    
    const pkEndTime = new Date(now);
    pkEndTime.setHours(19, 45, 0, 0);
    
    // PK时间检查
    if (now >= pkStartTime && now < pkEndTime) {
      // 在PK时间内，导航到PK页面
      wx.navigateTo({ 
        url: '../pkBattle/index',
        success: () => {
          console.log('成功导航到PK页面');
        },
        fail: (error) => {
          console.error('导航到PK页面失败:', error);
          wx.showToast({
            title: '导航失败：' + error.errMsg,
            icon: 'none',
            duration: 3000
          });
        }
      });
    } else {
      // 不在PK时间内，显示提示
      const nextPkTime = now < pkStartTime ? pkStartTime : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 30, 0);
      
      const timeFormatter = time => {
        const month = time.getMonth() + 1;
        const date = time.getDate();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        return `${month}月${date}日 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      };
      
      wx.showModal({
        title: 'PK时间未到',
        content: `阵营PK仅在每天19:30-19:45进行，下一场PK时间：${timeFormatter(nextPkTime)}`,
        confirmText: '知道了',
        showCancel: false
      });
    }
  },

  /**
   * 生成模拟数据（实际项目中应从服务器获取）
   */
  generateMockData() {
    // 生成模拟题目
    const mockQuestions = [
      {
        text: '二十四节气中，哪个节气标志着春季的开始？',
        options: ['立春', '雨水', '惊蛰', '春分'],
        correctAnswer: 0
      },
      {
        text: '中国古代城市规划中的"里坊制"最早出现在哪个朝代？',
        options: ['汉朝', '唐朝', '宋朝', '元朝'],
        correctAnswer: 1
      },
      {
        text: '"好雨知时节，当春乃发生"出自谁的诗作？',
        options: ['杜甫', '李白', '白居易', '王维'],
        correctAnswer: 3
      },
      {
        text: '中国古代城市中，皇城一般位于整座城市的什么位置？',
        options: ['东部', '西部', '北部', '中央'],
        correctAnswer: 3
      },
      {
        text: '下列哪个不是中国传统园林的基本要素？',
        options: ['山水', '亭台楼阁', '花木', '霓虹灯'],
        correctAnswer: 3
      }
    ];
    
    this.setData({
      questions: mockQuestions
    });
  },

  /**
   * 加载队伍列表（模拟数据）
   */
  loadTeams(faction, highlightTeamId = '') {
    // 模拟从服务器获取队伍列表
    const mockTeams = [
      {
        id: 't1',
        name: '春风十里队',
        motto: '好雨润万物，春风暖人心',
        memberCount: 3,
        faction: 'tower'
      },
      {
        id: 't2',
        name: '绿荫筑梦队',
        motto: '绿树成荫，筑梦未来',
        memberCount: 2,
        faction: 'tower'
      },
      {
        id: 'r1',
        name: '知时先锋队',
        motto: '知时节，晓时序',
        memberCount: 4,
        faction: 'rain'
      },
      {
        id: 'r2',
        name: '雨露杏林队',
        motto: '春雨如油，润物无声',
        memberCount: 1,
        faction: 'rain'
      }
    ];
    
    // 根据阵营筛选队伍
    const filteredTeams = mockTeams.filter(team => team.faction === faction);
    
    this.setData({
      teams: filteredTeams
    });
    
    // 如果有指定高亮的队伍ID，直接加入该队伍
    if (highlightTeamId) {
      const team = filteredTeams.find(t => t.id === highlightTeamId);
      if (team && team.memberCount < 5) {
        this.joinTeam({ currentTarget: { dataset: { teamId: highlightTeamId } } });
      }
    }
  },

  /**
   * 返回选择阵营页面
   */
  backToHome() {
    this.setData({
      currentState: 'home',
      selectedFaction: '',
      selectedTeam: '',
      trainingFaction: ''
    });
  },

  /**
   * 创建新队伍
   */
  createNewTeam() {
    // 生成随机队伍名和口号
    const teamNames = [
      '春晓先锋队', '云端漫步队', '时雨知春队', '风花雪月队', 
      '竹林探索队', '江南烟雨队', '古城追梦队', '晓风残月队'
    ];
    
    const teamMottos = [
      '春来江水绿如蓝', '好雨知时节', '疏影横斜水清浅', 
      '春风十里不如你', '竹杖芒鞋轻胜马', '小桥流水人家',
      '一花一世界', '云卷云舒日月明'
    ];
    
    // 随机选择名称和口号
    const randomName = teamNames[Math.floor(Math.random() * teamNames.length)];
    const randomMotto = teamMottos[Math.floor(Math.random() * teamMottos.length)];
    
    // 模拟创建队伍并加入
    const newTeam = {
      id: `new-${Date.now()}`,
      name: randomName,
      motto: randomMotto,
      memberCount: 1, // 创建者自己
      faction: this.data.selectedFaction
    };
    
    // 将新队伍添加到列表
    const updatedTeams = [newTeam, ...this.data.teams];
    
    this.setData({
      teams: updatedTeams,
      selectedTeam: newTeam.id
    });
    
    wx.showToast({
      title: '队伍创建成功！',
      icon: 'success'
    });
    
    // 延迟后进入答题页面
    setTimeout(() => {
      this.startQuiz();
    }, 1500);
  },

  /**
   * 加入队伍
   */
  joinTeam(e) {
    const teamId = e.currentTarget.dataset.teamId;
    const team = this.data.teams.find(t => t.id === teamId);
    
    if (team.memberCount >= 5) {
      wx.showToast({
        title: '队伍已满',
        icon: 'error'
      });
      return;
    }
    
    // 更新队伍成员数量
    const updatedTeams = this.data.teams.map(t => {
      if (t.id === teamId) {
        return {...t, memberCount: t.memberCount + 1};
      }
      return t;
    });
    
    this.setData({
      teams: updatedTeams,
      selectedTeam: teamId
    });
    
    wx.showToast({
      title: '加入队伍成功！',
      icon: 'success'
    });
    
    // 延迟后进入答题页面
    setTimeout(() => {
      this.startQuiz();
    }, 1500);
  },

  /**
   * 开始答题
   */
  startQuiz() {
    if (this.data.questions.length === 0) {
      wx.showToast({
        title: '题库为空',
        icon: 'error'
      });
      return;
    }
    
    // 初始化答题状态
    this.setData({
      currentState: 'quiz',
      currentQuestionIndex: 0,
      currentQuestion: this.data.questions[0],
      selectedOption: null,
      timeRemaining: 30,
      teamScores: [
        {
          teamId: this.data.selectedTeam,
          name: this.data.teams.find(t => t.id === this.data.selectedTeam).name,
          score: 0
        },
        {
          teamId: 'opponent',
          name: '对手队伍',
          score: 0
        }
      ]
    });
    
    // 开始计时器
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
    
    // 设置新的计时器
    const timerInterval = setInterval(() => {
      if (this.data.timeRemaining <= 1) {
        // 时间到了自动提交
        clearInterval(timerInterval);
        this.submitAnswer();
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
   * 选择答案选项
   */
  selectOption(e) {
    const optionIndex = e.currentTarget.dataset.optionIndex;
    
    this.setData({
      selectedOption: optionIndex
    });
  },

  /**
   * 提交答案
   */
  submitAnswer() {
    const { questionType, currentQuestion, selectedOption, currentQuestionIndex, currentQuestionList } = this.data;
    
    let isCorrect = false;
    
    // 根据题目类型判断答案是否正确
    switch(questionType) {
      case 'single':
        isCorrect = selectedOption === currentQuestion.correctAnswer;
        break;
      case 'multi':
        // 多选题判断逻辑会在多选题UI中实现
        isCorrect = this.checkMultipleAnswer();
        break;
      case 'fill':
        // 填空题判断逻辑会在填空题UI中实现
        isCorrect = this.checkFillAnswer();
        break;
    }
    
    // 更新答题统计
    let { answeredQuestions, correctAnswers } = this.data;
    answeredQuestions++;
    
    if (isCorrect) {
      correctAnswers++;
    }
    
    // 计算正确率
    const correctRate = Math.round((correctAnswers / answeredQuestions) * 100);
    
    this.setData({
      answeredQuestions,
      correctAnswers,
      correctRate
    });
    
    // 显示答题结果提示
    wx.showToast({
      title: isCorrect ? '回答正确' : '回答错误',
      icon: isCorrect ? 'success' : 'error',
      duration: 1500
    });
    
    // 判断是否答完当前类型的所有题目
    if (currentQuestionIndex >= currentQuestionList.length - 1) {
      // 当前类型训练结束，进入下一类型
      setTimeout(() => {
        this.completeCurrentTypeTraining();
      }, 1500);
    } else {
      // 进入当前类型的下一题
      setTimeout(() => {
        this.setData({
          currentQuestionIndex: currentQuestionIndex + 1,
          currentQuestion: currentQuestionList[currentQuestionIndex + 1],
          selectedOption: null
        });
      }, 1500);
    }
  },

  /**
   * 检查多选题答案
   */
  checkMultipleAnswer() {
    // 这里需要根据实际UI实现多选题的检查逻辑
    // 假设多选题的答案存储在currentQuestion.selectedOptions中
    const { currentQuestion } = this.data;
    
    // 示例实现
    if (!currentQuestion.selectedOptions || !currentQuestion.correctAnswers) {
      return false;
    }
    
    // 检查选择的选项是否与正确答案一致
    if (currentQuestion.selectedOptions.length !== currentQuestion.correctAnswers.length) {
      return false;
    }
    
    for (let i = 0; i < currentQuestion.correctAnswers.length; i++) {
      if (!currentQuestion.selectedOptions.includes(currentQuestion.correctAnswers[i])) {
        return false;
      }
    }
    
    return true;
  },
  
  /**
   * 检查填空题答案
   */
  checkFillAnswer() {
    // 这里需要根据实际UI实现填空题的检查逻辑
    // 假设填空题的用户输入存储在currentQuestion.userAnswer中
    const { currentQuestion } = this.data;
    
    if (!currentQuestion.userAnswer || !currentQuestion.correctAnswer) {
      return false;
    }
    
    // 简单比较答案，可以根据需要进行更复杂的比较（如忽略大小写、空格等）
    return currentQuestion.userAnswer.trim() === currentQuestion.correctAnswer.trim();
  },

  /**
   * 显示训练结果
   */
  showTrainingResult() {
    const { trainingType, correctAnswers } = this.data;
    let resultTitle, resultMessage, reward;
    
    // 根据正确率给予不同的奖励
    if (correctAnswers >= 12) { // 15题中答对12题以上
      resultTitle = '训练优秀！';
      resultMessage = `你在${trainingType === 'city' ? '城市' : '时节'}知识方面表现出色！`;
      reward = 3; // 优秀奖励3棵小树
    } else if (correctAnswers >= 8) { // 15题中答对8-11题
      resultTitle = '训练良好！';
      resultMessage = `继续努力提高你的${trainingType === 'city' ? '城市' : '时节'}知识！`;
      reward = 2; // 良好奖励2棵小树
    } else {
      resultTitle = '需要加强训练';
      resultMessage = `建议多了解${trainingType === 'city' ? '城市' : '时节'}相关知识！`;
      reward = 1; // 基础奖励1颗小树
    }
    
    // 检查是否已完成今日训练
    const dailyTrainingCompleted = this.data.dailyTrainingCompleted;
    
    if (!dailyTrainingCompleted[trainingType]) {
      // 更新全局树木数量
    const app = getApp();
      // 更新来自LanTing的树木数量
      const currentLantingTrees = (app.globalData && app.globalData.lantingTrees) || 0;
      const newLantingTrees = currentLantingTrees + reward;
      
    if (app.globalData) {
        // 更新LanTing树木数量
        app.globalData.lantingTrees = newLantingTrees;
        // 更新总树木数量
        const timeSequenceTrees = app.globalData.timeSequenceTrees || 0;
        const consumedTrees = app.globalData.consumedTrees || 0;
        app.globalData.treeCount = newLantingTrees + timeSequenceTrees - consumedTrees;
      }
      
      // 同时更新本地存储
      wx.setStorageSync('lantingTrees', newLantingTrees);
      wx.setStorageSync('treeCount', app.globalData.treeCount);
      
      // 标记今日训练已完成
      dailyTrainingCompleted[trainingType] = true;
      this.setData({
        dailyTrainingCompleted: dailyTrainingCompleted,
        lantingTrees: newLantingTrees
      });
      
      // 保存训练完成状态到本地存储
      wx.setStorageSync('dailyTrainingCompleted', dailyTrainingCompleted);
    } else {
      // 已完成今日训练，不再获得奖励
      reward = 0;
      resultMessage += "（今日已完成训练，不再获得小树奖励）";
    }
    
    // 显示结果弹窗
    this.setData({
      showResult: true,
      resultData: {
        title: resultTitle,
        message: resultMessage,
        scores: [
          { name: '答题总数', score: 15 },
          { name: '正确题数', score: correctAnswers }
        ],
        reward: reward,
        isTraining: true
      }
    });
  },

  /**
   * 加入阵营
   */
  joinFaction(e) {
    const faction = e.currentTarget.dataset.faction;
    const factionName = faction === 'tower' ? '楼台烟雨中' : '好雨知时节';
    
    // 根据选择的阵营更新人数
    if (faction === 'tower') {
      this.setData({
        towerMemberCount: this.data.towerMemberCount + 1
      });
    } else {
      this.setData({
        rainMemberCount: this.data.rainMemberCount + 1
      });
    }
    
    // 显示加入成功提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500
    });
    
    // 显示加入结果弹窗
    setTimeout(() => {
      this.showJoinResult(faction, factionName);
    }, 1800);
  },
  
  /**
   * 显示加入结果
   */
  showJoinResult(faction, factionName) {
    // 生成随机的小芽奖励
    const reward = Math.floor(Math.random() * 10) + 5;
    
    // 生成一些可能的消息
    const messages = [
      `欢迎加入${factionName}阵营！快去邀请好友一起参与吧！`,
      `恭喜成为${factionName}阵营的一员，一起为阵营争光吧！`,
      `${factionName}阵营因你而更加强大，让我们一起赢得最终胜利！`
    ];
    
    // 随机选择一条消息
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // 显示结果
    this.setData({
      showResult: true,
      resultData: {
        title: `成功加入${factionName}`,
        message: message,
        scores: [
          { name: '楼台烟雨中', score: this.data.towerMemberCount },
          { name: '好雨知时节', score: this.data.rainMemberCount }
        ],
        reward: reward
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '一队一景・时城争锋 - 知识PK大赛',
      path: '/pages/lanTing/index',
      imageUrl: '/pages/lanTing/pics/楼台烟雨中.jpg'
    };
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 清除计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    
    // 清除PK倒计时
    if (this.data.pkCountdownInterval) {
      clearInterval(this.data.pkCountdownInterval);
    }
  },

  /**
   * 生成排行榜数据（50个虚拟用户）
   */
  generateLeaderboardData() {
    // 用户名单
    const userNames = [
      '捕梦小川', '桜吹雪', '风', '曦光微漾', 'サクラの舞', '孤舟蓑笠', 
      '被迫营业的Bug', '杜甫很忙', '破晓星星星', '点绛唇', '夜未央', 
      '暗香略浮动', '平行宇宙客服', '寒江独钓', 'dididi', 'π=3.14...', 
      'Dragon', '浮生若梦', '贝塔', '马到成功', '芝士火锅侠', '雪落', 
      '一叶知秋', '林间小鹿·茗', '小雨桐', 'Geheimnis', '啧', 
      '大黄猫与旧钢琴', '邮筒里的诗', '荒岛22图书馆', '月壤种土豆', 
      '蚌埠住了', '有钳人', '谢谢辽', '西楚霸王？', '进击的PPT', '长安', 
      '旧笺', '凌晨三四五六点', '青柠薄荷糖', '极光便利店', '笑笑蒜了', 
      '佛系卷王', '浣熊冬不拉', '听雪煎茶人', '公主小美', '嘿朋友', 
      '明月何时有', '前浪之之', '故乡2002'
    ];

    // 创建用户数据并添加随机分数和阵营
    const leaderboardData = userNames.map((name, index) => {
      // 基础分数在800-1000之间，前几名有更高的分数
      let baseScore = 800 + Math.floor(Math.random() * 200);
      
      // 前10名有更高的分数
      if (index < 10) {
        baseScore += 100 + (10 - index) * 15;
      }
      
      // 随机分配阵营
      const faction = Math.random() > 0.5 ? 'tower' : 'rain';
      
      return {
        name,
        score: baseScore,
        faction,
        correctRate: Math.floor(70 + Math.random() * 30) // 正确率70%-100%
      };
    });
    
    // 按分数排序
    leaderboardData.sort((a, b) => b.score - a.score);
    
    this.setData({
      leaderboardUsers: leaderboardData
    });
    
    // 确保排行榜已更新，打印前三名用户数据以进行调试
    console.log("排行榜前三名：", leaderboardData.slice(0, 3));
  },

  /**
   * 开始训练
   */
  startTraining(e) {
    const faction = e.currentTarget.dataset.faction;
    const trainingType = faction === 'tower' ? 'city' : 'season';
    
    // 更新训练类型和阵营
    this.setData({
      trainingFaction: faction,
      currentState: 'training',
      trainingType: trainingType,
      questionType: 'single', // 默认从单选题开始
      answeredQuestions: 0,
      correctAnswers: 0,
      correctRate: 0
    });
    
    // 获取训练题目 - API预留
    this.loadTrainingQuestions(trainingType);
  },

  /**
   * 从API加载训练题目
   */
  loadTrainingQuestions(trainingType) {
    const that = this;
    // 显示加载中
    wx.showLoading({
      title: '加载题目中...',
    });
    
    // 获取当前日期作为参数，确保获取每日最新题目
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // 发起API请求获取训练题目
    wx.request({
      url: this.data.trainingApiEndpoint,
      method: 'GET',
      data: {
        type: trainingType, // 'city'或'season'
        date: dateStr, // 当前日期，格式：YYYY-MM-DD
        version: '1.0' // API版本号
      },
      success: (res) => {
        if (res.data && res.data.success) {
          console.log(`成功获取${trainingType}训练题目:`, res.data);
          
          // 保存所有题目
          that.setData({
            singleQuestions: res.data.questions.single || [],
            multipleQuestions: res.data.questions.multiple || [],
            fillQuestions: res.data.questions.fill || [],
          });
          
          // 设置当前题目类型和题目列表
          that.switchQuestionType('single');
          
          wx.hideLoading();
        } else {
          console.error('获取训练题目失败:', res.data?.message || '未知错误');
          wx.hideLoading();
          wx.showToast({
            title: '获取题目失败',
            icon: 'none'
          });
          
          // 失败时使用本地备用题库
          that.generateMockTrainingQuestions(trainingType);
        }
      },
      fail: (error) => {
        console.error('训练题目API调用失败:', error);
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，使用本地题库',
          icon: 'none'
        });
        
        // 网络错误时使用本地备用题库
        that.generateMockTrainingQuestions(trainingType);
      }
    });
  },
  
  /**
   * 生成模拟训练题目（测试用）
   */
  generateMockTrainingQuestions(trainingType) {
    // 模拟单选题
    const singleQuestions = [];
    for (let i = 1; i <= 5; i++) {
      singleQuestions.push({
        id: `single_${i}`,
        text: trainingType === 'city' ? 
          `城市知识单选题${i}：以下哪个城市是中国的首都？` : 
          `时节知识单选题${i}：下列哪个节气属于春季？`,
        options: trainingType === 'city' ? 
          ['上海', '北京', '广州', '深圳'] : 
          ['立春', '小暑', '霜降', '大雪'],
        correctAnswer: trainingType === 'city' ? 1 : 0
      });
    }
    
    // 模拟多选题
    const multipleQuestions = [];
    for (let i = 1; i <= 5; i++) {
      multipleQuestions.push({
        id: `multi_${i}`,
        text: trainingType === 'city' ? 
          `城市知识多选题${i}：以下哪些城市是中国的直辖市？` : 
          `时节知识多选题${i}：以下哪些节气属于夏季？`,
        options: trainingType === 'city' ? 
          ['北京', '上海', '广州', '重庆'] : 
          ['立夏', '小满', '秋分', '冬至'],
        correctAnswers: trainingType === 'city' ? 
          [0, 1, 3] : [0, 1]
      });
    }
    
    // 模拟填空题
    const fillQuestions = [];
    for (let i = 1; i <= 5; i++) {
      fillQuestions.push({
        id: `fill_${i}`,
        text: trainingType === 'city' ? 
          `城市知识填空题${i}：中国最大的城市是___。` : 
          `时节知识填空题${i}："小暑大暑，上蒸下煮"描述的是___季节。`,
        correctAnswer: trainingType === 'city' ? '上海' : '夏季'
      });
    }
    
    this.setData({
      singleQuestions: singleQuestions,
      multipleQuestions: multipleQuestions,
      fillQuestions: fillQuestions
    });
    
    // 设置当前题目类型和题目列表
    this.switchQuestionType('single');
  },
  
  /**
   * 切换题目类型
   */
  switchQuestionType(type) {
    let currentQuestionList = [];
    switch(type) {
      case 'single':
        currentQuestionList = this.data.singleQuestions;
        break;
      case 'multi':
        currentQuestionList = this.data.multipleQuestions;
        break;
      case 'fill':
        currentQuestionList = this.data.fillQuestions;
        break;
    }
    
    if (currentQuestionList.length > 0) {
      this.setData({
        questionType: type,
        currentQuestionList: currentQuestionList,
        currentQuestionIndex: 0,
        currentQuestion: currentQuestionList[0],
        selectedOption: null
      });
    } else {
      wx.showToast({
        title: '没有该类型的题目',
        icon: 'none'
      });
    }
  },
  
  /**
   * 完成当前类型的训练，进入下一类型
   */
  completeCurrentTypeTraining() {
    const currentType = this.data.questionType;
    let nextType = '';
    
    switch(currentType) {
      case 'single':
        nextType = 'multi';
        break;
      case 'multi':
        nextType = 'fill';
        break;
      case 'fill':
        // 所有类型都完成了
        this.showTrainingResult();
        return;
    }
    
    // 切换到下一个题目类型
    this.switchQuestionType(nextType);
    
    wx.showToast({
      title: `进入${nextType === 'multi' ? '多选题' : '填空题'}`,
      icon: 'none'
    });
  },

  /**
   * 关闭结果弹窗
   */
  closeResult() {
    this.setData({
      showResult: false
    });
    
    // 如果当前是训练状态，关闭弹窗后返回主页
    if (this.data.currentState === 'training') {
      this.backToHome();
    }
  },

  /**
   * 获取排行榜数据
   */
  getLeaderboardData() {
    // 显示加载中
    wx.showLoading({
      title: '获取排行榜...',
    });
    
    // 获取当前日期作为参数
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // 从服务器获取排行榜数据
    wx.request({
      url: 'https://api.example.com/leaderboard',
      method: 'GET',
      data: {
        date: dateStr,
        // 传递前一天的日期，获取昨日胜利阵营
        yesterday: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.data && res.data.success) {
          console.log('成功获取排行榜数据:', res.data);
          
          // 更新排行榜数据
          this.setData({
            leaderboardUsers: res.data.users || [],
            dailyWinner: res.data.dailyWinner || this.data.dailyWinner,
            towerMemberCount: res.data.factionCounts?.tower || this.data.towerMemberCount,
            rainMemberCount: res.data.factionCounts?.rain || this.data.rainMemberCount
          });
        } else {
          console.error('获取排行榜数据失败:', res.data?.message || '未知错误');
          // 使用本地生成的排行榜数据
          this.generateLeaderboardData();
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('获取排行榜API调用失败:', error);
        // 使用本地生成的排行榜数据
        this.generateLeaderboardData();
      }
    });
  }
}); 