# 🎰 双色球随机抽号器

一个美观的双色球随机号码生成器，支持单注/批量生成、历史记录和号码统计。

## ✨ 功能特点

- 🎱 单注/批量生成双色球号码（1-100注）
- 📊 历史记录保存与查看
- 📈 号码出现频率统计图表
- 📱 完美支持手机端，可添加到桌面
- 🌙 深色主题，彩票店风格设计
- 💾 数据本地存储，隐私安全

## 🚀 使用方式

### 网页版（推荐）

直接在浏览器中打开 `双色球抽号器.html` 即可使用。

### 手机端使用

1. 将项目部署到任意 Web 服务器
2. 手机浏览器访问对应网址
3. 点击浏览器菜单 → **"添加到主屏幕"**
4. 即可像原生 App 一样使用，支持离线访问

### 本地服务器

```bash
# 使用 Node.js
npx serve .

# 使用 Python
python -m http.server 8000

# 使用 PHP
php -S localhost:8000
```

## 📁 项目结构

```
lottery-app/
├── 双色球抽号器.html    # 主应用文件（单文件应用）
├── manifest.json        # PWA 配置
├── sw.js               # Service Worker（离线支持）
├── main.js             # Electron 主进程（可选）
├── src/                # Electron 相关文件（可选）
└── README.md           # 项目说明
```

## 🛠️ 技术栈

- 纯 HTML/CSS/JavaScript，无需构建
- 使用 `crypto.getRandomValues()` 保证随机性
- PWA 支持，可离线使用
- 响应式设计，适配各种屏幕

## 📱 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- iOS Safari 11+
- Android Chrome 60+

## 📄 许可证

MIT License
