@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   AstrBot AI 助手 - Vercel 一键部署脚本
echo ============================================
echo.

REM 检查是否已安装 Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [安装] 正在安装 Vercel CLI...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo [错误] 安装 Vercel CLI 失败
        pause
        exit /b 1
    )
)

REM 检查是否已登录 Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo [登录] 请先登录 Vercel...
    vercel login
    if %errorlevel% neq 0 (
        echo [错误] 登录失败
        pause
        exit /b 1
    )
)

echo.
echo [提示] 部署前需要配置以下环境变量:
echo   - ASTRBOT_API_URL: 你的 AstrBot API 地址
echo   - ASTRBOT_API_KEY: 你的 AstrBot API Key
echo.

echo [部署] 开始部署...
vercel --prod

if %errorlevel% neq 0 (
    echo [错误] 部署失败
    pause
    exit /b 1
)

echo.
echo ============================================
echo   部署完成!
echo ============================================
echo.
echo [重要] 请在 Vercel 控制台设置环境变量:
echo   1. 访问 https://vercel.com/dashboard
echo   2. 选择你的项目
echo   3. 进入 Settings -^> Environment Variables
echo   4. 添加:
echo      - ASTRBOT_API_URL: 你的 AstrBot API 地址
echo      - ASTRBOT_API_KEY: 你的 AstrBot API Key
echo.
echo [提示] 设置完成后需要重新部署: vercel --prod
echo.
pause
