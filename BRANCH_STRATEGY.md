# 晓时节前端 - Git分支策略

## 🌿 分支结构

### 主要分支

#### 1. `master` 分支 - 生产环境
- **用途**: 生产环境代码，随时可发布
- **保护**: 受保护分支，不允许直接推送
- **合并**: 只能从 `development` 分支合并
- **发布**: 每次合并到master都应该打tag

#### 2. `development` 分支 - 开发主分支  
- **用途**: 日常开发的主分支
- **保护**: 受保护分支，需要PR审核
- **合并**: 接收来自 `feature` 分支的合并
- **测试**: 部署到测试环境进行集成测试

### 辅助分支

#### 3. `feature` 分支 - 功能开发
- **命名**: `feature/功能名称` (如: `feature/user-login`)
- **用途**: 开发新功能
- **来源**: 从 `development` 分支创建
- **合并**: 完成后合并回 `development`

#### 4. `hotfix` 分支 - 紧急修复
- **命名**: `hotfix/修复内容` (如: `hotfix/login-bug`)
- **用途**: 修复生产环境紧急问题
- **来源**: 从 `master` 分支创建
- **合并**: 同时合并到 `master` 和 `development`

## 🔄 工作流程

### 日常开发流程
1. 从 `development` 创建 `feature/xxx` 分支
2. 在功能分支上开发
3. 完成后提交PR到 `development`
4. 代码审核通过后合并
5. 删除功能分支

### 发布流程
1. 在 `development` 分支测试完成
2. 创建PR从 `development` 到 `master`
3. 审核通过后合并
4. 在 `master` 分支打版本标签
5. 部署到生产环境

### 紧急修复流程
1. 从 `master` 创建 `hotfix/xxx` 分支
2. 修复问题并测试
3. 同时合并到 `master` 和 `development`
4. 部署到生产环境

## 📋 分支保护建议

### GitHub设置
- `master`: 启用分支保护，需要PR审核
- `development`: 启用分支保护，需要PR审核
- 要求状态检查通过
- 要求分支是最新的

## 👥 团队协作

- **前端开发**: 主要在 `development` 和 `feature` 分支工作
- **测试**: 在 `development` 分支进行集成测试
- **发布**: 只有项目负责人可以合并到 `master` 