// 时序经纬页面逻辑
const app = getApp();

// 工具函数：判断是否为闰年
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 工具函数：获取指定年月的天数
function getDaysInMonth(year, month) {
  // month 是 1-12
  const daysInMonth = [
    31, // 一月
    isLeapYear(year) ? 29 : 28, // 二月，闰年29天，平年28天
    31, // 三月
    30, // 四月
    31, // 五月
    30, // 六月
    31, // 七月
    31, // 八月
    30, // 九月
    31, // 十月
    30, // 十一月
    31  // 十二月
  ];
  
  return daysInMonth[month - 1];
}

// 根据月份确定季节样式
function getSeasonStyle(month) {
  // 冬季：12月、1月、2月
  if (month === 12 || month === 1 || month === 2) {
    return {
      season: 'winter',
      bgColor: '#e3f2fd', // 最浅的玛雅蓝色
      emoji: ['❄️', '⛄'][Math.floor(Math.random() * 2)] // 雪花或雪人
    };
  }
  // 春季：3月、4月、5月
  else if (month >= 3 && month <= 5) {
    return {
      season: 'spring',
      bgColor: '#fff0f5', // 更浅的粉色
      emoji: ['☁️', '🍃'][Math.floor(Math.random() * 2)] // 云朵或树叶
    };
  }
  // 夏季：6月、7月、8月
  else if (month >= 6 && month <= 8) {
    return {
      season: 'summer',
      bgColor: '#e8f5e9', // 最浅绿色
      emoji: ['🌿', '🌱'][Math.floor(Math.random() * 2)] // 叶子或发芽
    };
  }
  // 秋季：9月、10月、11月
  else if (month >= 9 && month <= 11) {
    return {
      season: 'autumn',
      bgColor: '#fffde7', // 最最最最浅的黄色
      emoji: ['🍂', '🦢'][Math.floor(Math.random() * 2)] // 落叶或大雁
    };
  }
}

// 生成指定年份和月份的城市数据
// selectedMonth: 1-12表示具体月份
function generateCities(year = 2025, selectedMonth = 1) {
  // 增加日志跟踪
  console.log(`生成${year}年${selectedMonth}月的城市数据`);
  
  let cities = [];
  const currentDate = new Date();

  try {
    // 只生成选定月份的数据
    const month = selectedMonth;
    const daysInMonth = getDaysInMonth(year, month);
    console.log(`当月天数: ${daysInMonth}`);
    
    // 生成当月每一天的城市
    for (let day = 1; day <= daysInMonth; day++) {
      // 确定解锁日期
      const formattedDate = `${month}月${day}日`;
      
      // 强制所有城市都解锁（用于测试）
      const isUnlocked = true;
      
      // 获取季节样式
      const seasonStyle = getSeasonStyle(month);
      
      // 城市ID，按日期顺序递增
      const cityId = (month - 1) * 31 + day; // 使用足够大的乘数确保ID唯一
      
      // 生成城市名称，明确指定为字符串类型，避免出现%
      const cityName = `城市${month}-${day}`;
      
      // 验证城市名称有效
      if (!cityName || cityName === '%') {
        console.error(`无效的城市名称: ${cityName}, 使用默认名称替代`);
        cityName = `测试城市${month}-${day}`;
      }
      
      // 模拟城市数据 - 预留API接口
      cities.push({
        id: cityId,
        name: cityName,
        iconUrl: `https://via.placeholder.com/120x90.png?text=City${cityId}`,
        unlocked: isUnlocked,
        unlockDate: formattedDate,
        daysToUnlock: 0,
        month: month,
        day: day,
        year: year,
        season: seasonStyle.season,
        seasonBgColor: seasonStyle.bgColor,
        seasonEmoji: seasonStyle.emoji,
        location: `城市${month}-${day}的地理位置`,
        culture: `城市${month}-${day}的文化信息`,
        features: `城市${month}-${day}的特色信息`,
        funFacts: `城市${month}-${day}的趣味知识`,
        challenge: {
          type: ['quiz', 'memory'][Math.floor(Math.random() * 2)],
          description: `完成这个挑战来解锁城市${month}-${day}的所有信息！`
        }
      });
    }
    
    console.log(`成功生成${cities.length}个城市`);
    return cities;
  } catch (error) {
    console.error('生成城市数据出错:', error);
    // 返回空数组而不是抛出错误，避免整个流程中断
    return [];
  }
}

// TODO: 实际项目中，添加API获取城市数据的函数
// function fetchCitiesFromAPI(year, month = 0) {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: 'https://api.example.com/cities',
//       data: { 
//         year: year,
//         month: month
//       },
//       success: (res) => {
//         // 处理空城市名称问题
//         const cities = res.data.cities.map(city => {
//           // 如果API返回的城市名为空，可以使用一个占位符
//           if (!city.name) {
//             city.name = '城市信息加载中...';
//           }
//           return city;
//         });
//         resolve(cities);
//       },
//       fail: (err) => {
//         reject(err);
//       }
//     });
//   });
// }

// 初始化挑战游戏数据
function initQuizGame() {
  return {
    questions: [
      {
        text: "这座城市的主要特色是什么？",
        options: ["自然风光", "历史建筑", "现代科技", "传统文化"],
        correctAnswer: "历史建筑"
      },
      {
        text: "该城市最著名的景点是什么？",
        options: ["中央公园", "历史博物馆", "艺术中心", "古代城墙"],
        correctAnswer: "古代城墙"
      },
      {
        text: "这座城市的气候特点是？",
        options: ["四季分明", "常年温暖", "多雨潮湿", "干燥少雨"],
        correctAnswer: "四季分明"
      }
    ],
    currentQuestionIndex: 0,
    score: 0
  };
}

// 初始化拼图游戏
function initPuzzleGame() {
  const puzzleImageUrl = 'https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg';
  const numRows = 3;
  const numCols = 3;
  
  // 创建9个拼图槽位
  const puzzleSlots = [];
  for (let i = 0; i < numRows * numCols; i++) {
    const row = Math.floor(i / numCols);
    const col = i % numCols;
    puzzleSlots.push({
      id: i,
      filled: false,
      pieceId: null,
      position: {
        x: col * 100,
        y: row * 100
      }
    });
  }

  // 创建9个拼图块
  const puzzlePieces = [];
  for (let i = 0; i < numRows * numCols; i++) {
    const row = Math.floor(i / numCols);
    const col = i % numCols;
    puzzlePieces.push({
      id: i,
      inSlot: false,
      slotId: null,
      backgroundPositionX: -col * 100,
      backgroundPositionY: -row * 100,
      position: {
        x: Math.floor(Math.random() * 150),
        y: Math.floor(Math.random() * 50) + 50
      }
    });
  }
  
  // 打乱拼图块
  const shuffledPieces = shufflePuzzlePieces([...puzzlePieces]);
  
  this.setData({
    puzzleImageUrl,
    puzzleSlots,
    puzzlePieces: shuffledPieces,
    currentGame: 'puzzle',
    puzzleComplete: false,
    draggingPiece: null,
    dragStartX: 0,
    dragStartY: 0
  });
}

// 打乱拼图块，确保可解
function shufflePuzzlePieces(pieces) {
  // 随机打乱
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    
    // 更新位置，使其分布在拼图盘中
    pieces[i].position = {
      x: 10 + (Math.random() * 180),
      y: 10 + (Math.random() * 180)
    };
  }
  
  return pieces;
}

// 开始拖动拼图块
function puzzlePieceTouchStart(e) {
  const pieceId = e.currentTarget.dataset.id;
  const index = this.data.puzzlePieces.findIndex(piece => piece.id === pieceId);
  
  if (index !== -1) {
    const piece = this.data.puzzlePieces[index];
    if (piece.inSlot) return; // 已经在槽位中的不能拖动
    
    this.setData({
      draggingPiece: pieceId,
      dragStartX: e.touches[0].clientX,
      dragStartY: e.touches[0].clientY,
      [`puzzlePieces[${index}].dragging`]: true
    });
  }
}

// 拖动拼图块
function puzzlePieceTouchMove(e) {
  if (this.data.draggingPiece === null) return;
  
  const pieceId = this.data.draggingPiece;
  const index = this.data.puzzlePieces.findIndex(piece => piece.id === pieceId);
  
  if (index !== -1) {
    const deltaX = e.touches[0].clientX - this.data.dragStartX;
    const deltaY = e.touches[0].clientY - this.data.dragStartY;
    
    const piece = this.data.puzzlePieces[index];
    const newPosition = {
      x: piece.position.x + deltaX,
      y: piece.position.y + deltaY
    };
    
    // 限制拖动范围在容器内
    newPosition.x = Math.max(0, Math.min(newPosition.x, 250));
    newPosition.y = Math.max(0, Math.min(newPosition.y, 300));
    
    this.setData({
      dragStartX: e.touches[0].clientX,
      dragStartY: e.touches[0].clientY,
      [`puzzlePieces[${index}].position`]: newPosition
    });
  }
}

// 结束拖动拼图块
function puzzlePieceTouchEnd(e) {
  if (this.data.draggingPiece === null) return;
  
  const pieceId = this.data.draggingPiece;
  const pieceIndex = this.data.puzzlePieces.findIndex(piece => piece.id === pieceId);
  
  if (pieceIndex !== -1) {
    const piece = this.data.puzzlePieces[pieceIndex];
    const pieceCenter = {
      x: piece.position.x + 50, // 拼图块中心点
      y: piece.position.y + 50
    };
    
    // 检查是否放在了槽位上
    let targetSlot = null;
    let targetSlotIndex = -1;
    
    this.data.puzzleSlots.forEach((slot, slotIndex) => {
      if (!slot.filled) {
        const slotCenter = {
          x: 10 + slot.position.x + 50, // 拼图槽位中心点 (加10是容器padding)
          y: 390 + slot.position.y + 50 // 390是槽位区域的顶部位置
        };
        
        // 计算距离
        const distance = Math.sqrt(
          Math.pow(pieceCenter.x - slotCenter.x, 2) + 
          Math.pow(pieceCenter.y - slotCenter.y, 2)
        );
        
        // 如果距离小于50px视为放入槽位
        if (distance < 50) {
          targetSlot = slot;
          targetSlotIndex = slotIndex;
        }
      }
    });
    
    if (targetSlot && pieceId === targetSlot.id) {
      // 拼图放入正确槽位
      this.setData({
        [`puzzlePieces[${pieceIndex}].inSlot`]: true,
        [`puzzlePieces[${pieceIndex}].slotId`]: targetSlot.id,
        [`puzzleSlots[${targetSlotIndex}].filled`]: true,
        [`puzzleSlots[${targetSlotIndex}].pieceId`]: pieceId
      });
      
      // 检查是否完成
      this.checkPuzzleComplete();
    }
    
    // 重置拖动状态
    this.setData({
      draggingPiece: null,
      [`puzzlePieces[${pieceIndex}].dragging`]: false
    });
  }
}

// 检查拼图是否完成
function checkPuzzleComplete() {
  const isComplete = this.data.puzzleSlots.every(slot => 
    slot.filled && slot.pieceId === slot.id
  );
  
  if (isComplete) {
    this.setData({
      puzzleComplete: true
    });
    
    // 拼图完成后，延迟一段时间显示完成信息，然后进入下一步
    setTimeout(() => {
      this.setData({
        puzzleComplete: false
      });
      this.nextChallengeStep();
    }, 2000);
  }
}

// 处理拼图碎片移动
function onPuzzlePieceMove(e) {
  const piece = e.currentTarget.dataset.piece;
  const pieceIndex = e.currentTarget.dataset.index;
  const x = e.detail.x;
  const y = e.detail.y;
  
  // 更新拼图碎片位置
  const puzzlePieces = getData('puzzlePieces');
  puzzlePieces[pieceIndex].x = x;
  puzzlePieces[pieceIndex].y = y;
  
  setData({
    puzzlePieces: puzzlePieces
  });
}

// 处理拼图碎片拖动结束
function onPuzzlePieceEnd(e) {
  const pieceIndex = e.currentTarget.dataset.index;
  const piece = getData('puzzlePieces')[pieceIndex];
  const slots = getData('puzzleSlots');
  
  // 获取拼图碎片的位置和大小
  const query = wx.createSelectorQuery();
  query.selectAll('.puzzle-slot').boundingClientRect();
  query.selectAll('.puzzle-piece-movable').boundingClientRect();
  query.exec(function(res) {
    const slotRects = res[0];
    const pieceRects = res[1];
    
    if (!slotRects || !pieceRects || pieceIndex >= pieceRects.length) {
      console.error('获取元素位置失败', res);
      return;
    }
    
    const pieceRect = pieceRects[pieceIndex];
    
    // 计算拼图碎片中心点
    const pieceCenterX = pieceRect.left + pieceRect.width / 2;
    const pieceCenterY = pieceRect.top + pieceRect.height / 2;
    
    // 查找最近的槽位
    let closestSlot = null;
    let minDistance = Infinity;
    
    for (let i = 0; i < slotRects.length; i++) {
      const slotRect = slotRects[i];
      if (slots[i].filled) continue; // 跳过已填充的槽位
      
      // 计算槽位中心点
      const slotCenterX = slotRect.left + slotRect.width / 2;
      const slotCenterY = slotRect.top + slotRect.height / 2;
      
      // 计算距离
      const distance = Math.sqrt(
        Math.pow(pieceCenterX - slotCenterX, 2) + 
        Math.pow(pieceCenterY - slotCenterY, 2)
      );
      
      // 更新最近的槽位
      if (distance < minDistance) {
        minDistance = distance;
        closestSlot = {
          index: i,
          rect: slotRect
        };
      }
    }
    
    // 处理放置逻辑
    if (closestSlot && minDistance < 50) { // 50px阈值
      // 获取当前数据
      const puzzlePieces = getData('puzzlePieces');
      const puzzleSlots = getData('puzzleSlots');
      
      // 更新槽位状态
      puzzleSlots[closestSlot.index].filled = true;
      puzzleSlots[closestSlot.index].pieceId = piece.id;
      
      // 更新碎片状态
      puzzlePieces[pieceIndex].inSlot = true;
      puzzlePieces[pieceIndex].slotId = closestSlot.index;
      puzzlePieces[pieceIndex].x = 0;
      puzzlePieces[pieceIndex].y = 0;
      
      // 更新数据
      setData({
        puzzleSlots: puzzleSlots,
        puzzlePieces: puzzlePieces
      });
      
      // 播放放置音效
      playAudioEffect('drop');
      
      // 检查是否完成拼图
      checkPuzzleCompletion();
    } else {
      // 如果没有放入槽位，重置位置
      const puzzlePieces = getData('puzzlePieces');
      puzzlePieces[pieceIndex].x = 0;
      puzzlePieces[pieceIndex].y = 0;
      
      setData({
        puzzlePieces: puzzlePieces
      });
    }
  });
}

// 播放音效
function playAudioEffect(type) {
  const audioContext = wx.createInnerAudioContext();
  
  switch (type) {
    case 'drop':
      audioContext.src = '/resources/audio/drop.mp3';
      break;
    case 'complete':
      audioContext.src = '/resources/audio/complete.mp3';
      break;
    default:
      audioContext.src = '/resources/audio/click.mp3';
  }
  
  audioContext.play();
}

// 检查拼图是否完成
function checkPuzzleCompletion() {
  const slots = getData('puzzleSlots');
  const pieces = getData('puzzlePieces');
  
  // 检查所有槽位是否都已填充
  const allFilled = slots.every(slot => slot.filled);
  
  if (allFilled) {
    // 检查拼图是否正确
    const correct = slots.every((slot, index) => {
      const pieceInSlot = pieces.find(p => p.slotId === slot.id);
      return pieceInSlot && pieceInSlot.originalPosition === index;
    });
    
    if (correct) {
      // 拼图完成
      playAudioEffect('complete');
      setData({
        puzzleCompleted: true
      });
      
      // 3秒后进入结果页
      setTimeout(() => {
        nextChallengeStep();
      }, 3000);
    }
  }
}

// 允许从槽位中移除拼图碎片
function removePieceFromSlot(e) {
  const slotIndex = e.currentTarget.dataset.index;
  const slots = getData('puzzleSlots');
  const pieces = getData('puzzlePieces');
  
  if (!slots[slotIndex].filled) return;
  
  const pieceId = slots[slotIndex].pieceId;
  const pieceIndex = pieces.findIndex(p => p.id === pieceId);
  
  if (pieceIndex === -1) return;
  
  // 更新槽位状态
  slots[slotIndex].filled = false;
  slots[slotIndex].pieceId = null;
  
  // 更新碎片状态
  pieces[pieceIndex].inSlot = false;
  pieces[pieceIndex].slotId = null;
  
  setData({
    puzzleSlots: slots,
    puzzlePieces: pieces
  });
}

function initMemoryGame() {
  const emojis = ['🏠', '🌳', '🚗', '🚲', '🏛️', '🏰', '🌉', '🏯'];
  const duplicatedEmojis = [...emojis, ...emojis];
  const shuffledEmojis = shuffleArray(duplicatedEmojis);
  
  return {
    cards: shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false
    })),
    instruction: "找到所有匹配的卡片对！",
    flippedCards: [],
    matchedPairs: 0,
    moves: 0
  };
}

// 洗牌算法
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 生成1月1日的单个城市数据用于测试
function generateJan1stCity(year = 2025) {
  // 获取冬季样式
  const seasonStyle = getSeasonStyle(1);

  // 生成1月1日的城市数据
  return {
    id: 1,
    name: "哈尔滨",
    nameEn: "Harbin",
    iconUrl: "https://img1.baidu.com/it/u=2878239755,1102967135&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333",
    unlocked: true,
    unlockDate: "1月1日",
    daysToUnlock: 0,
    month: 1,
    day: 1,
    year: year,
    season: seasonStyle.season,
    seasonBgColor: "#E3F2FD", // 淡蓝色背景，更符合冬季雪景
    seasonEmoji: "❄️",
    // 地理位置相关信息
    longitude: "E 126°38′",
    latitude: "N 45°45′",
    country: "中国",
    province: "黑龙江省",
    // 城市详情信息
    location: "中国黑龙江省哈尔滨市，位于松花江南岸，是黑龙江省的省会城市，被誉为中国最美冰雪之城。",
    population: "哈尔滨市总人口约950万，其中市区人口约550万。是黑龙江省第一大城市，也是中国东北地区重要的中心城市之一。",
    region: "中国黑龙江省，隶属于中华人民共和国东北地区。黑龙江省位于中国最北端，与俄罗斯接壤，是中国纬度最高的省份。",
    calendar: "哈尔滨使用公历，同时也遵循中国传统农历。每年1月5日前后举办的哈尔滨国际冰雪节，是世界四大冰雪节之一，已有数十年历史。",
    dayMood: "1月1日的哈尔滨，银装素裹，白雪皑皑。气温约为零下20℃，是典型的寒冷干燥天气。松花江已经结冰，冰面厚度可达1米，冰雪在阳光下闪闪发光，整座城市沉浸在冰雪的童话世界中。",
    nature: "哈尔滨地处松嫩平原，地势平坦开阔。松花江穿城而过，形成哈尔滨的重要水系。植被以温带针阔混交林为主，野生动物种类丰富。冬季积雪期长，为当地特有的冰雪景观提供了自然条件。",
    history: "哈尔滨历史可追溯至金代，古称'阿勒锦'。19世纪末因中东铁路建设而快速发展，形成独特的中俄文化交融特色。曾是远东最大的侨民城市，有'东方小巴黎'、'东方莫斯科'的美誉。现已成为中国重要的工业基地和文化教育中心。",
    culture: "哈尔滨文化融合了中国、俄罗斯等多国元素，形成独特的'哈尔滨风情'。建筑风格以欧式建筑为特色，如圣索菲亚教堂。美食文化丰富，有红肠、锅包肉等特色菜肴。冰雪文化突出，每年举办国际冰雪节，吸引世界各地游客。历史上著名人物包括音乐家阿炳、科学家郭永怀等。",
    challenge: {
      type: ['quiz', 'memory'][Math.floor(Math.random() * 2)], // 挑战类型，移除了拼图挑战
      description: `完成这个挑战来解锁${cityName}的所有信息！` // 挑战描述
    }
  };
}

// 生成通用测试城市数据
function generateTestCity(id, name, bgColor, emoji, location) {
  // 生成随机经纬度
  const randomCoord = generateRandomCoordinates();
  const [latitude, longitude] = randomCoord.split(', ');
  
  // 生成英文名称
  const cityEnglishNames = {
    "昆明": "Kunming",
    "北戴河": "Beidaihe",
    "南京": "Nanjing",
    "广州": "Guangzhou",
    "成都": "Chengdu",
    "西安": "Xi'an",
    "拉萨": "Lhasa",
    "乌鲁木齐": "Urumqi",
    "三亚": "Sanya"
  };
  
  return {
    id: id,
    name: name,
    nameEn: cityEnglishNames[name] || `City-${id}`,
    iconUrl: `https://picsum.photos/id/${id * 10}/500/333`,
    unlocked: true,
    unlockDate: `${id}月${id}日`,
    daysToUnlock: 0,
    month: id,
    day: id,
    year: 2025,
    season: ["winter", "spring", "summer", "autumn"][Math.floor((id - 1) / 3)],
    seasonBgColor: bgColor,
    seasonEmoji: emoji,
    // 地理位置相关信息
    longitude: longitude,
    latitude: latitude,
    country: "中国",
    province: getProvinceByName(name),
    // 城市详情信息
    location: location,
    population: `${name}市总人口约${Math.floor(Math.random() * 500 + 300)}万，是当地重要的城市中心。`,
    region: `中国${["东北", "华北", "华东", "华南", "西南", "西北", "中部"][Math.floor(Math.random() * 7)]}地区，是区域内的重要城市。`,
    calendar: `${name}遵循公历与中国传统农历，有多个传统节日庆典。`,
    dayMood: `${id}月${id}日的${name}，${["阳光明媚，春风和煦", "细雨绵绵，清新怡人", "骄阳似火，蝉鸣阵阵", "秋高气爽，落叶纷飞", "寒风凛冽，白雪皑皑"][Math.floor(Math.random() * 5)]}，当地居民心情愉悦，城市充满活力。`,
    nature: `${name}地形以${["平原", "丘陵", "山地", "盆地", "高原"][Math.floor(Math.random() * 5)]}为主，${["河流纵横", "湖泊众多", "森林覆盖率高", "草原广袤", "海岸线蜿蜒"][Math.floor(Math.random() * 5)]}。动植物资源丰富，生态环境良好。`,
    history: `${name}有着悠久的历史，可追溯至${["唐代", "宋代", "元代", "明代", "清代"][Math.floor(Math.random() * 5)]}。历经多次重要历史变革，形成了独特的城市风貌和文化底蕴。现已发展成为区域内重要的经济文化中心。`,
    culture: `${name}文化特色鲜明，当地以${["传统戏曲", "民间工艺", "地方美食", "传统建筑", "民俗节日"][Math.floor(Math.random() * 5)]}而闻名。节日庆典丰富多彩，美食文化独具特色。历史上出现过多位杰出人物，对当地文化发展有重要贡献。`,
    challenge: {
      type: ['quiz', 'puzzle', 'memory'][Math.floor(Math.random() * 3)], // 挑战类型，包括拼图挑战
      description: `完成这个挑战来解锁${name}的所有信息！` // 挑战描述
    }
  };
}

// 生成随机经纬度
function generateRandomCoordinates() {
  const latitude = Math.floor(Math.random() * 45) + 18; // 18-63度
  const longitude = Math.floor(Math.random() * 80) + 75; // 75-155度
  const latMinutes = Math.floor(Math.random() * 60);
  const longMinutes = Math.floor(Math.random() * 60);
  return `N ${latitude}°${latMinutes}′, E ${longitude}°${longMinutes}′`;
}

// 根据城市名获取省份
function getProvinceByName(cityName) {
  const cityProvinceMap = {
    "昆明": "云南省",
    "北戴河": "河北省",
    "南京": "江苏省",
    "广州": "广东省",
    "成都": "四川省",
    "西安": "陕西省",
    "拉萨": "西藏自治区",
    "乌鲁木齐": "新疆维吾尔自治区",
    "三亚": "海南省"
  };
  
  return cityProvinceMap[cityName] || "未知省份";
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    loadingProgress: 0, // 确保是数字类型
    showCityDetail: false,
    showCityMuseum: false,
    showChallenge: false,
    showResult: false,
    selectedCity: null,
    scenicImages: [],
    
    // 时间相关
    years: [],
    months: [],
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    currentMonthName: "",
    yearIndex: 0,
    monthIndex: 0,
    
    // 城市展示相关
    allCities: [],
    displayedCities: [],
    citiesPerPage: 9,
    currentPage: 1,
    totalPages: 1,
    unlockedCitiesCount: 0,
    
    // 挑战相关
    challengeType: '',
    singleQuestion: {
      question: '',
      options: [],
      selectedOption: '',
      correctOption: ''
    },
    multiQuestion: {
      question: '',
      options: [],
      selectedOptions: [false, false, false, false],
      correctOptions: [false, false, false, false]
    },
    puzzlePieces: [],
    selectedPieceIndex: -1,
    showPuzzleNumbers: true,
    puzzleImageUrl: '',
    isChallengeFirstTime: true,
    earnedTrees: 0,
    completedChallenges: [],
    challengeStep: 1,
    timeSequenceTrees: 0 // TimeSequence获得的小树数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('页面加载开始');
    
    try {
      // 获取当前日期信息
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      // 获取TimeSequence获得的小树数量
      const app = getApp();
      let timeSequenceTrees = 0;
      
      if (app && app.globalData && typeof app.globalData.timeSequenceTrees !== 'undefined') {
        timeSequenceTrees = app.globalData.timeSequenceTrees;
        console.log('从全局数据获取小树数量:', timeSequenceTrees);
      } else {
        // 如果全局数据不存在，尝试从本地存储获取
        timeSequenceTrees = wx.getStorageSync('timeSequenceTrees') || 0;
        console.log('从本地存储获取小树数量:', timeSequenceTrees);
      }
      
      // 初始化年份选项（前2年和后2年）
      const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
      
      // 初始化月份选项
      const months = [];
      const monthNames = [];
      for (let i = 1; i <= 12; i++) {
        months.push(i);
        monthNames.push(`${i}月`);
      }
      
      // 设置初始数据
      this.setData({
        isLoading: true, // 默认显示加载中
        loadingProgress: 0, // 初始进度为0
        
        years: years,
        yearIndex: 2, // 默认选择当前年份（索引2）
        currentYear: currentYear,
        currentMonth: currentMonth,
        months: months, // 确保months数组存在并正确初始化
        monthNames: monthNames,
        currentMonthName: `${currentMonth}月`,
        monthIndex: currentMonth - 1,
        
        // 设置默认每页显示的城市数量
        citiesPerPage: 9,
        
        // 加载已完成的挑战记录
        completedChallenges: (() => {
          let challenges = wx.getStorageSync('completed_challenges');
          if (!Array.isArray(challenges)) {
            console.error('onLoad: 从存储加载的completedChallenges不是数组，重置为空数组');
            challenges = [];
            // 重置存储中的数据
            wx.setStorageSync('completed_challenges', []);
          }
          return challenges;
        })(),
        
        // 设置小树数量
        timeSequenceTrees: timeSequenceTrees,
        
        // 预设默认拼图图片
        puzzleImageUrl: "https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg"
      });
      
      console.log('初始数据设置完成');
      
      // 初始化轮播图片
      this.initScenicImages();
      
      // 加载城市数据
      this.loadCitiesData();
      
      console.log('页面加载完成');
    } catch (error) {
      console.error('页面加载出错:', error);
      
      // 显示错误提示
      wx.showToast({
        title: '页面加载失败，请重试',
        icon: 'none',
        duration: 3000
      });
    }
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取TimeSequence获得的小树数量
    const app = getApp();
    if (app.globalData && app.globalData.timeSequenceTrees !== undefined) {
      this.setData({
        timeSequenceTrees: app.globalData.timeSequenceTrees
      });
    }
  },
  
  /**
   * 初始化页面数据
   */
  initPageData: function() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // 准备年份选项
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(i);
    }
    
    // 准备月份选项
    const months = [];
    const monthNames = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
      monthNames.push(`${i}月`);
    }
    
    // 更新数据
    this.setData({
      years: years,
      yearIndex: 2, // 默认选中当前年
      currentYear: currentYear,
      
      months: months,
      monthNames: monthNames,
      monthIndex: currentMonth - 1,
      currentMonth: currentMonth,
      currentMonthName: `${currentMonth}月`
    });
    
    // 获取美景轮播图数据
    this.fetchScenicImages();
    
    // 预设默认拼图图片
    this.setData({
      puzzleImageUrl: "https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg"
    });
    
    // 使用月份所有日期的城市数据
    const cities = generateCities(this.data.currentYear, this.data.currentMonth);
    this.processCitiesData(cities);
    
    // 模拟加载进度
    this.simulateLoading();
  },
  
  /**
   * 通过城市ID从足迹打开城市详情
   */
  openCityFromFootprint: function(cityId) {
    // 在所有城市中找到对应ID的城市
    const allCities = this.data.allCities || [];
    const targetCity = allCities.find(city => city.id == cityId);
    
    if (targetCity) {
      // 找到城市，显示详情
      this.setData({
        showCityDetail: true,
        selectedCity: targetCity,
        showCityMuseum: false // 确保显示城市详情而非博物馆
      });
    } else {
      // 未找到城市，显示提示
      wx.showToast({
        title: '未找到此城市记录',
        icon: 'none',
        duration: 2000
      });
    }
  },
  
  /**
   * 模拟加载过程
   */
  simulateLoading: function() {
    console.log('开始模拟加载流程');
    
    // 重置加载状态
    this.setData({
      isLoading: true,
      loadingProgress: 0
    });
    
    // 使用固定的进度增量和间隔时间，确保进度显示正常
    let progress = 0;
    let progressStep = 10; // 每次增加10%
    
    const timer = setInterval(() => {
      progress += progressStep;
      
      // 输出调试信息
      console.log('当前加载进度:', progress);
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        
        console.log('加载完成，准备显示页面');
        
        // 加载完成后显示页面
        setTimeout(() => {
          this.setData({
            isLoading: false
          });
          console.log('页面已显示');
        }, 500);
      }
      
      this.setData({
        loadingProgress: progress
      });
    }, 200); // 每200ms更新一次进度
  },
  
  // 获取美景轮播图数据
  fetchScenicImages: function() {
    // TODO: 实际项目中使用API获取轮播图数据
    // wx.request({
    //   url: 'https://api.example.com/scenic-images',
    //   success: (res) => {
    //     if (res.data && res.data.images && res.data.images.length > 0) {
    //       this.setData({
    //         scenicImages: res.data.images
    //       });
    //     }
    //   },
    //   fail: (err) => {
    //     console.error('获取轮播图数据失败', err);
    //     // 使用本地模拟数据作为备选
    //     this.setData({
    //       scenicImages: this.getMockScenicImages()
    //     });
    //   }
    // });
    
    // 暂时使用模拟数据
    setTimeout(() => {
      this.setData({
        scenicImages: this.getMockScenicImages()
      });
    }, 500);
  },
  
  // 获取模拟的轮播图数据
  getMockScenicImages: function() {
    return [
      {
        imgUrl: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "一月·雪后初霁的北方山脉"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "二月·早春江南的细雨绵绵"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "三月·山野间绽放的春日花朵"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1513125514274-36a1cd782511?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "四月·樱花飞舞的湖畔小径"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1560277143-d8f3d2b79e1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "五月·初夏时节的青翠山林"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "六月·夏至日落的金色田野"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1536048810607-3dc7f86981cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "七月·荷花盛开的宁静湖泊"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1534570122623-99e8378a9aa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "八月·夏末山间的清凉溪流"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1507369512168-9b7de0c92c34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "九月·稻田丰收的金黄季节"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1508913863728-c7b7c3840870?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "十月·秋叶缤纷的山林小道"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "十一月·晚秋雾霭中的湖光山色"
      },
      {
        imgUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        caption: "十二月·冬日雪景中的松柏常青"
      }
    ];
  },
  
  // 处理城市数据
  processCitiesData: function(cities) {
    const totalPages = Math.ceil(cities.length / this.data.citiesPerPage);
    
    // 计算已解锁城市数量 - 测试模式下全部解锁
    const unlockedCount = cities.length; // 所有城市都已解锁
    
    this.setData({
      allCities: cities,
      totalPages: Math.max(1, totalPages),
      currentPage: 1, // 重置为第一页
      unlockedCitiesCount: unlockedCount,
      isLoading: false
    });
    
    this.updateDisplayedCities();
  },
  
  // 更新当前页显示的城市
  updateDisplayedCities: function() {
    const { allCities, currentPage, citiesPerPage } = this.data;
    const startIndex = (currentPage - 1) * citiesPerPage;
    const endIndex = startIndex + citiesPerPage;
    const displayedCities = allCities.slice(startIndex, endIndex);
    
    this.setData({
      displayedCities: displayedCities
    });
  },
  
  // 年份切换
  onYearChange: function(e) {
    const yearIndex = e.detail.value;
    const currentYear = this.data.years[yearIndex];
    
    this.setData({
      yearIndex: yearIndex,
      currentYear: currentYear,
      isLoading: true,
      loadingProgress: 0
    });
    
    // 先显示加载中状态
    setTimeout(() => {
      // 重新生成当前年月的城市数据，确保应用正确的季节样式
      const cities = generateCities(currentYear, this.data.currentMonth);
      this.processCitiesData(cities);
      
      // 模拟加载进度
      this.simulateLoading();
    }, 300);
  },
  
  // 月份切换
  onMonthChange: function(e) {
    const monthIndex = e.detail.value;
    // 确保months数组存在
    if (!this.data.months || this.data.months.length === 0) {
      // 如果months数组不存在，重新创建
      const months = [];
      for (let i = 1; i <= 12; i++) {
        months.push(i);
      }
      this.setData({
        months: months
      });
    }
    
    const currentMonth = this.data.months[monthIndex];
    const currentMonthName = this.data.monthNames[monthIndex];
    
    console.log('切换到月份:', currentMonth, currentMonthName);
    
    this.setData({
      monthIndex: monthIndex,
      currentMonth: currentMonth,
      currentMonthName: currentMonthName,
      isLoading: true,
      loadingProgress: 0
    });
    
    // 先显示加载中状态
    setTimeout(() => {
      // 重新生成当前月份的城市数据，确保应用正确的季节样式
      const cities = generateCities(this.data.currentYear, currentMonth);
      this.processCitiesData(cities);
      
      // 模拟加载进度
      this.simulateLoading();
    }, 300);
  },
  
  // 翻页操作
  onPrevPage: function() {
    if (this.data.currentPage > 1) {
      this.setData({
        currentPage: this.data.currentPage - 1
      });
      this.updateDisplayedCities();
    }
  },
  
  onNextPage: function() {
    if (this.data.currentPage < this.data.totalPages) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.updateDisplayedCities();
    }
  },
  
  // 城市点击
  onCityTap: function(e) {
    const city = e.currentTarget.dataset.city;
    
    if (city.unlocked) {
      this.setData({
        showCityDetail: true,
        selectedCity: city,
        showCityMuseum: false // Ensure museum view is hidden initially
      });
    } else {
      wx.showToast({
        title: `还有${city.daysToUnlock}天解锁`,
        icon: 'none'
      });
    }
  },
  
  // 关闭城市详情
  onCloseModal: function() {
    this.setData({
      showCityDetail: false
    });
  },
  
  // 开始挑战 - 这是旧的函数名，可能造成冲突
  onStartChallenge: function() {
    console.log('旧的onStartChallenge函数被调用 - 这可能导致冲突');
    const { selectedCity } = this.data;
    const challengeType = selectedCity.challenge.type;
    
    let gameData = {};
    switch (challengeType) {
      case 'quiz':
        gameData = initQuizGame();
        this.setData({
          quizGame: gameData,
          currentQuestion: gameData.questions[0]
        });
        break;
        break;
      case 'memory':
        gameData = initMemoryGame();
        this.setData({
          memoryGame: gameData,
          memoryInstruction: gameData.instruction,
          memoryCards: gameData.cards
        });
        break;
    }
    
    this.setData({
      showChallenge: true,
      challengeType: challengeType,
      challengeProgress: 0,
      challengeProgressText: '0%'
    });
    
    // 测试模式：自动完成挑战，延迟2秒以便看到界面
    setTimeout(() => {
      this.completeChallenge();
    }, 2000);
  },
  
  // 关闭挑战 - 旧的函数名
  onCloseChallenge: function() {
    console.log('旧的onCloseChallenge函数被调用 - 可能导致冲突');
    this.setData({
      showChallenge: false
    });
  },
  
  // 问答游戏 - 选择答案
  onSelectAnswer: function(e) {
    const answer = e.currentTarget.dataset.answer;
    const { quizGame, currentQuestion } = this.data;
    
    if (answer === currentQuestion.correctAnswer) {
      quizGame.score++;
    }
    
    quizGame.currentQuestionIndex++;
    
    // 更新进度
    const progress = Math.floor((quizGame.currentQuestionIndex / quizGame.questions.length) * 100);
    
    if (quizGame.currentQuestionIndex < quizGame.questions.length) {
      this.setData({
        quizGame: quizGame,
        currentQuestion: quizGame.questions[quizGame.currentQuestionIndex],
        challengeProgress: progress,
        challengeProgressText: `${progress}%`
      });
    } else {
      // 游戏完成
      this.setData({
        challengeProgress: 100,
        challengeProgressText: '100%'
      });
      
      setTimeout(() => {
        this.completeChallenge();
      }, 1000);
    }
  },
  
  // 拼图游戏 - 选择拼图片段
  onSelectPuzzlePiece: function(e) {
    const index = e.currentTarget.dataset.index;
    const { puzzleGame, puzzlePieces } = this.data;
    
    // 如果没有选中的片段，则选中当前片段
    if (!puzzlePieces.find(p => p.selected)) {
      puzzlePieces[index].selected = true;
      this.setData({
        puzzlePieces: puzzlePieces
      });
    } else {
      // 如果已有选中的片段，则交换位置
      const selectedIndex = puzzlePieces.findIndex(p => p.selected);
      
      if (selectedIndex !== index) {
        [puzzlePieces[selectedIndex].currentPosition, puzzlePieces[index].currentPosition] = 
        [puzzlePieces[index].currentPosition, puzzlePieces[selectedIndex].currentPosition];
        
        puzzlePieces[selectedIndex].selected = false;
        puzzleGame.moves++;
        
        // 检查是否完成
        const isComplete = puzzlePieces.every(p => p.currentPosition === p.correctPosition);
        puzzleGame.isComplete = isComplete;
        
        // 更新进度
        let progress = Math.min(Math.floor((puzzleGame.moves / 15) * 100), 100);
        if (isComplete) progress = 100;
        
        this.setData({
          puzzlePieces: puzzlePieces,
          puzzleGame: puzzleGame,
          challengeProgress: progress,
          challengeProgressText: isComplete ? '完成!' : `${progress}%`
        });
        
        if (isComplete) {
          setTimeout(() => {
            this.completeChallenge();
          }, 1000);
        }
      } else {
        // 点击已选中的片段，取消选中
        puzzlePieces[index].selected = false;
        this.setData({
          puzzlePieces: puzzlePieces
        });
      }
    }
  },
  
  // 记忆游戏 - 翻牌
  onFlipCard: function(e) {
    const index = e.currentTarget.dataset.index;
    const { memoryGame, memoryCards } = this.data;
    
    // 如果已匹配或已翻开，则忽略
    if (memoryCards[index].matched || memoryCards[index].flipped) {
      return;
    }
    
    // 如果已有两张卡片翻开，则忽略
    if (memoryGame.flippedCards.length >= 2) {
      return;
    }
    
    // 翻开卡片
    memoryCards[index].flipped = true;
    memoryGame.flippedCards.push(index);
    
    this.setData({
      memoryCards: memoryCards,
      memoryGame: memoryGame
    });
    
    // 如果翻开了两张卡片，检查是否匹配
    if (memoryGame.flippedCards.length === 2) {
      memoryGame.moves++;
      
      const [firstIndex, secondIndex] = memoryGame.flippedCards;
      
      if (memoryCards[firstIndex].emoji === memoryCards[secondIndex].emoji) {
        // 匹配成功
        memoryCards[firstIndex].matched = true;
        memoryCards[secondIndex].matched = true;
        memoryGame.matchedPairs++;
        memoryGame.flippedCards = [];
        
        // 更新进度
        const progress = Math.floor((memoryGame.matchedPairs / 8) * 100);
        
        this.setData({
          memoryCards: memoryCards,
          memoryGame: memoryGame,
          challengeProgress: progress,
          challengeProgressText: `${progress}%`
        });
        
        // 检查是否所有卡片都匹配
        if (memoryGame.matchedPairs === 8) {
          setTimeout(() => {
            this.completeChallenge();
          }, 1000);
        }
      } else {
        // 不匹配，翻回去
        setTimeout(() => {
          memoryCards[firstIndex].flipped = false;
          memoryCards[secondIndex].flipped = false;
          memoryGame.flippedCards = [];
          
          this.setData({
            memoryCards: memoryCards,
            memoryGame: memoryGame
          });
        }, 1000);
      }
    }
  },
  
  // 完成挑战
  completeChallenge: function() {
    const { selectedCity } = this.data;
    
    this.setData({
      showChallenge: false,
      showCityDetail: false,
      showUnlockAnimation: true,
      newlyUnlockedCity: selectedCity
    });
  },
  
  // 查看新解锁的城市
  onViewUnlockedCity: function() {
    this.setData({
      showUnlockAnimation: false,
      showCityDetail: true,
      selectedCity: this.data.newlyUnlockedCity
    });
  },
  
  // 打印城市信息
  onPrintCity: function() {
    const { selectedCity } = this.data;
    
    if (!selectedCity) {
      wx.showToast({
        title: '无法获取城市信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 获取当前日期
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    // 显示打印预览
    this.setData({
      showPrintPreview: true,
      activePrintTab: 'graphic',
      printDate: formattedDate
    });
    
    // 实际项目中这里可以进行数据准备或API调用准备
    console.log('准备打印城市信息:', selectedCity.name);
    
    // 预加载打印API数据（根据实际需求可以保留或修改）
    // 以下逻辑移除了原来的confirmPrint函数中的内容，API调用部分已经被注释
  },
  
  // 切换打印预览标签
  switchPrintTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activePrintTab: tab
    });
  },
  
  // 关闭打印预览
  closePrintPreview: function() {
    this.setData({
      showPrintPreview: false
    });
  },
  
  // 听取城市介绍
  onListenCity: function() {
    const selectedCity = this.data.selectedCity;
    
    if (!selectedCity) {
      wx.showToast({
        title: '无法获取城市信息',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 如果正在播放，则停止播放
    if (this.data.isPlayingAudio) {
      if (this.data.audioInstance) {
        this.data.audioInstance.stop();
      }
      
      this.setData({
        isPlayingAudio: false,
        audioProgress: 0,
        audioCurrentTime: 0
      });
      
      wx.showToast({
        title: '已停止播放',
        icon: 'none',
        duration: 1500
      });
      
      return;
    }
    
    // 显示加载中提示
    wx.showToast({
      title: '正在加载音频...',
      icon: 'loading',
      duration: 2000
    });
    
    // 预留API调用示例
    // 以下注释代码演示了如何从API获取音频URL
    /*
    wx.request({
      url: this.data.audioApiEndpoint,
      method: 'GET',
      data: {
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        language: 'zh-CN' // 或其他语言选项
      },
      success: (res) => {
        if (res.data && res.data.audioUrl) {
          this.playAudioFromUrl(res.data.audioUrl);
        } else {
          wx.showToast({
            title: '无法获取音频',
            icon: 'none',
            duration: 1500
          });
        }
      },
      fail: (error) => {
        console.error('获取音频失败:', error);
        wx.showToast({
          title: '获取音频失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
    */
    
    // 演示用，模拟从API获取数据后的延迟
    setTimeout(() => {
      // 这里可以替换为真实的音频URL
      const demoAudioUrl = 'https://example.com/audio/city_' + selectedCity.id + '.mp3';
      
      // 播放音频
      this.playAudioFromUrl(demoAudioUrl);
      
      console.log('尝试播放城市语音介绍:', selectedCity.name, demoAudioUrl);
    }, 1500);
  },
  
  // 从URL播放音频
  playAudioFromUrl: function(audioUrl) {
    // 创建音频实例
    const audioContext = wx.createInnerAudioContext();
    audioContext.src = audioUrl;
    audioContext.autoplay = true;
    
    // 设置音频事件
    audioContext.onPlay(() => {
      console.log('音频开始播放');
      this.setData({
        isPlayingAudio: true
      });
      
      wx.showToast({
        title: '正在播放城市介绍',
        icon: 'success',
        duration: 1500
      });
    });
    
    audioContext.onTimeUpdate(() => {
      if (audioContext.duration > 0) {
        this.setData({
          audioDuration: audioContext.duration,
          audioCurrentTime: audioContext.currentTime,
          audioProgress: (audioContext.currentTime / audioContext.duration) * 100
        });
      }
    });
    
    audioContext.onEnded(() => {
      console.log('音频播放结束');
      this.setData({
        isPlayingAudio: false,
        audioProgress: 0,
        audioCurrentTime: 0
      });
    });
    
    audioContext.onError((err) => {
      console.error('音频播放错误:', err);
      wx.showToast({
        title: '音频播放失败',
        icon: 'none',
        duration: 1500
      });
      
      this.setData({
        isPlayingAudio: false
      });
    });
    
    // 保存音频实例
    this.setData({
      audioInstance: audioContext
    });
  },

  // 字体调大功能
  increaseFontSize: function() {
    // 获取当前字体大小设置，如果没有则默认为28rpx（即info-content的默认大小）
    const currentSize = wx.getStorageSync('city_text_font_size') || 28;
    // 字体最大不超过36rpx
    const newSize = Math.min(currentSize + 2, 36);
    wx.setStorageSync('city_text_font_size', newSize);
    this.updateFontSize(newSize);
    wx.showToast({
      title: '字体已放大',
      icon: 'none',
      duration: 1000
    });
  },

  // 字体调小功能
  decreaseFontSize: function() {
    // 获取当前字体大小设置，如果没有则默认为28rpx
    const currentSize = wx.getStorageSync('city_text_font_size') || 28;
    // 字体最小不低于22rpx
    const newSize = Math.max(currentSize - 2, 22);
    wx.setStorageSync('city_text_font_size', newSize);
    this.updateFontSize(newSize);
    wx.showToast({
      title: '字体已缩小',
      icon: 'none',
      duration: 1000
    });
  },

  // 更新页面上的字体大小
  updateFontSize: function(size) {
    // 动态修改CSS变量
    this.setData({
      fontSizeStyle: `--content-font-size: ${size}rpx;`
    });
  },

  // 留下足迹功能
  leaveFootprint: function() {
    // 获取当前城市
    const city = this.data.selectedCity;
    if (!city || !city.id) {
      wx.showToast({
        title: '无法添加足迹',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    // 获取现有足迹列表
    let footprints = wx.getStorageSync('city_footprints') || [];
    const now = new Date();
    const timestamp = now.toISOString();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    // 检查是否已经添加过这个城市的足迹（今天）
    const todayFootprintExists = footprints.some(item => 
      item.cityId === city.id && item.date === formattedDate
    );
    
    if (todayFootprintExists) {
      // 今天已经添加过这个城市的足迹
      wx.showToast({
        title: '今日已打卡',
        icon: 'success',
        duration: 1500,
        mask: true // 防止用户快速多次点击
      });
      return;
    }
    
    // 添加新足迹
    footprints.push({
      cityId: city.id,
      cityName: city.name,
      timestamp: timestamp,
      date: formattedDate
    });
    
    // 保存足迹列表
    wx.setStorageSync('city_footprints', footprints);
    
    // 确保提示显示明确
    wx.showToast({
      title: '走过路过',
      icon: 'success',
      duration: 1500,
      mask: true // 防止用户快速多次点击
    });
  },

  // 添加视频预览功能，连接后端视频接口
  playVideo: function() {
    const city = this.data.selectedCity;
    // 这里是视频接口预留
    if (!city || !city.videoUrl) {
      wx.showToast({
        title: '视频资源准备中',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 如果已有视频资源，可以调用预览
      // 微信小程序视频组件会自动加载
      console.log('播放城市视频:', city.videoUrl);
    }
  },

  // 打开挑战弹窗
  openChallenge: function(e) {
    console.log('openChallenge函数被调用 - 开始');
    
    const { selectedCity } = this.data;
    
    if (!selectedCity) {
      console.log('无法获取城市信息，终止挑战');
      wx.showToast({
        title: '无法获取城市信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    console.log('立即显示挑战弹窗');
    // 立即显示挑战弹窗，避免用户需要多次点击
    this.setData({
      showChallenge: true,
      challengeStep: 1 // 确保从第一步开始
    });
    
    // 检查是否首次挑战
    let completedChallenges = this.data.completedChallenges || [];
    
    // 确保completedChallenges是一个数组
    if (!Array.isArray(completedChallenges)) {
      console.error('completedChallenges不是数组，重置为空数组');
      completedChallenges = [];
    }
    
    const isChallengeFirstTime = !completedChallenges.some(challenge => challenge && challenge.cityId === selectedCity.id);
    console.log('是否首次挑战:', isChallengeFirstTime, '已完成挑战数:', completedChallenges.length);
    
    // 显示加载中弹窗
    wx.showLoading({
      title: '正在准备挑战...',
      mask: true
    });
    
    // 更新首次挑战状态
    this.setData({
      isChallengeFirstTime: isChallengeFirstTime,
      isFirstAttempt: isChallengeFirstTime, // 添加这一行，用于显示
      completedChallenges: completedChallenges
    });
    
    if (!isChallengeFirstTime) {
      // 如果不是首次挑战，显示提示
      wx.showToast({
        title: '重复挑战不会再获得小树奖励哦',
        icon: 'none',
        duration: 2000
      });
    }
    
    console.log('开始加载测试挑战数据');
    // 立即加载测试挑战数据
    this.loadTestChallengeData(selectedCity);
    
    console.log('openChallenge函数执行完毕');
  },
  
  // 加载测试挑战数据（与城市相关的测试数据）
  loadTestChallengeData: function(city) {
    console.log('loadTestChallengeData 开始执行', city?.name);
    
    // 立即隐藏加载提示
    wx.hideLoading();
    
    // 根据城市生成不同的挑战内容
    const cityName = city.name || "这座城市";
    const cityFeature = city.season === 'spring' ? '春季花卉' : 
                      city.season === 'summer' ? '夏季海滩' :
                      city.season === 'autumn' ? '秋季枫叶' : '冬季雪景';
    
    console.log('初始化挑战步骤和内容');
    // 初始化挑战步骤
    this.setData({
      challengeStep: 1,
      
      // 初始化单选题
      singleQuestion: {
        question: `${cityName}的什么特色最引人注目？`,
        options: ["历史文化", cityFeature, "现代建筑", "美食小吃"],
        correctOption: 1,  // 对应cityFeature
        selectedOption: null,
        showResult: false,
        isCorrect: false
      },
      
      // 初始化多选题
      multiQuestion: {
        question: `${cityName}有哪些著名的景点？（多选）`,
        options: ["中央公园", `${cityName}历史博物馆`, `${cityName}滨海大道`, "温泉度假村", `${cityName}古城墙`],
        correctOptions: [false, true, true, false, true],  // 正确答案是选项1、2、4
        selectedOptions: [false, false, false, false, false],
        hasSelected: false,
        showResult: false,
        isCorrect: false
      },
      
      // 初始化拼图
      puzzleImageUrl: city.iconUrl || "https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg",
      puzzleAnswers: [0, 1, 2, 3, 4, 5, 6, 7, 8], // 默认每个碎片的正确位置
      showPuzzleNumbers: true, // 显示拼图编号方便用户识别
      selectedPieceIndex: null,
      puzzleComplete: false,
      puzzleAllPlaced: false
    });
    
    console.log('挑战弹窗已初始化并显示，首次挑战状态:', this.data.isChallengeFirstTime);
  },
  
  // API方法 - 获取拼图图片和答案
  fetchPuzzleImage: function(cityId) {
    // API接口地址
    const apiUrl = 'https://api.example.com/puzzleImages';
    
    // 请求参数
    const params = {
      cityId: cityId,
      size: 9 // 九宫格需要9张图片
    };
    
    // 发起API请求
    wx.request({
      url: apiUrl,
      data: params,
      method: 'GET',
      success: (res) => {
        if (res.data && res.data.success) {
          // 更新拼图图片URL和答案
          this.setData({
            puzzleImageUrl: res.data.imageUrl,
            puzzleAnswers: res.data.puzzleAnswers || [0, 1, 2, 3, 4, 5, 6, 7, 8] // 从API获取答案数组
          });
          
          // 使用API返回的答案重新初始化拼图
          this.initPuzzleGameWithAnswers(res.data.puzzleAnswers);
          
          console.log('成功获取拼图图片和答案:', res.data.imageUrl);
        } else {
          console.error('获取拼图图片失败:', res.data);
          // 使用默认图片和默认答案
          this.setData({
            puzzleImageUrl: this.data.selectedCity?.iconUrl || "https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg"
          });
        }
      },
      fail: (err) => {
        console.error('拼图图片API请求失败:', err);
        // 使用默认图片
        this.setData({
          puzzleImageUrl: this.data.selectedCity?.iconUrl || "https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg"
        });
      }
    });
  },
  
  // 初始化带答案的拼图游戏
  initPuzzleGameWithAnswers: function(answers) {
    // 如果没有提供答案，使用默认顺序
    const puzzleAnswers = answers || [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // 创建拼图槽位数组 - 3x3网格
    const puzzleSlots = Array(9).fill().map((_, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return {
        index: i,
        row: row,
        col: col,
        filled: false,
        pieceIndex: null,
        correct: false
      };
    });
    
    // 创建拼图碎片数组 - 设置后台提供的正确答案
    const puzzlePieces = Array(9).fill().map((_, i) => {
      const originalIndex = puzzleAnswers[i]; // 使用API返回的答案设置正确位置
      const row = Math.floor(originalIndex / 3);
      const col = originalIndex % 3;
      return {
        index: i,
        originalIndex: originalIndex,
        row: row,
        col: col,
        placed: false,
        x: 0,
        y: 0
      };
    });
    
    // 洗牌拼图碎片
    this.shuffleArray(puzzlePieces);
    
    // 设置初始状态
    this.setData({
      puzzleSlots: puzzleSlots,
      puzzlePieces: puzzlePieces,
      selectedPieceIndex: null,
      puzzleComplete: false,
      puzzleAllPlaced: false,
      showPuzzleNumbers: true, // 始终显示编号方便用户
      enableDrag: true
    });
    
    console.log('拼图游戏已使用后台答案初始化，3x3网格创建完成，显示编号:', puzzleAnswers);
  },
  
  // 打乱拼图（确保可解）
  shufflePuzzle: function(pieces) {
    const validMoves = 30; // 执行的有效移动次数
    let emptyIndex = 8; // 空白块的初始位置
    
    for (let i = 0; i < validMoves; i++) {
      // 获取空白块的邻居
      const neighbors = this.getNeighbors(emptyIndex);
      // 随机选择一个邻居
      const randomNeighborIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      // 交换空白块和选中的邻居
      [pieces[emptyIndex], pieces[randomNeighborIndex]] = [pieces[randomNeighborIndex], pieces[emptyIndex]];
      // 更新空白块位置
      emptyIndex = randomNeighborIndex;
    }
    
    // 更新currentIndex
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].currentIndex = i;
    }
  },

  // 获取给定位置的相邻块的索引
  getNeighbors: function(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const neighbors = [];
    
    // 上方块
    if (row > 0) neighbors.push(index - 3);
    // 下方块
    if (row < 2) neighbors.push(index + 3);
    // 左方块
    if (col > 0) neighbors.push(index - 1);
    // 右方块
    if (col < 2) neighbors.push(index + 1);
    
    return neighbors;
  },

  // 关闭挑战弹窗
  closeChallenge: function() {
    this.setData({
      showChallenge: false
    });
    
    // 等待动画结束后重置挑战步骤
    setTimeout(() => {
      this.setData({
        challengeStep: 1,
        'singleQuestion.selectedOption': null,
        'singleQuestion.showResult': false,
        'multiQuestion.hasSelected': false,
        'multiQuestion.selectedOptions': Array(this.data.multiQuestion.options.length).fill(false),
        'multiQuestion.showResult': false
      });
    }, 300);
  },

  // 选择单选题选项
  selectSingleOption: function(e) {
    const selectedIndex = parseInt(e.currentTarget.dataset.index);
    
    // 只选择选项，不立即判断结果
    this.setData({
      'singleQuestion.selectedOption': selectedIndex
    });
  },

  // 提交单选题答案
  submitSingleAnswer: function() {
    const selectedIndex = this.data.singleQuestion.selectedOption;
    const correctOption = this.data.singleQuestion.correctOption;
    const isCorrect = selectedIndex === correctOption;
    
    // 判断结果
    this.setData({
      'singleQuestion.showResult': true,
      'singleQuestion.isCorrect': isCorrect
    });
    
    // 显示简短的回答反馈
    wx.showToast({
      title: isCorrect ? '回答正确！' : '回答错误',
      icon: isCorrect ? 'success' : 'error',
      duration: 1000
    });
  },

  // 选择多选题选项
  selectMultiOption: function(e) {
    const selectedIndex = e.currentTarget.dataset.index;
    const currentValue = this.data.multiQuestion.selectedOptions[selectedIndex];
    
    // 更新选中状态
    const newSelectedOptions = [...this.data.multiQuestion.selectedOptions];
    newSelectedOptions[selectedIndex] = !currentValue;
    
    // 检查是否至少选择了一项
    const hasSelected = newSelectedOptions.some(item => item);
    
    this.setData({
      'multiQuestion.selectedOptions': newSelectedOptions,
      'multiQuestion.hasSelected': hasSelected
    });
  },

  // 提交多选题答案
  submitMultiAnswer: function() {
    // 检查多选题答案是否正确
    let multiCorrect = true;
    const selectedOptions = this.data.multiQuestion.selectedOptions;
    const correctOptions = this.data.multiQuestion.correctOptions;
    
    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedOptions[i] !== correctOptions[i]) {
        multiCorrect = false;
        break;
      }
    }
    
    this.setData({
      'multiQuestion.showResult': true,
      'multiQuestion.isCorrect': multiCorrect
    });
    
    // 显示答题结果提示
    wx.showToast({
      title: multiCorrect ? '回答正确！' : '回答错误',
      icon: multiCorrect ? 'success' : 'error',
      duration: 1500
    });
    
    // 不再自动跳转，让用户点击"下一题"按钮继续
    // setTimeout(() => {
    //   this.nextChallengeStep();
    // }, 2000);
  },

  // 下一步挑战
  nextChallengeStep: function() {
    const currentStep = this.data.challengeStep;
    
    // 在步骤1（单选题）
    if (currentStep === 1) {
      // 如果没有选择或尚未显示结果，不继续
      if (this.data.singleQuestion.selectedOption === null && !this.data.singleQuestion.showResult) {
        wx.showToast({
          title: '请先选择一个选项',
          icon: 'none',
          duration: 1500
        });
        return;
      }
      
      this.setData({
        challengeStep: 2, // 进入多选题
        'singleQuestion.showResult': false // 重置结果显示
      });
    }
    // 在步骤2（多选题）
    else if (currentStep === 2) {
      // 如果没有选择且尚未显示结果，不继续
      if (!this.data.multiQuestion.hasSelected && !this.data.multiQuestion.showResult) {
        wx.showToast({
          title: '请至少选择一个选项',
          icon: 'none',
          duration: 1500
        });
        return;
      }
      
      // 如果是用户手动点击下一题（而不是自动跳转）且尚未显示结果
      if (!this.data.multiQuestion.showResult) {
        this.submitMultiAnswer();
        return;
      }
      
      this.setData({
        challengeStep: 3, // 进入拼图步骤
        'multiQuestion.showResult': false // 重置结果显示
      });
      
      // 初始化简单拼图
      this.initSimplePuzzle();
    }
    // 在步骤3（拼图）
    else if (currentStep === 3) {
      // 验证拼图完成情况
      const isPuzzleComplete = this.checkPuzzleCompletion();
      
      // 无论拼图是否完成，都直接进入结果页
      // 用户通过点击按钮主动选择进入结果页
      this.calculateResults();
      this.setData({
        challengeStep: 4, // 进入结果页
        puzzleComplete: isPuzzleComplete // 记录拼图完成情况
      });
    }
    // 在步骤4（结果页）
    else if (currentStep === 4) {
      this.setData({
        showChallenge: false
        // 移除 showResult: true 以避免重复显示结果
      });
    }
  },

  // 计算结果
  calculateResults: function() {
    let treesEarned = 0;
    
    // 先确保保存当前的首次挑战状态，用于显示结果
    const isFirstChallenge = this.data.isChallengeFirstTime;
    
    // 判断是否为首次挑战，只有首次才能获得小树
    if (isFirstChallenge) {
      // 单选题判断
      const singleCorrect = this.data.singleQuestion.selectedOption === this.data.singleQuestion.correctOption;
      
      // 多选题判断
      let multiCorrect = true;
      const selectedOptions = this.data.multiQuestion.selectedOptions;
      const correctOptions = this.data.multiQuestion.correctOptions;
      
      for (let i = 0; i < selectedOptions.length; i++) {
        if (selectedOptions[i] !== correctOptions[i]) {
          multiCorrect = false;
          break;
        }
      }
      
      // 拼图判断
      const puzzleComplete = this.data.puzzleComplete || false;
      
      // 记录各题目答题情况，用于结果页显示
      const resultDetails = {
        singleCorrect: singleCorrect,
        multiCorrect: multiCorrect,
        puzzleComplete: puzzleComplete
      };
      
      // 根据答题情况计算获得的树木数量
      if (singleCorrect) treesEarned += 1; // 单选题答对得1颗树
      if (multiCorrect) treesEarned += 2; // 多选题答对得2颗树
      
      // 更新本地和全局的树木计数
      if (treesEarned > 0) {
        const app = getApp();
        // 获取当前TimeSequence树木数量
        const currentTimeSequenceTrees = (app.globalData && app.globalData.timeSequenceTrees) || 0;
        const newTimeSequenceTrees = currentTimeSequenceTrees + treesEarned;
        
        if (app.globalData) {
          // 更新TimeSequence树木数量
          app.globalData.timeSequenceTrees = newTimeSequenceTrees;
          // 更新总树木数量
          const lantingTrees = app.globalData.lantingTrees || 0;
          const consumedTrees = app.globalData.consumedTrees || 0;
          app.globalData.treeCount = lantingTrees + newTimeSequenceTrees - consumedTrees;
        }
        
        // 更新本地存储
        wx.setStorageSync('timeSequenceTrees', newTimeSequenceTrees);
        wx.setStorageSync('treeCount', app.globalData.treeCount);
      }
    }
    
    this.setData({
      earnedTrees: treesEarned,
      // 保持原始的首次挑战状态用于结果显示
      isFirstAttempt: isFirstChallenge
    });
    
    // 无论是否获得小树，都记录完成记录
    const selectedCity = this.data.selectedCity;
    
    // 如果是首次挑战，添加到已完成挑战记录
    if (isFirstChallenge) {
      let completedChallenges = this.data.completedChallenges || [];
      
      // 确保completedChallenges是一个数组
      if (!Array.isArray(completedChallenges)) {
        console.error('calculateResults: completedChallenges不是数组，重置为空数组');
        completedChallenges = [];
      }
      
      completedChallenges.push({
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        completedDate: new Date().toISOString(),
        treesEarned: treesEarned
      });
      
      // 保存到本地存储
      wx.setStorageSync('completed_challenges', completedChallenges);
      
      // 更新数据 - 但要在设置完isFirstAttempt后再更新isChallengeFirstTime
      this.setData({
        completedChallenges: completedChallenges,
        // 注意：这里不要急着更新首次挑战的状态
        isChallengeFirstTime: false // 完成后标记为非首次
      });
    }
    
    // 测试模式下的日志输出
    console.log('挑战结果计算完成:', {
      首次挑战: isFirstChallenge,
      树木奖励: treesEarned,
      状态保存用于显示: this.data.isFirstAttempt
    });
  },

  // 关闭结果弹窗
  closeResult: function() {
    this.setData({
      showResult: false
    });
    
    // TODO: 刷新页面显示最新的树木数量
  },

  // 添加一个直接测试函数，用于在控制台调用测试
  testChallenge: function() {
    console.log('直接测试挑战弹窗显示');
    // 简化的测试，只设置显示标志
    this.setData({
      showChallenge: true,
      challengeStep: 1 
    });
    console.log('测试完成，showChallenge=', this.data.showChallenge);
  },
  
  // 打乱数组顺序
  shuffleArray: function(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  
  // 初始化简单拼图
  initSimplePuzzle: function() {
    console.log('开始初始化拼图游戏...');
    
    // 使用默认答案初始化拼图
    const puzzleAnswers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // 创建拼图槽位数组 - 3x3网格
    const puzzleSlots = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      puzzleSlots.push({
        index: i,
        row: row,
        col: col,
        filled: false,
        pieceIndex: null,
        correct: false
      });
    }
    
    // 创建拼图碎片数组
    const puzzlePieces = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      puzzlePieces.push({
        index: i,
        originalIndex: i, // 正确位置
        row: row,
        col: col,
        placed: false,
        x: 0,
        y: 0
      });
    }
    
    // 洗牌拼图碎片 - 保证已经创建了9个碎片
    if (puzzlePieces.length === 9) {
      this.shuffleArray(puzzlePieces);
      console.log('拼图碎片已洗牌:', puzzlePieces);
    } else {
      console.error('拼图碎片数量不正确:', puzzlePieces.length);
    }
    
    // 设置初始状态
    this.setData({
      puzzleSlots: puzzleSlots,
      puzzlePieces: puzzlePieces,
      puzzleAnswers: puzzleAnswers,
      selectedPieceIndex: null,
      puzzleComplete: false,
      puzzleAllPlaced: false,
      showPuzzleNumbers: true,
      // 确保图片URL可用
      puzzleImageUrl: this.data.puzzleImageUrl || this.data.selectedCity?.iconUrl || "https://img.xianjichina.com/editer/20220720/image/1d60e05a779b9dcc3bff1bdf59d5f93d.jpg"
    });
    
    // 确认所有数据都已正确设置
    console.log('拼图槽位数:', this.data.puzzleSlots.length);
    console.log('拼图碎片数:', this.data.puzzlePieces.length);
    console.log('拼图游戏初始化完成');
  },
  
  // 检查拼图是否完成
  checkPuzzleCompletion: function() {
    const puzzleSlots = this.data.puzzleSlots;
    
    // 检查拼图是否完成
    let complete = true;
    let allPlaced = true;
    
    for (let i = 0; i < puzzleSlots.length; i++) {
      // 检查是否所有槽位都已填充
      if (!puzzleSlots[i].filled) {
        allPlaced = false;
      }
      
      // 检查是否所有填充的槽位都正确
      if (!puzzleSlots[i].filled || !puzzleSlots[i].correct) {
        complete = false;
      }
    }
    
    this.setData({
      puzzleComplete: complete,
      puzzleAllPlaced: allPlaced
    });
    
    // 如果拼图完成，显示成功提示
    if (complete) {
      setTimeout(() => {
        wx.showToast({
          title: '拼图完成！',
          icon: 'success',
          duration: 1500
        });
      }, 600);
    }
  },
  
  // 获取拼图碎片的背景位置
  getPiecePosition: function(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    // 返回object-position属性值，使用百分比定位
    return `${col * 50}% ${row * 50}%`;
  },
  
  // 点击拼图碎片
  onPieceTap: function(e) {
    if (this.data.challengeStep !== 3) return; // 只在拼图步骤才响应
    
    const pieceIndex = parseInt(e.currentTarget.dataset.index);
    console.log('点击拼图碎片:', pieceIndex);
    
    if (isNaN(pieceIndex) || pieceIndex < 0 || pieceIndex >= 9) {
      console.error('无效的拼图索引:', pieceIndex, e);
      return;
    }
    
    // 获取当前所有拼图状态
    const puzzlePieces = [...this.data.puzzlePieces];
    
    // 确保拼图数组存在且索引有效
    if (!puzzlePieces || !puzzlePieces[pieceIndex]) {
      console.error('拼图数据异常:', puzzlePieces, pieceIndex);
      return;
    }
    
    // 如果碎片已经放置，则不响应
    if (puzzlePieces[pieceIndex].placed) {
      console.log('碎片已放置，无法点击');
      return;
    }
    
    // 选中碎片 - 无论此前是否已选中都重新选中
    this.setData({
      selectedPieceIndex: pieceIndex
    });
    
    // 提供触感和视觉反馈
    wx.vibrateShort({ type: 'light' });
    
    // 让用户知道下一步该做什么
    wx.showToast({
      title: '请点击空格放置',
      icon: 'none',
      duration: 800
    });
    
    console.log('成功选中碎片:', pieceIndex);
  },
  
  // 点击拼图槽位
  onSlotTap: function(e) {
    if (this.data.challengeStep !== 3) return; // 只在拼图步骤才响应
    
    const slotIndex = parseInt(e.currentTarget.dataset.index);
    const selectedPieceIndex = this.data.selectedPieceIndex;
    
    console.log('点击拼图槽位:', slotIndex, '选中碎片:', selectedPieceIndex);
    
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= 9) {
      console.error('无效的槽位索引:', slotIndex);
      return;
    }
    
    // 获取拼图数据
    const puzzlePieces = [...this.data.puzzlePieces];
    const puzzleSlots = [...this.data.puzzleSlots];
    
    // 确保数据有效
    if (!puzzleSlots[slotIndex]) {
      console.error('槽位数据异常:', slotIndex);
      return;
    }
    
    // 如果槽位有碎片且没有选中的碎片，则取出该碎片
    if (puzzleSlots[slotIndex].filled && selectedPieceIndex === null) {
      const pieceIndex = puzzleSlots[slotIndex].pieceIndex;
      
      if (pieceIndex !== null && pieceIndex >= 0 && pieceIndex < puzzlePieces.length) {
        // 移除槽位中的碎片
        puzzleSlots[slotIndex].filled = false;
        puzzleSlots[slotIndex].pieceIndex = null;
        puzzleSlots[slotIndex].correct = false;
        
        // 更新碎片状态
        puzzlePieces[pieceIndex].placed = false;
        
        this.setData({
          puzzleSlots: puzzleSlots,
          puzzlePieces: puzzlePieces
        });
        
        // 提供触感反馈
        wx.vibrateShort();
        
        console.log('已取出碎片:', pieceIndex, '从槽位:', slotIndex);
        
        // 提示用户该碎片已取出
        wx.showToast({
          title: '已取出图块',
          icon: 'none',
          duration: 800
        });
      } else {
        console.error('无效的碎片索引:', pieceIndex);
      }
      return;
    }
    
    // 如果选中了碎片，将其放入槽位
    if (selectedPieceIndex !== null) {
      // 直接调用放置函数
      console.log('将碎片', selectedPieceIndex, '放入槽位', slotIndex);
      this.placePieceToSlot(selectedPieceIndex, slotIndex);
      
      // 提供触感反馈
      wx.vibrateShort();
      return;
    }
    
    // 如果没有选中碎片，轻微提示用户
    wx.showToast({
      title: '先点选一个图块',
      icon: 'none',
      duration: 600
    });
  },
  
  // 输入拼图编号直接放置
  onPieceNumberInput: function(e) {
    if (this.data.challengeStep !== 3) return; // 只在拼图步骤才响应
    
    const pieceIndex = parseInt(e.currentTarget.dataset.pieceIndex);
    const inputValue = e.detail.value.trim();
    const slotNumber = parseInt(inputValue);
    
    // 检查输入是否有效（1-9之间的数字）
    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 9) {
      return; // 输入不合法，不处理
    }
    
    // 立即放置碎片
    this.placePieceToSlot(pieceIndex, slotNumber - 1);
  },

  // 确认输入拼图编号
  onPieceNumberConfirm: function(e) {
    if (this.data.challengeStep !== 3) return; // 只在拼图步骤才响应
    
    const pieceIndex = parseInt(e.currentTarget.dataset.pieceIndex);
    const inputValue = e.detail.value.trim();
    const slotNumber = parseInt(inputValue);
    
    // 检查输入是否有效（1-9之间的数字）
    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 9) {
      wx.showToast({
        title: '请输入1-9的数字',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 放置碎片到对应位置
    this.placePieceToSlot(pieceIndex, slotNumber - 1);
  },

  // 将碎片放置到指定槽位
  placePieceToSlot: function(pieceIndex, slotIndex) {
    console.log('放置拼图碎片:', pieceIndex, '到槽位:', slotIndex);
    
    try {
      // 如果参数是事件对象，则从事件对象中提取索引
      if (typeof pieceIndex === 'object' && pieceIndex.currentTarget) {
        const event = pieceIndex;
        pieceIndex = parseInt(event.currentTarget.dataset.pieceIndex);
        slotIndex = parseInt(event.currentTarget.dataset.slotIndex);
      }
      
      // 确保索引是有效的数字
      pieceIndex = parseInt(pieceIndex);
      slotIndex = parseInt(slotIndex);
      
      if (isNaN(pieceIndex) || isNaN(slotIndex)) {
        console.error('无效的拼图或槽位索引:', pieceIndex, slotIndex);
        return;
      }
      
      // 获取数据
      const puzzlePieces = [...this.data.puzzlePieces];
      const puzzleSlots = [...this.data.puzzleSlots];
      
      // 确保数组和索引有效
      if (!puzzlePieces[pieceIndex] || !puzzleSlots[slotIndex]) {
        console.error('拼图碎片或槽位不存在:', pieceIndex, slotIndex);
        return;
      }
      
      // 如果该碎片已经放置在其他槽位中，先移除
      for (let i = 0; i < puzzleSlots.length; i++) {
        if (puzzleSlots[i].filled && puzzleSlots[i].pieceIndex === pieceIndex) {
          console.log('从槽位', i, '移除碎片', pieceIndex);
          puzzleSlots[i].filled = false;
          puzzleSlots[i].pieceIndex = null;
          puzzleSlots[i].correct = false;
        }
      }
      
      // 如果目标槽位已经有碎片，先移除
      if (puzzleSlots[slotIndex].filled) {
        const oldPieceIndex = puzzleSlots[slotIndex].pieceIndex;
        if (oldPieceIndex !== null && puzzlePieces[oldPieceIndex]) {
          console.log('从槽位', slotIndex, '移除现有碎片', oldPieceIndex);
          puzzlePieces[oldPieceIndex].placed = false;
        }
      }
      
      // 更新槽位和碎片状态
      puzzleSlots[slotIndex].filled = true;
      puzzleSlots[slotIndex].pieceIndex = pieceIndex;
      puzzlePieces[pieceIndex].placed = true;
      
      // 设置碎片在槽位中的显示方式
      puzzleSlots[slotIndex].row = puzzlePieces[pieceIndex].row;
      puzzleSlots[slotIndex].col = puzzlePieces[pieceIndex].col;
      
      // 检查是否放置正确
      const isCorrect = (pieceIndex === slotIndex); // 简化逻辑：索引相同即为正确位置
      puzzleSlots[slotIndex].correct = isCorrect;
      
      // 更新数据
      this.setData({
        puzzlePieces: puzzlePieces,
        puzzleSlots: puzzleSlots,
        selectedPieceIndex: null // 放置后取消选中状态
      });
      
      // 提供反馈
      wx.vibrateShort({
        type: isCorrect ? 'medium' : 'light'
      });
      
      if (isCorrect) {
        wx.showToast({
          title: '放置正确!',
          icon: 'success',
          duration: 500
        });
      }
      
      // 检查拼图是否完成
      setTimeout(() => {
        this.checkPuzzleCompletion();
      }, 100);
      
    } catch (error) {
      console.error('放置拼图出错:', error);
    }
  },

  // 打开城市博物馆
  openCityMuseum: function() {
    // Note: Button removed from main UI, function remains for potential future use
    // Hide the city detail content and show the museum content
    this.setData({
      showCityMuseum: true
    });
    
    console.log('城市博物馆已打开');
    
    // If needed, we can load dynamic museum content here
    // For example, fetching museum data from an API
  },

  // 拼图移动处理函数
  onPieceMove: function(e) {
    if (this.data.challengeStep !== 3) return;
    
    const pieceIndex = e.currentTarget.dataset.index;
    
    // 更新碎片位置
    const puzzlePieces = [...this.data.puzzlePieces];
    puzzlePieces[pieceIndex].x = e.detail.x;
    puzzlePieces[pieceIndex].y = e.detail.y;
    
    this.setData({
      puzzlePieces: puzzlePieces
    });
  },

  // 拼图移动结束
  onPieceMoveEnd: function(e) {
    if (this.data.challengeStep !== 3) return;
    
    const pieceIndex = e.currentTarget.dataset.index;
    
    // 使用选择器获取所有槽位的位置
    wx.createSelectorQuery()
      .selectAll('.puzzle-slot')
      .boundingClientRect((slots) => {
        if (!slots || slots.length === 0) return;
        
        // 获取移动视图位置
        wx.createSelectorQuery()
          .select(`.puzzle-piece-movable[data-index="${pieceIndex}"]`)
          .boundingClientRect((piece) => {
            if (!piece) return;
            
            // 计算碎片中心点
            const pieceCenterX = piece.left + piece.width / 2;
            const pieceCenterY = piece.top + piece.height / 2;
            
            // 查找最近的槽位
            let closestSlot = -1;
            let minDistance = Number.MAX_VALUE;
            
            slots.forEach((slot, index) => {
              const slotCenterX = slot.left + slot.width / 2;
              const slotCenterY = slot.top + slot.height / 2;
              const distance = Math.sqrt(
                Math.pow(pieceCenterX - slotCenterX, 2) + 
                Math.pow(pieceCenterY - slotCenterY, 2)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                closestSlot = index;
              }
            });
            
            // 如果足够近，放置碎片
            if (closestSlot >= 0 && minDistance < piece.width) {
              // 放置碎片到槽位
              this.placePieceToSlot(pieceIndex, closestSlot);
            } else {
              // 如果没有放置成功，将碎片移回原位
              const puzzlePieces = [...this.data.puzzlePieces];
              puzzlePieces[pieceIndex].x = 0;
              puzzlePieces[pieceIndex].y = 0;
              this.setData({
                puzzlePieces: puzzlePieces
              });
            }
          })
          .exec();
      })
      .exec();
  },

  // 碎片触摸处理（作为点击的备用处理）
  onPieceTapTouch: function(e) {
    if (this.data.challengeStep !== 3) return;
    
    const pieceIndex = parseInt(e.currentTarget.dataset.index);
    console.log('触摸拼图碎片:', pieceIndex);
    
    // 如果不是长按，则直接调用点击处理
    this.onPieceTap(e);
    
    // 阻止冒泡，避免同时触发多个事件
    e.stopPropagation();
  },

  /**
   * 加载城市数据
   */
  loadCitiesData: function() {
    console.log('开始加载城市数据');
    
    try {
      // 总是重新生成当前月份的城市数据，确保更新
      const cities = generateCities(this.data.currentYear, this.data.currentMonth);
      console.log('生成的城市数量:', cities.length);
      console.log('当前月份:', this.data.currentMonth);
      
      // 计算分页信息
      const totalPages = Math.ceil(cities.length / this.data.citiesPerPage);
      console.log('总页数:', totalPages);
      
      // 更新数据
      this.setData({
        allCities: cities,
        totalPages: Math.max(1, totalPages),
        currentPage: 1,
        unlockedCitiesCount: cities.length
      });
      
      // 更新显示的城市
      this.updateDisplayedCities();
      
      console.log('城市数据加载完成');
    } catch (error) {
      console.error('加载城市数据出错:', error);
      // 出错时显示提示
      wx.showToast({
        title: '加载城市数据失败',
        icon: 'none',
        duration: 2000
      });
    }
    
    // 无论是否成功，都启动加载动画
    this.simulateLoading();
  },

  /**
   * 更新当前页显示的城市
   */
  updateDisplayedCities: function() {
    try {
      const { allCities, currentPage, citiesPerPage } = this.data;
      const startIndex = (currentPage - 1) * citiesPerPage;
      const endIndex = startIndex + citiesPerPage;
      
      if (!allCities || !Array.isArray(allCities)) {
        console.error('allCities不是数组或为空:', allCities);
        return;
      }
      
      // 提取当前页的城市
      const displayedCities = allCities.slice(startIndex, endIndex);
      console.log('当前页显示城市数:', displayedCities.length);
      
      // 更新显示的城市
      this.setData({
        displayedCities: displayedCities
      });
    } catch (error) {
      console.error('更新显示城市时出错:', error);
    }
  },

  /**
   * 初始化轮播图片
   */
  initScenicImages: function() {
    console.log('初始化轮播图片');
    // 使用模拟数据
    this.setData({
      scenicImages: this.getMockScenicImages()
    });
  }
}); 
