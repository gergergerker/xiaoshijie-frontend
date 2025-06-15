# 晓时节前端 - Git分支策略

## 🌿 简洁分支结构

### 核心分支

#### 1. `master` 分支 - 生产环境（核心稳定分支）
- **用途**: 生产环境代码，随时可发布
- **特点**: 始终保持稳定，只包含经过测试的代码
- **保护**: 受保护分支，不允许直接推送
- **合并**: 只能从 `develop` 分支通过PR合并
- **发布**: 每次合并都应该打版本标签

#### 2. `develop` 分支 - 开发分支
- **用途**: 日常开发的主要分支
- **特点**: 包含最新的开发功能，可能不稳定
- **保护**: 建议设置保护，需要PR审核
- **合并**: 接收来自功能分支的合并
- **测试**: 在此分支进行集成测试

### 临时分支

#### 3. `feature/功能名` - 功能开发分支
- **命名**: `feature/user-login`, `feature/payment-page` 等
- **用途**: 开发具体功能
- **来源**: 从 `develop` 分支创建
- **合并**: 完成后合并回 `develop`
- **生命周期**: 功能完成后删除

## 🔄 工作流程

### 日常开发流程
```
1. 从 develop 创建功能分支
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-function

2. 在功能分支开发
   # 开发代码...
   git add .
   git commit -m "实现新功能"

3. 推送功能分支
   git push origin feature/new-function

4. 创建PR: feature/new-function → develop

5. 代码审核通过后合并到develop

6. 删除功能分支
   git branch -d feature/new-function
```

### 发布流程
```
1. develop分支测试完成
2. 创建PR: develop → master
3. 审核通过后合并
4. 在master分支打标签
   git tag -a v1.0.0 -m "发布版本1.0.0"
   git push origin v1.0.0
5. 部署到生产环境
```

### 紧急修复流程
```
1. 从master创建hotfix分支
   git checkout master
   git checkout -b hotfix/urgent-fix

2. 修复问题并测试
3. 同时合并到master和develop
4. 立即部署
```

## 📋 分支保护建议

### GitHub设置
- **master分支**:
  - ✅ 启用分支保护
  - ✅ 需要PR审核（至少1人）
  - ✅ 要求状态检查通过
  - ✅ 要求分支是最新的
  - ✅ 限制直接推送

- **develop分支**:
  - ✅ 启用分支保护
  - ✅ 需要PR审核
  - ✅ 允许管理员直接推送（可选）

## 👥 团队协作

### 角色分工
- **开发者**: 主要在 `develop` 和 `feature/*` 分支工作
- **测试**: 在 `develop` 分支进行功能测试
- **项目经理**: 负责 `develop` → `master` 的发布决策
- **运维**: 负责 `master` 分支的生产部署

### 最佳实践
- 🔄 经常从 `develop` 拉取最新代码
- 📝 提交信息要清晰明确
- 🧪 功能分支要经过充分测试
- 🏷️ 发布时要打版本标签
- 🗑️ 及时删除已合并的功能分支 