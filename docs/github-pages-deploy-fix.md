# GitHub Actions Pages 部署修复方案

## 背景
- 原workflow报错：`Missing download info for actions/upload-artifact@v3`
- 现有`.github/workflows/deploy.yml`中，使用了`actions/upload-pages-artifact@v2`
- GitHub官方推荐流程应使用`actions/upload-artifact@v3`上传构建产物

## 原因
- `actions/upload-pages-artifact@v2`是GitHub Pages专用上传，但某些场景下会导致artifact信息缺失
- 官方推荐用`upload-artifact@v3`上传，`deploy-pages@v4`自动识别`github-pages`命名的artifact

## 解决方案
- 替换上传步骤，使用`actions/upload-artifact@v3`
- 指定artifact名称为`github-pages`
- 其余步骤保持不变

## Mermaid 流程图
```mermaid
flowchart TD
    A[Push to dev/main] --> B[Checkout]
    B --> C[Setup pnpm]
    C --> D[Setup Node.js]
    D --> E[Install dependencies]
    E --> F[Build Vue app]
    F --> G[Upload artifact (upload-artifact@v3)]
    G --> H[Configure GitHub Pages]
    H --> I[Deploy to GitHub Pages (deploy-pages@v4)]
```

## 修正版 `.github/workflows/deploy.yml`
```yaml
name: Deploy Vue App to GitHub Pages

on:
  push:
    branches: [dev, main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build Vue app
        run: pnpm build
        env:
          NODE_ENV: production

      - name: Upload production-ready build files
        uses: actions/upload-artifact@v3
        with:
          name: github-pages
          path: dist

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v4

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 备注
- 确保`dist`目录为构建输出目录
- 可根据需要调整Node版本、pnpm版本
- 该方案兼容GitHub官方最新Pages部署流程