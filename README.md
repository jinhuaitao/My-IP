# 🌐 IP 信息查询工具 - Cloudflare Worker

一个基于 Cloudflare Workers 的 IP 信息查询服务，能够实时显示用户的网络连接信息，包括 IP 地址、地理位置、运营商信息等。

## ✨ 功能特性

- 🌍 **完整的 IP 信息展示** - IP 地址、地理位置、运营商、网络节点等
- 📱 **智能响应** - 浏览器访问显示美观的 HTML 页面，命令行访问返回格式化文本
- ⚡ **高性能** - 基于 Cloudflare Workers 边缘计算，全球加速
- 🔧 **多 API 端点** - 支持多种数据格式和特定信息查询
- 🎨 **响应式设计** - 支持移动端和桌面端访问

## 📋 API 端点

| 端点 | 功能 | 返回格式 |
|------|------|----------|
| `/` 或 `/index.html` | 主页面，完整信息展示 | HTML/Text |
| `/ip` | 仅返回 IP 地址 | Text |
| `/myipv4addr` | 返回带节点信息的 JavaScript | JavaScript |
| `/mycfedge` | 返回 Cloudflare 节点信息 | JavaScript |
| `/asn` | 返回自治系统号 | Text |
| `/colo` | 返回 Cloudflare 节点 | Text |
| `/generate_204` | 返回 204 状态码 | 无内容 |

## 🚀 快速开始

### 方式一：使用 Wrangler CLI（推荐）

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare 账户**
   ```bash
   wrangler login
   ```

3. **部署 Worker**
   ```bash
   wrangler deploy
   ```

### 方式二：使用 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages 页面
3. 点击 "Create Application" → "Create Worker"
4. 将 `cloudflare-worker.js` 的内容复制到编辑器中
5. 点击 "Deploy" 部署

### 方式三：使用 GitHub Actions（自动化部署）

创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

## 🔧 配置说明

### 环境变量（可选）

可以在 `wrangler.toml` 中配置环境变量：

```toml
name = "ip-info-worker"
compatibility_date = "2024-01-01"

[vars]
SERVICE_NAME = "IP 信息查询工具"
VERSION = "1.0.0"
```

### 自定义域名

1. 在 Cloudflare Dashboard 中为 Worker 添加自定义域名
2. 或编辑 `wrangler.toml`：

```toml
routes = [
  { pattern = "ip.example.com", custom_domain = true }
]
```

## 📊 使用示例

### 浏览器访问
访问部署后的 Worker URL，将看到美观的信息展示页面。

### 命令行使用

```bash
# 获取完整信息
curl https://your-worker.your-subdomain.workers.dev/

# 仅获取 IP 地址
curl https://your-worker.your-subdomain.workers.dev/ip

# 获取 ASN 信息
curl https://your-worker.your-subdomain.workers.dev/asn

# 获取节点信息
curl https://your-worker.your-subdomain.workers.dev/colo
```

### 在网页中嵌入

```html
<!-- 显示 IP 地址 -->
<div id="ipv4addr"></div>
<script src="https://your-worker.your-subdomain.workers.dev/myipv4addr"></script>

<!-- 显示 Cloudflare 节点 -->
<div id="cfedge"></div>
<script src="https://your-worker.your-subdomain.workers.dev/mycfedge"></script>
```

## 🛠️ 开发指南

### 本地开发

```bash
# 启动本地开发服务器
wrangler dev

# 在浏览器中打开 http://localhost:8787 测试
```

### 测试 API

```bash
# 测试主页面
curl http://localhost:8787/

# 测试特定端点
curl http://localhost:8787/ip
curl http://localhost:8787/asn
```

### 项目结构

```
├── cloudflare-worker.js    # Worker 主文件
├── README.md              # 项目说明文档
└── wrangler.toml          # Wrangler 配置文件（可选）
```

## 🔍 技术细节

### 使用的 Cloudflare 请求属性

- `request.cf` - Cloudflare 提供的连接信息
- `request.headers.get("cf-connecting-ip")` - 用户真实 IP
- `request.headers.get("user-agent")` - 用户代理信息

### 智能响应机制

- **浏览器访问**：返回完整的 HTML 页面
- **命令行访问**：返回格式化的纯文本
- **API 调用**：根据端点返回特定格式数据

## 📈 性能优化

- 使用 Cloudflare 全球边缘网络
- 响应内容最小化
- 智能缓存策略
- 支持 HTTP/2 和 HTTP/3

## 🔒 安全考虑

- 不记录或存储用户数据
- 所有信息均为实时查询
- 支持 HTTPS 加密传输
- 遵循 Cloudflare 的安全最佳实践

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

- [Cloudflare Workers](https://workers.cloudflare.com/) - 提供强大的边缘计算平台
- [Cloudflare 中文社区](https://community.cloudflare.com/) - 技术支持与交流

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 提交 [GitHub Issue](https://github.com/your-repo/issues)
- 发送邮件至：your-email@example.com

---

**Happy Coding! 🎉**