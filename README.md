# 晓时节小程序前端文档

## 项目概述

"晓时节"是一款结合城市文化与时节知识的微信小程序，通过知识问答、阵营对战等形式，让用户在轻松愉快的环境中了解传统文化知识。本项目以优雅的古风设计风格呈现，主要包含首页、博物馆、漫游记、竞赛等多个功能模块。

## 页面结构

```
pages/
  ├── cloudDwelling/       # 晓主页 - 首页
  ├── greenCliff/          # 博物馆 - 展示城市文化
  ├── timeSequence/        # 漫游记 - 时节内容展示
  ├── lanTing/             # 晓竞赛 - 知识问答与竞赛
  ├── pkBattle/            # 阵营PK - 实时对战
  ├── articleDetail/       # 文章详情
  ├── membership/          # 会员信息
  ├── about/               # 关于我们
  ├── agreement/           # 用户协议与隐私政策
  ├── contact/             # 联系客服
  └── footprints/          # 用户足迹
```

## 主要功能

### 1. 晓主页 (cloudDwelling)

晓主页是小程序的入口页面，设计风格清雅古韵：
- 首页展示小程序最新内容与推荐
- 活动公告区展示当前进行中的活动
- 用户可访问其他主要功能模块
- 展示用户当前种植的小树和个人信息
- 通过页面顶部导航可快速切换到其他主要页面
- 显示当前节气信息和倒计时

### 2. 博物馆 (greenCliff)

博物馆页面是展示城市文化知识的主要版块：
- 展示不同城市的特色文化内容和历史
- 用户可浏览文化图片、文字说明和相关视频
- 内容分类展示，支持用户收藏和分享
- 文化知识轮播，定期更新新内容
- 点击文章可进入详情页深入阅读

### 3. 漫游记 (timeSequence)

漫游记页面主要展示二十四节气及相关时节知识：
- 按季节和时间顺序展示二十四节气内容
- 每个节气包含习俗介绍、诗词、饮食等知识
- 用户可探索各节气的传统活动和文化意义
- 时节日历功能，显示当前及即将到来的节气
- 相关节气的美食、植物等特色内容推荐
- 城市卡片功能，展示与节气相关的城市知识
- 可通过城市卡片挑战获取成就和奖励

### 4. 晓竞赛 (lanTing)

晓竞赛页面是一个知识问答比赛平台，用户可以:
- 选择加入"楼台烟雨中"或"好雨知时节"两大阵营之一
- 参与单独的城市训练或时节训练（不受阵营限制）
- 在每晚19:30参与阵营PK大赛，为自己的阵营赢取积分
- 查看排行榜了解个人和阵营的表现

### 5. 阵营PK (pkBattle)

阵营PK是晓竞赛的核心对战功能，具有以下特点:
- 实时抢答模式：第一个回答正确的用户为其阵营赢得1分
- 综合题型：单选题、多选题、填空题各5道
- 倒计时机制：每题30秒，时间结束无人回答则该题作废
- 结果展示：比赛结束后显示获胜阵营和个人排名前三名

### 6. 文章详情 (articleDetail)

文章详情页面用于展示完整的文章内容：
- 完整展示从博物馆或漫游记点击进入的文章
- 支持图文混排，视频播放等多媒体内容
- 提供点赞、收藏、分享功能
- 底部展示相关推荐文章
- 支持用户评论互动

### 7. 会员信息 (membership)

会员信息页面展示和管理用户的会员状态：
- 展示会员等级和特权信息
- 提供会员购买和续费功能
- 展示不同会员套餐和价格
- 会员专属内容解锁
- 会员购买记录查询

### 8. 用户足迹 (footprints)

用户足迹页面记录用户在小程序中的活动历史：
- 浏览过的文章记录
- 参与的问答和竞赛记录
- 获得的成就和奖励
- 种植的小树记录和成长历程
- 支持回顾和分享用户的活动轨迹

## 设计风格

整个小程序采用古风设计风格，主要特点：
- 主色调：轻盈雅致的浅绿色系，营造古风意境
- 设计元素：传统文化图案、水墨风格插图和简约emoji
- 字体：古风字体与现代易读字体结合
- 布局：简约清雅，留白适当，符合传统美学

## 技术实现

### 前端架构

小程序采用微信小程序原生开发方式，主要技术栈：
- WXML + WXSS + JavaScript
- 微信小程序组件化开发
- Promise + Async/Await 处理异步
- wx.request API 处理网络请求

### 核心功能实现

1. **节气信息**：通过API获取实时节气信息，支持离线缓存
2. **阵营PK**：使用WebSocket实现实时对战和答题同步
3. **会员系统**：接入微信支付，实现会员购买与续费
4. **用户认证**：使用微信登录和用户授权，保存用户信息
5. **缓存机制**：对API数据进行本地缓存，提高加载速度
6. **城市卡片**：通过API获取城市信息，支持挑战、打印和分享功能

## API服务

晓时节小程序所有数据均通过远程API获取，主要包括以下核心模块：

### 1. 节气信息API

节气信息API提供二十四节气的详细信息，主要接口：
- `/seasons/current` - 获取当前节气信息，包括名称、日期、描述、诗句及图片
- `/seasons/all` - 获取全部节气列表，包含所有二十四节气的基本信息
- `/seasons/detail` - 获取指定节气详情，包含特定节气的全部信息和额外数据

### 2. 会员系统API

会员系统API提供会员管理和购买功能，主要接口：
- `/membership/info` - 获取会员价格方案和宣传图片
- `/membership/purchase` - 处理会员购买请求，调用微信支付接口
- `/membership/status` - 查询用户会员状态，返回会员有效期和剩余天数
- `/membership/records` - 获取会员购买记录，包含历史购买信息

### 3. 城市卡片API

城市卡片API提供城市信息、封面、挑战等功能，主要接口：
- `/cities` - 获取城市卡片信息，包含已解锁和未解锁的城市列表
- `/cities/cover` - 获取城市封面信息，包括名称、坐标、人口等基本信息
- `/cities/detail` - 获取城市详情，包括自然地理、气候时节、人文气息等模块
- `/cities/sections/{sectionId}` - 获取城市特定板块详情
- `/cities/challenge/info` - 获取城市知识挑战信息，包括挑战题目类型和奖励
- `/cities/print` - 获取城市信息的打印版本，支持多种格式
- `/cities/audio` - 获取城市的音频解说，包括语音导览和文字稿

### 4. 博物馆内容API

博物馆API提供晓城博物馆和晓时博物馆的内容访问，主要接口：
- `/museum/city-chapters` - 获取城市博物馆的所有章节信息，包括解锁状态和树木消耗数量
- `/museum/city-chapter/{chapterId}` - 获取特定城市章节的详细内容
- `/museum/city-poetry` - 获取诗画古城数据，包含城市对应的古诗词
- `/museum/season-areas` - 获取时节博物馆的所有区域信息
- `/museum/season-area/{areaId}` - 获取特定时节区域的详细内容
- `/museum/solar-terms` - 获取二十四节气概览信息
- `/user/unlock` - 提交内容解锁请求，消耗树木获取特定内容

所有API详细信息请参考项目根目录的`API-docs.md`文件和`城市卡片API.md`文件。API的基础URL为`https://api.xiaoshijie.com/v1`，所有接口统一使用标准JSON格式传递数据。

## 本地开发与调试

1. 使用微信开发者工具打开项目
2. 项目配置在 `project.config.json` 文件中
3. 开发环境下API统一使用本地Mock数据
4. 预览和真机调试使用开发环境API
5. 发布版本使用生产环境API

## 部署与发布

1. 在微信开发者工具中上传代码
2. 提交审核并发布
3. 版本管理与更新通过微信小程序后台进行

## 联系方式

若有任何问题，请联系：
- 邮箱: xiao_shi_jie@126.com 