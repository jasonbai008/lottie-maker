# Lottie Maker - Lottie 动画代码生成工具

Lottie Maker 是一个轻量级的前端工具，旨在帮助开发者快速预览、配置并生成可直接嵌入网页的 Lottie 动画代码。它支持将本地 Lottie JSON 文件上传到 GitHub，并生成通过 CDN 加载的嵌入代码。

## ✨ 功能特性

- **实时预览**：支持上传本地 `.json` 格式的 Lottie 文件并立即在页面中查看效果。
- **一键生成代码**：集成 Cloudflare Worker，可将 Lottie 文件自动上传至 GitHub 仓库。
- **CDN 支持**：生成基于 CDN 的嵌入代码，方便在任何网页中快速集成。
- **响应式设计**：完美适配桌面端和移动端。
- **资源导航**：提供 LottieFiles 免费动画资源及 Lottie 转 GIF 工具的快速入口。

## 🛠️ 技术栈

- **前端框架**：Vue 2 (UMD 模式，无需构建)
- **动画引擎**：[lottie-player](https://github.com/LottieFiles/lottie-player)
- **后端逻辑**：Cloudflare Workers (处理 GitHub API 交互)
- **存储方案**：GitHub Repositories (作为 Lottie 文件的托管库)
- **CDN 加速**：基于 GitHub 的自定义域名 CDN

## 📂 项目结构

```text
lottie-maker/
├── assets/           # 静态资源及默认 Lottie JSON 文件
├── lib/              # 核心库文件 (Vue, Lottie Player)
├── workers/          # Cloudflare Worker 源代码
├── favicon.png       # 站点图标
├── index.html        # 主入口页面
└── README.md         # 项目文档
```

## 🚀 快速开始

1. **直接运行**：由于本项目采用 UMD 模式开发，只需在本地使用 Live Server 或任意静态服务器打开 `index.html` 即可。
2. **上传文件**：点击“上传 JSON 文件”按钮，选择您的 Lottie 动画文件。
3. **配置参数**：在右侧面板调整背景颜色、分辨率等。
4. **生成代码**：点击“生成代码”，工具会自动处理上传并展示可复制的 HTML 嵌入片段。

## ⚙️ 配置说明 (Cloudflare Worker)

如果您想部署自己的版本，需要配置 `workers/upload.js` 到 Cloudflare Workers：

1. **环境变量**：在 Cloudflare Worker 控制台中设置 `GITHUB_TOKEN`，该 Token 需具备对目标仓库的写入权限。
2. **仓库配置**：修改 `workers/upload.js` 中的 `OWNER` 和 `REPO` 变量，指向您的 GitHub 账号和仓库。
3. **域名配置**：确保 `index.html` 中的 `workerUrl` 指向您部署的 Worker 地址。

## 📝 许可

MIT License
