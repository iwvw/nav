# 智能导航 - 优化的个人主页

一个现代化的个人导航页面，基于 Next.js 15 构建，具有丰富的功能和优雅的用户体验。

## ✨ 特性

### 🎯 核心功能
- **智能搜索** - 支持多个搜索引擎，包括 Google、百度、Bing、DuckDuckGo 等
- **书签管理** - 完整的书签管理系统，支持分类、添加、删除
- **实时天气** - 显示当前天气信息
- **动态背景** - 美丽的背景图片，每30秒自动切换
- **时间显示** - 实时时间和日期显示，带有智能问候语

### 🎨 用户界面
- **响应式设计** - 完美适配桌面和移动设备
- **深色/浅色主题** - 支持主题切换
- **现代UI组件** - 使用 shadcn/ui 组件库
- **流畅动画** - 优雅的过渡效果和微交互
- **毛玻璃效果** - 现代的视觉设计

### ⚡ 性能优化
- **Next.js 15** - 最新的 React 框架
- **TypeScript** - 类型安全的开发体验
- **数据库集成** - 使用 Prisma 和 SQLite
- **API 路由** - RESTful API 设计
- **代码分割** - 优化的加载性能

## 🚀 技术栈

### 前端
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Lucide React** - 图标库
- **next-themes** - 主题管理

### 后端
- **Next.js API Routes** - 后端 API
- **Prisma** - ORM 数据库工具
- **SQLite** - 轻量级数据库

### 开发工具
- **ESLint** - 代码质量检查
- **TypeScript** - 静态类型检查
- **Nodemon** - 开发服务器热重载

## 🚀 快速开始

### 🌐 一键部署到 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nav-optimized)

点击上方按钮，即可一键部署到 Vercel 平台，无需配置！

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 💻 本地开发

#### 环境要求
- Node.js 18+
- npm 或 yarn

#### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd nav-optimized
```

2. **安装依赖**
```bash
npm install
```

3. **设置数据库**
```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 填充初始数据
npm run db:seed
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 `http://localhost:3000`

## 🎮 使用指南

### 搜索功能
1. 在搜索框中输入关键词
2. 选择搜索引擎（点击下方的引擎按钮）
3. 按回车或点击搜索按钮

### 书签管理
1. 点击右上角的书签图标
2. 在弹出的侧边栏中管理书签
3. 点击"添加"按钮创建新书签
4. 点击删除按钮移除不需要的书签

### 设置选项
1. 点击右上角的设置图标
2. 调整主题、天气显示、书签功能等设置
3. 选择默认搜索引擎

## 🏗️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── bookmarks/     # 书签 API
│   │   ├── search-engines/ # 搜索引擎 API
│   │   └── settings/      # 设置 API
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── dynamic-background.tsx # 动态背景
│   ├── loading-skeleton.tsx   # 加载动画
│   └── theme-provider.tsx     # 主题提供者
├── hooks/                # React Hooks
├── lib/                  # 工具库
└── styles/               # 样式文件

prisma/
├── schema.prisma         # 数据库模式
└── seed.ts              # 数据库种子文件
```

## 🔧 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码质量检查

# 数据库
npm run db:generate      # 生成 Prisma 客户端
npm run db:push          # 推送数据库模式
npm run db:migrate       # 运行数据库迁移
npm run db:seed          # 填充初始数据
npm run db:reset         # 重置数据库
```

## 🎨 自定义配置

### 添加新的搜索引擎
编辑 `prisma/seed.ts` 文件，在 `searchEngines` 数组中添加新的搜索引擎：

```typescript
{ name: '引擎名称', url: 'https://example.com/search?q=', icon: '🔍', position: 6 }
```

### 修改背景图片
编辑 `src/components/dynamic-background.tsx` 文件，更新 `backgrounds` 数组中的图片 URL。

### 自定义主题
修改 `tailwind.config.js` 文件中的主题配置。

## 📊 性能优化

- **代码分割** - 自动分割页面和组件
- **图片优化** - Next.js 自动优化图片
- **缓存策略** - API 响应缓存
- **懒加载** - 组件和资源懒加载
- **压缩** - 自动压缩静态资源

## 🔒 安全性

- **输入验证** - API 输入验证和清理
- **CSRF 保护** - Next.js 内置 CSRF 保护
- **类型安全** - TypeScript 提供类型安全
- **SQL 注入防护** - Prisma ORM 防护

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 创建 Pull Request

---

**享受您的智能导航体验！** 🚀