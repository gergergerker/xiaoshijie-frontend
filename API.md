# 晓时节小程序 API 接口文档

本文档详细说明了晓时节小程序所需的后端API接口规范，供后端开发人员参考实现。

## 接口通用规范

### 基础URL

所有API接口都应以 `/api` 作为前缀。

### 响应格式

所有接口统一返回JSON格式，基本结构如下：

```json
{
  "success": true,         // 表示请求是否成功
  "message": "success",    // 状态消息
  "data": {}               // 返回数据
}
```

### 错误处理

当发生错误时，应返回如下格式：

```json
{
  "success": false,        // 请求失败
  "message": "参数错误",    // 错误信息
  "error_code": 1001       // 错误码
}
```

## 城市卡片接口

### 1. 获取城市卡片列表

**接口描述**：获取城市卡片列表，按月份分组显示，一天更新一个城市

**请求方法**：GET

**接口地址**：`/api/cities`

**请求参数**：
```json
{
  "year": 2023,                  // 年份
  "month": 5,                    // 可选，月份，不传则返回整年
  "page": 1,                     // 页码
  "pageSize": 31                 // 每页数量，默认为31（一个月最多31天）
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "cities": [
      {
        "id": "string",          // 城市ID
        "title": "杭州",          // 城市标题/名称
        "englishName": "Hangzhou", // 英文名称
        "date": "2023-05-01",    // 发布日期，格式：YYYY-MM-DD
        "coverUrl": "string",    // 封面图片URL
        "thumbnailUrl": "string", // 缩略图URL（自动从封面生成，无需单独上传）
        "unlocked": true,        // 是否已解锁
        "collectDate": "string", // 用户收集日期，未收集则为null
        "seasonInfo": {          // 季节信息
          "name": "spring",      // 季节名称：spring, summer, autumn, winter
          "bgColor": "#fff0f5",  // 季节背景色
          "emoji": "🌸"          // 季节对应表情
        }
      }
    ],
    "pagination": {
      "total": 365,              // 总数量
      "current": 1,              // 当前页码
      "pages": 12                // 总页数
    }
  }
}
```

### 2. 获取城市卡片详情

**接口描述**：获取城市卡片详细内容

**请求方法**：GET

**接口地址**：`/api/cities/detail`

**请求参数**：
```json
{
  "cityId": "string"            // 城市ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "string",             // 城市ID
    "title": "杭州",             // 城市标题/名称
    "englishName": "Hangzhou",  // 英文名称
    "date": "2023-05-01",       // 发布日期
    "coverUrl": "string",       // 封面图片URL
    "videoUrl": "string",       // 视频URL，可能为null
    "audioUrl": "string",       // 音频解说URL，可能为null
    "audioDuration": 180,       // 音频时长（秒）
    
    "contentSections": [        // 五个文本内容区块
      {
        "title": "城市简介",      // 区块标题
        "content": "string",     // 区块文本内容
        "imageUrl": "string"     // 对应图片URL
      },
      {
        "title": "历史文化",
        "content": "string",
        "imageUrl": "string"
      },
      {
        "title": "地理位置",
        "content": "string",
        "imageUrl": "string"
      },
      {
        "title": "著名景点",
        "content": "string",
        "imageUrl": "string"
      },
      {
        "title": "美食特产",
        "content": "string",
        "imageUrl": "string"
      }
    ],
    
    "poetry": {                 // 相关诗词
      "title": "钱塘湖春行",     // 诗词标题
      "author": "白居易",        // 作者
      "dynasty": "唐代",         // 朝代
      "content": "孤山寺北贾亭西，水面初平云脚低...", // 内容
      "translation": "string"   // 翻译/注释
    },
    
    "printInfo": {              // 打印页信息
      "illustrationUrl": "string", // 绘图A4页面URL
      "textPage1Url": "string",    // 文字A4页面1 URL
      "textPage2Url": "string"     // 文字A4页面2 URL
    },
    
    "challenges": {             // 挑战题
      "singleChoice": {         // 单选题
        "question": "杭州最著名的景点是？",
        "options": ["西湖", "西塘", "乌镇", "千岛湖"],
        "correctAnswer": 0      // 正确答案索引
      },
      "multipleChoice": {       // 多选题
        "question": "下列哪些是杭州的特产？",
        "options": ["龙井茶", "西湖醋鱼", "东坡肉", "小笼包"],
        "correctAnswers": [0, 1, 2] // 正确答案索引数组
      },
      "puzzle": {               // 拼图挑战
        "imageUrl": "string",   // 完整图片URL
        "difficulty": 9         // 难度（拼图块数）
      }
    },
    
    "unlockStatus": {           // 解锁状态
      "unlocked": true,         // 是否已解锁
      "unlockDate": "string",   // 解锁日期
      "collectDate": "string"   // 收集日期，未收集则为null
    },
    
    "relatedCities": [          // 相关城市推荐
      {
        "id": "string",
        "title": "苏州",
        "thumbnailUrl": "string"
      }
    ]
  }
}
```

### 3. 城市卡片打印接口

**接口描述**：获取城市卡片打印版本

**请求方法**：GET

**接口地址**：`/api/cities/print`

**请求参数**：
```json
{
  "cityId": "string"            // 城市ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "cityTitle": "杭州",         // 城市名称
    "printFiles": [
      {
        "type": "illustration", // 类型：illustration(插图), text(文本)
        "name": "杭州城市插图",   // 文件名称
        "fileUrl": "string",    // 文件URL（PDF格式）
        "thumbnailUrl": "string" // 缩略图URL
      },
      {
        "type": "text",
        "name": "杭州城市介绍(1)",
        "fileUrl": "string",
        "thumbnailUrl": "string"
      },
      {
        "type": "text",
        "name": "杭州城市介绍(2)",
        "fileUrl": "string",
        "thumbnailUrl": "string"
      }
    ],
    "combinedPdfUrl": "string", // 合并版PDF的URL
    "qrCode": "string"          // 分享二维码URL
  }
}
```

### 4. 完成城市挑战

**接口描述**：提交城市挑战的完成结果，解锁完整城市内容

**请求方法**：POST

**接口地址**：`/api/cities/challenge/complete`

**请求参数**：
```json
{
  "cityId": "string",           // 城市ID
  "challengeType": "string",    // 挑战类型：singleChoice, multipleChoice, puzzle
  "isCorrect": true,            // 是否正确完成
  "timeUsed": 30                // 完成用时（秒）
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "cityId": "string",         // 城市ID
    "unlocked": true,           // 是否解锁成功
    "rewards": {                // 奖励
      "points": 10,             // 获得积分
      "trees": 1                // 获得树木数量
    },
    "completedChallenges": ["singleChoice", "multipleChoice"], // 已完成的挑战
    "remainingChallenges": ["puzzle"] // 剩余挑战
  }
}
```

### 5. 获取城市音频

**接口描述**：获取城市音频解说

**请求方法**：GET

**接口地址**：`/api/cities/audio`

**请求参数**：
```json
{
  "cityId": "string"            // 城市ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "audioUrl": "string",       // 音频URL
    "duration": 180,            // 时长（秒）
    "transcript": "string",     // 文字稿
    "chapters": [               // 音频章节标记点
      {
        "title": "城市简介",     // 章节标题
        "startTime": 0          // 开始时间点（秒）
      },
      {
        "title": "历史文化",
        "startTime": 45
      }
    ]
  }
}
```

## 内容管理接口 (管理员)

### 1. 创建/更新城市卡片

**接口描述**：创建或更新城市卡片内容（管理员接口）

**请求方法**：POST

**接口地址**：`/api/admin/cities`

**请求参数**：
```json
{
  "id": "string",              // 城市ID，更新时提供，新建时可不提供
  "title": "杭州",              // 城市标题/名称
  "englishName": "Hangzhou",   // 英文名称
  "date": "2023-05-01",        // 发布日期
  "coverImage": "file",        // 封面图片文件（系统会自动生成缩略图，无需单独上传）
  "videoUrl": "string",        // 视频URL
  "audioFile": "file",         // 音频文件
  
  "contentSections": [         // 五个文本内容区块
    {
      "title": "城市简介",      // 区块标题
      "content": "string",     // 区块文本内容
      "image": "file"          // 对应图片文件
    },
    // ... 其他四个区块
  ],
  
  "poetry": {                  // 相关诗词
    "title": "钱塘湖春行",      // 诗词标题
    "author": "白居易",         // 作者
    "dynasty": "唐代",          // 朝代
    "content": "string",       // 内容
    "translation": "string"    // 翻译/注释
  },
  
  "printFiles": [              // 打印页文件
    {
      "type": "illustration",  // 类型
      "file": "file"           // 文件
    },
    // ... 其他打印页
  ],
  
  "challenges": {              // 挑战题
    "singleChoice": {
      "question": "string",
      "options": ["string"],
      "correctAnswer": 0
    },
    "multipleChoice": {
      "question": "string",
      "options": ["string"],
      "correctAnswers": [0, 1]
    },
    "puzzleImage": "file"      // 拼图图片文件
  },
  
  "isPublished": true          // 是否发布
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "string",            // 城市ID
    "title": "杭州",
    "date": "2023-05-01",
    "isPublished": true,
    "createTime": "string",    // 创建时间
    "updateTime": "string"     // 更新时间
  }
}
```

### 2. 城市卡片发布状态管理

**接口描述**：更改城市卡片的发布状态（管理员接口）

**请求方法**：PUT

**接口地址**：`/api/admin/cities/publish`

**请求参数**：
```json
{
  "cityId": "string",         // 城市ID
  "isPublished": true         // 是否发布
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "string",
    "title": "杭州",
    "isPublished": true,
    "updateTime": "string"    // 更新时间
  }
}
```

## 博物馆接口

### 1. 获取城市博物馆章节列表

**接口描述**：获取城市博物馆的所有章节列表

**请求方法**：GET

**接口地址**：`/api/museum/city/chapters`

**请求参数**：无

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "chapters": [
      {
        "id": "concept",        // 章节ID
        "name": "概念篇",        // 章节名称
        "description": "城市概念的发展与演变", // 章节描述
        "unlocked": true,       // 是否已解锁
        "iconUrl": "string"     // 章节图标URL
      },
      {
        "id": "origin",         // 章节ID
        "name": "起源篇",        // 章节名称
        "description": "城市起源与早期发展", // 章节描述
        "unlocked": true,       // 是否已解锁
        "iconUrl": "string"     // 章节图标URL
      }
    ]
  }
}
```

### 2. 获取城市博物馆章节详情

**接口描述**：获取城市博物馆特定章节的详细内容

**请求方法**：GET

**接口地址**：`/api/museum/city/chapter`

**请求参数**：
```json
{
  "chapterId": "concept"         // 章节ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "concept",            // 章节ID
    "name": "概念篇",            // 章节名称
    "description": "城市概念的发展与演变", // 章节描述
    "content": [                // 章节内容，支持富文本格式
      {
        "type": "text",         // 内容类型：text, image, quote
        "value": "城市是一种复杂的社会组织形式..." // 内容文字
      },
      {
        "type": "image",        // 图片类型
        "url": "string",        // 图片URL
        "caption": "古代城市示意图" // 图片说明
      },
      {
        "type": "quote",        // 引用类型
        "text": "城市让生活更美好", // 引用内容
        "author": "亚里士多德"    // 引用作者
      }
    ],
    "relatedResources": [       // 相关资源
      {
        "type": "article",      // 资源类型：article, video, audio
        "title": "中国古代城市的特点", // 资源标题
        "url": "string"         // 资源链接
      }
    ]
  }
}
```

### 3. 获取诗画古城数据

**接口描述**：获取城市与诗词的关联数据

**请求方法**：GET

**接口地址**：`/api/museum/city/poetry`

**请求参数**：无

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "cityPoetry": [
      {
        "verse": "姑苏城外寒山寺，夜半钟声到客船", // 诗句
        "title": "枫桥夜泊",      // 诗词标题
        "poet": "张继",          // 诗人
        "city": "苏州",          // 关联城市
        "dynasty": "唐代",       // 朝代
        "imageUrl": "string"    // 配图URL
      },
      {
        "verse": "接天莲叶无穷碧，映日荷花别样红", // 诗句
        "title": "晓出净慈寺送林子方", // 诗词标题
        "poet": "杨万里",         // 诗人
        "city": "杭州",           // 关联城市
        "dynasty": "宋代",        // 朝代
        "imageUrl": "string"     // 配图URL
      }
    ]
  }
}
```

### 4. 获取时节博物馆区域列表

**接口描述**：获取时节博物馆的所有区域列表

**请求方法**：GET

**接口地址**：`/api/museum/season/areas`

**请求参数**：无

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "areas": [
      {
        "id": "astronomy",       // 区域ID
        "name": "天文区",         // 区域名称
        "description": "探索二十四节气与天文学的关系", // 区域描述
        "unlocked": true,        // 是否已解锁
        "iconUrl": "string"      // 区域图标URL
      },
      {
        "id": "climate",         // 区域ID
        "name": "气候区",         // 区域名称
        "description": "了解二十四节气与气候变化的关联", // 区域描述
        "unlocked": true,        // 是否已解锁
        "iconUrl": "string"      // 区域图标URL
      }
    ]
  }
}
```

### 5. 获取时节博物馆区域详情

**接口描述**：获取时节博物馆特定区域的详细内容

**请求方法**：GET

**接口地址**：`/api/museum/season/area`

**请求参数**：
```json
{
  "areaId": "astronomy"         // 区域ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "astronomy",          // 区域ID
    "name": "天文区",            // 区域名称
    "description": "探索二十四节气与天文学的关系", // 区域描述
    "content": [                // 区域内容，支持富文本格式
      {
        "type": "text",         // 内容类型：text, image, quote
        "value": "二十四节气是根据地球绕日运行轨迹而制定的..." // 内容文字
      },
      {
        "type": "image",        // 图片类型
        "url": "string",        // 图片URL
        "caption": "节气与太阳位置关系图" // 图片说明
      }
    ],
    "exhibits": [               // 展品列表
      {
        "id": "sundial",        // 展品ID
        "name": "日晷",          // 展品名称
        "description": "古代测量时间的天文仪器", // 展品描述
        "imageUrl": "string",   // 展品图片URL
        "audioUrl": "string"    // 讲解音频URL
      }
    ]
  }
}
```

### 6. 获取二十四节气信息

**接口描述**：获取二十四节气的详细信息

**请求方法**：GET

**接口地址**：`/api/museum/season/solarterms`

**请求参数**：
```json
{
  "year": 2023,                // 可选，年份，不传默认当年
  "month": 3                   // 可选，月份，不传返回全年节气
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "solarTerms": [
      {
        "name": "立春",          // 节气名称
        "date": "2023-02-04",   // 该年节气日期
        "description": "立，建始也，春气始而建立也。", // 节气简介
        "phenology": [          // 物候现象
          "东风解冻",
          "蛰虫始振",
          "鱼陟负冰"
        ],
        "customs": [            // 民俗习惯
          {
            "name": "咬春",      // 习俗名称
            "description": "吃萝卜、青菜等时令蔬菜" // 习俗描述
          }
        ],
        "imageUrl": "string"    // 节气配图URL
      }
    ]
  }
}
```

## 阵营功能接口

### 1. 用户阵营选择

**接口描述**：用户选择加入的阵营，每个用户只能选择一次

**请求方法**：POST

**接口地址**：`/api/user/faction`

**请求参数**：
```json
{
  "userId": "string",     // 用户ID
  "faction": "string"     // 阵营选择: "tower"(楼台烟雨中) 或 "rain"(好雨知时节)
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "userId": "string",  // 用户ID
    "faction": "string", // 用户阵营
    "joinTime": "string" // 加入时间
  }
}
```

### 2. 获取用户阵营信息

**接口描述**：获取当前用户的阵营信息

**请求方法**：GET

**接口地址**：`/api/user/faction`

**请求参数**：
```json
{
  "userId": "string"  // 用户ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "userId": "string",    // 用户ID
    "faction": "string",   // "tower"或"rain"，空字符串表示未选择
    "joinTime": "string",  // 加入时间
    "contribution": 100    // 对阵营的贡献值
  }
}
```

## 知识题目接口

### 1. 获取PK赛题目

**接口描述**：获取PK赛题目，每天19:30-19:45固定更新全新题库

**请求方法**：GET

**接口地址**：`/api/pk/questions`

**请求参数**：
```json
{
  "date": "2023-05-20",  // 当前日期，格式：YYYY-MM-DD
  "faction": "tower",    // 用户阵营："tower"或"rain"
  "version": "1.0"       // API版本号
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "questions": {
      "single": [
        {
          "id": "string",           // 题目ID
          "text": "string",         // 题目内容
          "options": ["string"],    // 选项数组
          "correctAnswer": 0        // 正确答案索引
        }
      ],
      "multiple": [
        {
          "id": "string",               // 题目ID
          "text": "string",             // 题目内容
          "options": ["string"],        // 选项数组
          "correctAnswers": [0, 1, 2]   // 正确答案索引数组
        }
      ],
      "fill": [
        {
          "id": "string",                 // 题目ID
          "text": "string",               // 题目内容
          "correctAnswer": "string",      // 正确答案
          "alternativeAnswers": ["string"] // 可接受的替代答案
        }
      ]
    }
  }
}
```

### 2. 获取训练题目

**接口描述**：获取训练模式题目，每天更新，区分城市训练和时节训练

**请求方法**：GET

**接口地址**：`/api/training`

**请求参数**：
```json
{
  "type": "city",       // 训练类型："city"(城市训练)或"season"(时节训练)
  "date": "2023-05-20", // 当前日期，格式：YYYY-MM-DD
  "version": "1.0"      // API版本号
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "questions": {
      "single": [
        {
          "id": "string",           // 题目ID
          "text": "string",         // 题目内容
          "options": ["string"],    // 选项数组
          "correctAnswer": 0        // 正确答案索引
        }
      ],
      "multiple": [
        {
          "id": "string",               // 题目ID
          "text": "string",             // 题目内容
          "options": ["string"],        // 选项数组
          "correctAnswers": [0, 1, 2]   // 正确答案索引数组
        }
      ],
      "fill": [
        {
          "id": "string",                 // 题目ID
          "text": "string",               // 题目内容
          "correctAnswer": "string",      // 正确答案
          "alternativeAnswers": ["string"] // 可接受的替代答案
        }
      ]
    }
  }
}
```

## 答题功能接口

### 1. 提交PK答案

**接口描述**：提交PK答题结果

**请求方法**：POST

**接口地址**：`/api/pk/submit-answer`

**请求参数**：
```json
{
  "questionId": "string",         // 题目ID
  "questionType": "string",       // 题目类型："single"、"multiple"或"fill"
  "userAnswer": "mixed",          // 用户答案：单选为数字，多选为数组，填空为字符串
  "isCorrect": true,              // 是否正确
  "timeUsed": 10,                 // 答题用时（秒）
  "faction": "tower",             // 用户所属阵营
  "timestamp": 1621504812000      // 时间戳
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "isCorrect": true,        // 是否正确
    "score": 1,               // 获得分数
    "scores": {               // 当前阵营得分情况
      "tower": 10,            // 楼台烟雨中分数
      "rain": 8               // 好雨知时节分数
    }
  }
}
```

## PK系统接口

### 1. 获取PK结果

**接口描述**：获取PK赛事结果，包括获胜阵营、个人排名等信息

**请求方法**：GET

**接口地址**：`/api/pk/results`

**请求参数**：
```json
{
  "date": "2023-05-20",         // 日期，格式：YYYY-MM-DD
  "faction": "tower",           // 用户阵营
  "correctAnswers": 10,         // 用户正确答题数
  "answeredQuestions": 15       // 用户已答题数
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "winnerFaction": "tower",    // 获胜阵营："tower"或"rain"
    "topPerformers": [           // 排行榜前十用户
      {
        "name": "string",        // 用户名称
        "faction": "string",     // 用户阵营
        "score": 10,             // 得分
        "isCurrentUser": false   // 是否为当前用户
      }
    ],
    "totalAnswers": 1250,        // 总答题人数
    "avgCorrectRate": 75,        // 平均正确率
    "userRanking": 5,            // 用户排名
    "userScore": 10,             // 用户得分
    "userReward": 2              // 用户获得的树奖励
  }
}
```

### 2. 获取排行榜数据

**接口描述**：获取排行榜数据，包括个人排名和昨日获胜阵营

**请求方法**：GET

**接口地址**：`/api/leaderboard`

**请求参数**：
```json
{
  "date": "2023-05-20",                  // 当前日期
  "yesterday": "2023-05-19"              // 前一天日期，用于获取昨日获胜阵营
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "users": [                     // 排行榜用户列表
      {
        "name": "string",          // 用户名称
        "faction": "string",       // 用户阵营："tower"或"rain"
        "score": 1000              // 用户得分
      }
    ],
    "dailyWinner": {               // 昨日获胜阵营
      "faction": "tower",          // 获胜阵营："tower"或"rain"
      "score": 12580               // 获胜分数
    },
    "factionCounts": {             // 阵营人数
      "tower": 1256,               // 楼台烟雨中人数
      "rain": 1378                 // 好雨知时节人数
    }
  }
}
```

## 会员宣传接口

### 1. 获取会员介绍信息

**接口描述**：获取会员权益、价格等宣传信息

**请求方法**：GET

**接口地址**：`/api/membership/info`

**请求参数**：无

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "title": "晓时节会员",
    "slogan": "探索城市与节气的奥秘",
    "bannerUrl": "string",          // 会员宣传横幅URL
    "monthlyPrice": 28,             // 月度价格（元）
    "yearlyPrice": 198,             // 年度价格（元）
    "yearlyOriginalPrice": 336,     // 年度原价（元）
    "benefits": [                   // 会员权益列表
      {
        "title": "城市卡片全解锁",
        "description": "365座城市，每日更新，印刷级清晰度下载",
        "iconUrl": "string"
      },
      {
        "title": "博物馆全解锁",
        "description": "晓城博物馆与晓时博物馆全部内容畅享",
        "iconUrl": "string"
      },
      {
        "title": "优质音频解说",
        "description": "专业录音棚制作，沉浸式体验",
        "iconUrl": "string"
      }
    ],
    "promotions": [                // 促销活动
      {
        "id": "spring_festival",
        "title": "春节特惠",
        "description": "年度会员8折优惠",
        "discountRate": 0.8,
        "startDate": "2023-01-20",
        "endDate": "2023-02-05"
      }
    ]
  }
}
```

### 2. 会员购买/续费

**接口描述**：创建会员购买订单

**请求方法**：POST

**接口地址**：`/api/membership/order`

**请求参数**：
```json
{
  "userId": "string",         // 用户ID
  "membershipType": "yearly", // 会员类型：monthly(月度), yearly(年度)
  "paymentMethod": "wechat",  // 支付方式：wechat(微信支付), alipay(支付宝)
  "promoCode": "string"       // 可选，促销码
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "orderId": "string",      // 订单ID
    "amount": 198,            // 支付金额
    "discounted": true,       // 是否有折扣
    "originalAmount": 336,    // 原价
    "paymentParams": {        // 支付参数，用于前端调起支付
      "appId": "string",
      "timeStamp": "string",
      "nonceStr": "string",
      "package": "string",
      "signType": "string",
      "paySign": "string"
    },
    "expireTime": "string"    // 订单过期时间
  }
}
```

### 3. 获取用户会员状态

**接口描述**：获取用户当前会员状态信息

**请求方法**：GET

**接口地址**：`/api/membership/status`

**请求参数**：
```json
{
  "userId": "string"          // 用户ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "isMember": true,         // 是否是会员
    "membershipType": "yearly", // 会员类型：monthly(月度), yearly(年度)
    "startDate": "2023-01-01", // 会员开始日期
    "expireDate": "2023-12-31", // 会员过期日期
    "autoRenew": true,        // 是否自动续费
    "remainingDays": 245      // 剩余天数
  }
}
```

## 博物馆内容管理接口 (管理员)

### 1. 上传晓城博物馆章节A4图片与音频

**接口描述**：上传晓城博物馆各章节的A4展示图片和解说音频

**请求方法**：POST

**接口地址**：`/api/admin/museum/city/chapter/resources`

**请求参数**：
```json
{
  "chapterId": "string",      // 章节ID: concept(概念篇), origin(起源篇), ancient(古城篇), 
                              // scale(规模篇), function(职能篇), location(位置篇),
                              // pattern(形态篇), capital(首都篇), famous(名著篇), naming(名称篇)
  "title": "概念篇",           // 章节标题
  "a4Image": "file",          // A4展示图片文件
  "audioFile": "file",        // 音频文件
  "audioDuration": 180,       // 音频时长（秒）
  "audioTranscript": "string" // 音频文字稿
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "chapterId": "concept",
    "title": "概念篇",
    "a4ImageUrl": "string",      // A4图片URL
    "audioUrl": "string",        // 音频URL
    "thumbnailUrl": "string",    // 缩略图URL
    "updateTime": "string"       // 更新时间
  }
}
```

### 2. 上传晓时博物馆节气区域A4图片与音频

**接口描述**：上传晓时博物馆节气区域的A4展示图片和解说音频

**请求方法**：POST

**接口地址**：`/api/admin/museum/season/area/resources`

**请求参数**：
```json
{
  "areaId": "string",         // 区域ID: base(基础), spring(春季), summer(夏季), 
                              // autumn(秋季), winter(冬季), astronomy(天文区), 
                              // climate(气候区), tool(工具区), calendar(历法区),
                              // crop(作物区), painting(绘画区), literature(文学区), music(音乐区)
  "title": "春季节气",         // 区域标题
  "a4Image": "file",          // A4展示图片文件
  "audioFile": "file",        // 音频文件
  "audioDuration": 180,       // 音频时长（秒）
  "audioTranscript": "string" // 音频文字稿
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "areaId": "spring",
    "title": "春季节气",
    "a4ImageUrl": "string",      // A4图片URL
    "audioUrl": "string",        // 音频URL
    "thumbnailUrl": "string",    // 缩略图URL
    "updateTime": "string"       // 更新时间
  }
}
```

### 3. 获取晓城博物馆章节A4资源

**接口描述**：获取晓城博物馆特定章节的A4图片与音频资源

**请求方法**：GET

**接口地址**：`/api/museum/city/chapter/resources`

**请求参数**：
```json
{
  "chapterId": "concept"      // 章节ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "chapterId": "concept",
    "title": "概念篇",
    "a4ImageUrl": "string",      // A4图片URL，适合直接打印
    "audioUrl": "string",        // 音频URL
    "audioDuration": 180,        // 音频时长（秒）
    "audioTranscript": "string", // 音频文字稿
    "qrCode": "string"           // 分享二维码URL
  }
}
```

### 4. 获取晓时博物馆区域A4资源

**接口描述**：获取晓时博物馆特定区域的A4图片与音频资源

**请求方法**：GET

**接口地址**：`/api/museum/season/area/resources`

**请求参数**：
```json
{
  "areaId": "spring"          // 区域ID
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "areaId": "spring",
    "title": "春季节气",
    "a4ImageUrl": "string",      // A4图片URL，适合直接打印
    "audioUrl": "string",        // 音频URL
    "audioDuration": 180,        // 音频时长（秒）
    "audioTranscript": "string", // 音频文字稿
    "qrCode": "string"           // 分享二维码URL
  }
}
```

### 5. 上传月份轮播图片

**接口描述**：上传时序经纬页面12个月份的轮播图片

**请求方法**：POST

**接口地址**：`/api/admin/time-sequence/month-carousel`

**请求参数**：
```json
{
  "month": 5,                  // 月份，1-12
  "carouselImage": "file",     // 轮播图片文件
  "title": "五月·立夏",         // 轮播图标题
  "description": "万物至此皆长大，故名立夏" // 轮播图描述
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "month": 5,
    "title": "五月·立夏",
    "imageUrl": "string",       // 图片URL
    "updateTime": "string"      // 更新时间
  }
}
```

### 6. 获取月份轮播图片

**接口描述**：获取时序经纬页面月份轮播图片

**请求方法**：GET

**接口地址**：`/api/time-sequence/month-carousel`

**请求参数**：
```json
{
  "month": 0                   // 月份，1-12，0表示获取全部月份
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "carousels": [
      {
        "month": 1,
        "title": "一月·小寒",
        "description": "小寒小寒，天气寒冷但未达极点",
        "imageUrl": "string"    // 图片URL
      },
      {
        "month": 2,
        "title": "二月·雨水",
        "description": "降雨开始，雪渐消融",
        "imageUrl": "string"    // 图片URL
      }
      // ... 其他月份
    ]
  }
}
```

## 题库管理接口 (管理员)

### 1. 上传PK赛题目

**接口描述**：上传PK赛题目

**请求方法**：POST

**接口地址**：`/api/admin/questions/pk`

**请求参数**：
```json
{
  "date": "2023-05-20",                 // 题目生效日期
  "questions": {
    "single": [                         // 5个单选题
      {
        "text": "string",               // 题目内容
        "options": ["string"],          // 选项数组
        "correctAnswer": 0,             // 正确答案索引
        "difficulty": 2                 // 难度：1-3
      }
      // ... 共5个单选题
    ],
    "multiple": [                       // 5个多选题
      {
        "text": "string",               // 题目内容
        "options": ["string"],          // 选项数组
        "correctAnswers": [0, 1],       // 正确答案索引数组
        "difficulty": 2                 // 难度：1-3
      }
      // ... 共5个多选题
    ],
    "fill": [                           // 5个填空题
      {
        "text": "string",               // 题目内容，使用____表示填空处
        "correctAnswer": "string",      // 标准答案
        "alternativeAnswers": ["string"], // 可接受的替代答案
        "difficulty": 2                 // 难度：1-3
      }
      // ... 共5个填空题
    ]
  }
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "date": "2023-05-20",
    "questionCount": {
      "single": 5,
      "multiple": 5,
      "fill": 5
    },
    "updateTime": "string"          // 更新时间
  }
}
```

### 2. 上传训练题目

**接口描述**：上传城市训练或时节训练的题目

**请求方法**：POST

**接口地址**：`/api/admin/questions/training`

**请求参数**：
```json
{
  "type": "city",                     // 训练类型："city"(城市训练)或"season"(时节训练)
  "date": "2023-05-20",               // 题目生效日期
  "questions": {
    "single": [                       // 5个单选题
      {
        "text": "string",             // 题目内容
        "options": ["string"],        // 选项数组
        "correctAnswer": 0,           // 正确答案索引
        "difficulty": 2               // 难度：1-3
      }
      // ... 共5个单选题
    ],
    "multiple": [                     // 5个多选题
      {
        "text": "string",             // 题目内容
        "options": ["string"],        // 选项数组
        "correctAnswers": [0, 1],     // 正确答案索引数组
        "difficulty": 2               // 难度：1-3
      }
      // ... 共5个多选题
    ],
    "fill": [                         // 5个填空题
      {
        "text": "string",             // 题目内容，使用____表示填空处
        "correctAnswer": "string",    // 标准答案
        "alternativeAnswers": ["string"], // 可接受的替代答案
        "difficulty": 2               // 难度：1-3
      }
      // ... 共5个填空题
    ]
  }
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "type": "city",
    "date": "2023-05-20",
    "questionCount": {
      "single": 5,
      "multiple": 5,
      "fill": 5
    },
    "updateTime": "string"          // 更新时间
  }
}
```

### 3. 上传城市挑战题目

**接口描述**：为特定城市卡片上传挑战题目

**请求方法**：POST

**接口地址**：`/api/admin/questions/city-challenge`

**请求参数**：
```json
{
  "cityId": "string",                // 城市ID
  "challenges": {
    "singleChoice": {                // 单选题
      "question": "杭州最著名的景点是？",
      "options": ["西湖", "西塘", "乌镇", "千岛湖"],
      "correctAnswer": 0             // 正确答案索引
    },
    "multipleChoice": {              // 多选题
      "question": "下列哪些是杭州的特产？",
      "options": ["龙井茶", "西湖醋鱼", "东坡肉", "小笼包"],
      "correctAnswers": [0, 1, 2]    // 正确答案索引数组
    },
    "puzzleImage": "file"            // 拼图图片文件
  }
}
```

**响应结果**：
```json
{
  "success": true,
  "message": "success",
  "data": {
    "cityId": "string",
    "cityTitle": "杭州",
    "challengesUpdated": ["singleChoice", "multipleChoice", "puzzle"],
    "updateTime": "string"           // 更新时间
  }
}
```

## 接口错误码说明

| 错误码 | 说明 |
|-------|------|
| 1001  | 参数错误 |
| 1002  | 用户未认证 |
| 1003  | 权限不足 |
| 2001  | 用户已选择阵营，不可更改 |
| 2002  | 无效的阵营选择 |
| 3001  | 题目不存在 |
| 3002  | 答案格式错误 |
| 4001  | PK赛未开始 |
| 4002  | 该题已被抢答 |
| 4003  | 不在PK时间段内（非19:30-19:45）|
| 5001  | 系统内部错误 |
| 6001  | 用户不是会员 |
| 6002  | 会员已过期 |
| 7001  | 文件上传失败 |
| 7002  | 文件类型不支持 |
| 7003  | 文件大小超出限制 |

## 接口实现优先级

建议按照以下优先级实现接口：

1. 城市卡片相关接口（时序经纬-timeSequence）
2. 博物馆相关接口（绿岸博物馆-greenCliff）
3. 用户阵营选择/获取
4. 获取训练题目（每日更新）
5. 获取PK赛题目（每日19:30-19:45更新）
6. 提交答题和PK答案
7. 获取PK结果和排行榜

 
 
 
 