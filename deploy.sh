#!/bin/bash

# AstrBot AI 助手 - Vercel 一键部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 AstrBot AI 助手 - Vercel 部署"
echo "================================"

# 检查是否已安装 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录 Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录 Vercel..."
    vercel login
fi

echo ""
echo "📋 部署前需要配置以下环境变量:"
echo "   - ASTRBOT_API_URL: 你的 AstrBot API 地址"
echo "   - ASTRBOT_API_KEY: 你的 AstrBot API Key"
echo ""

# 部署
echo "🎯 开始部署..."
vercel --prod

echo ""
echo "✅ 部署完成!"
echo ""
echo "⚠️  重要: 请在 Vercel 控制台设置以下环境变量:"
echo "   1. 访问 https://vercel.com/dashboard"
echo "   2. 选择你的项目"
echo "   3. 进入 Settings -> Environment Variables"
echo "   4. 添加:"
echo "      - ASTRBOT_API_URL: 你的 AstrBot API 地址"
echo "      - ASTRBOT_API_KEY: 你的 AstrBot API Key"
echo ""
echo "🔄 设置完成后需要重新部署:"
echo "   vercel --prod"
