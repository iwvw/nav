# Vercel 一键部署指南

这个项目已经完全配置好，可以一键部署到 Vercel 平台。

## 🚀 快速部署

### 方法一：使用 Vercel CLI（推荐）

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel
```

4. **按照提示操作**
   - 选择项目根目录
   - 确认项目设置
   - 等待部署完成

### 方法二：通过 GitHub 集成

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

2. **连接 Vercel 和 GitHub**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

### 方法三：直接拖拽部署

1. **压缩项目文件**
```bash
zip -r nav-project.zip . -x "node_modules/*" ".git/*" "dist/*" ".next/*"
```

2. **上传到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 将压缩包拖拽到部署区域

## 📋 部署前检查清单

- [ ] 代码已推送到 Git 仓库
- [ ] 环境变量已配置
- [ ] 数据库已设置（Vercel Postgres）
- [ ] 项目名称已确定

## ⚙️ 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```env
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 获取数据库连接字符串

1. 在 Vercel 项目中，点击 "Storage"
2. 创建新的 PostgreSQL 数据库
3. 复制 `.env.local` 中的 `DATABASE_URL`
4. 粘贴到项目环境变量中

## 🗄️ 数据库设置

### 自动初始化

部署完成后，访问以下 URL 来初始化数据库：

```
https://your-app.vercel.app/api/init
```

或者使用 curl：

```bash
curl -X POST https://your-app.vercel.app/api/init
```

### 手动初始化（可选）

如果自动初始化失败，可以手动运行：

```bash
# 在本地运行
npm run db:deploy
npm run db:seed

# 或者使用 Vercel CLI
vercel env pull .env.local
npm run db:deploy
npm run db:seed
```

## 🔧 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 📊 监控和日志

- **部署日志**: 在 Vercel 仪表板查看
- **函数日志**: 在 Functions 标签页查看
- **数据库监控**: 在 Storage 标签页查看

## 🚨 常见问题

### 问题 1: 数据库连接失败
**解决方案**: 检查 `DATABASE_URL` 环境变量是否正确设置

### 问题 2: 构建失败
**解决方案**: 检查 `package.json` 中的构建脚本是否正确

### 问题 3: 种子数据未创建
**解决方案**: 手动访问 `/api/init` 端点

### 问题 4: 样式加载问题
**解决方案**: 确保 Tailwind CSS 正确配置

## 🔄 更新部署

每次推送代码到主分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

## 📱 移动端优化

项目已完全优化移动端体验：
- 响应式设计
- 触摸友好的交互
- 优化的加载性能

## 🔒 安全性

- 所有 API 路由都有错误处理
- 数据库查询使用参数化语句
- 环境变量安全存储

## 💡 性能优化

- 自动代码分割
- 图片优化
- 数据库连接池
- 缓存策略

## 📈 扩展功能

部署后可以添加的功能：
- 用户认证系统
- 更多搜索引擎
- 自定义主题
- 数据导出功能

---

## 🎉 部署成功！

部署完成后，你将获得：
- 🌐 一个功能完整的导航网站
- 📊 数据库驱动的书签管理
- 🎨 现代化的用户界面
- 📱 完美的移动端体验
- ⚡ 优秀的性能表现

享受你的智能导航网站！🚀