#!/bin/bash

# 智能导航项目 - Vercel 一键部署脚本

echo "🚀 开始部署智能导航项目到 Vercel..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录 Vercel..."
    vercel login
fi

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npm run db:generate

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

# 初始化数据库（如果需要）
echo "🗄️ 初始化数据库..."
read -p "是否需要初始化数据库？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "请输入部署后的 URL: " url
    curl -X POST "$url/api/init"
    echo "✅ 数据库初始化完成"
fi

echo "🎉 部署完成！"
echo "📊 访问 Vercel 仪表板查看部署状态"
echo "🔗 如果需要自定义域名，请在 Vercel 设置中配置"