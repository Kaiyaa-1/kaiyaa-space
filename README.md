# kaiyaa-space

Kaiyaa 的个人主页 — 记录书影音、展示炉石卡组，UI 风格参考豆瓣。

## 功能

- **我读 / 我看 / 我听** — 书籍、电影、音乐记录，支持评分、状态、评论、多图/视频
- **炉石酒馆** — 卡组收藏，一键复制卡组代码
- **站长模式** — 隐藏管理后台，支持 CRUD、板块可见性控制、公开/私密内容

## 技术栈

- [Vite](https://vitejs.dev/) — 构建工具
- [Tailwind CSS](https://tailwindcss.com/) — 样式（预编译，非 CDN 运行时）
- [Supabase](https://supabase.com/) — 数据库 + 文件存储
- [Lucide](https://lucide.dev/) — 图标

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量并填写配置
cp .env.example .env

# 本地开发
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

构建产物在 `dist/` 目录，可部署到 GitHub Pages、Netlify、Vercel 等静态托管平台。

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL |
| `VITE_SUPABASE_KEY` | Supabase anon / publishable key |
| `VITE_ADMIN_PASSWORD` | 站长登录暗号 |

## Supabase 数据库结构

### `media_items`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| type | text | reading / watching / listening |
| title | text | 作品名称 |
| author | text | 作者/导演 |
| status | text | wish / doing / collect |
| rating | int | 1-5 评分 |
| comment | text | 短评 |
| file_url | text | 图片/视频 URL（JSON 数组） |
| is_public | boolean | 是否公开 |
| created_at | timestamptz | 创建时间 |

### `hearthstone_decks`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| deck_name | text | 卡组名称 |
| deck_code | text | 卡组代码 |
| class_name | text | 职业 |
| mode | text | 标准/狂野/竞技场 |
| description | text | 简介 |
| image_url | text | 图片/视频 URL（JSON 数组） |
| is_public | boolean | 是否公开 |
| created_at | timestamptz | 创建时间 |

### `site_settings`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 固定为 1 |
| reading_visible | boolean | 书单板块可见 |
| watching_visible | boolean | 电影板块可见 |
| listening_visible | boolean | 音乐板块可见 |
| hearthstone_visible | boolean | 炉石板块可见 |

### Storage

- Bucket 名称：`uploads`
- 路径：`public/{filename}`

## 安全说明

当前站长认证为客户端暗号验证，适合个人站点快速使用。生产环境建议：

1. 启用 Supabase **Row Level Security (RLS)**，限制写入/删除权限
2. 迁移到 **Supabase Auth** 或 Edge Function 做服务端鉴权
3. 站长密码通过环境变量配置，不要提交到 Git

## 项目结构

```
├── index.html          # 页面入口
├── src/
│   ├── main.js         # 应用入口
│   ├── style.css       # Tailwind + 自定义样式
│   ├── state.js        # 全局状态
│   ├── api/            # Supabase 数据操作
│   ├── render/         # 列表渲染（含 XSS 转义）
│   ├── ui/             # 侧边栏、表单、预览
│   └── lib/            # 工具函数（toast、auth、router 等）
├── .env.example
└── vite.config.js
```

## 本次优化内容

- Vite + Tailwind 预编译构建，替代 CDN 运行时
- 代码模块化拆分，便于维护
- 全站 XSS 转义，防止注入
- 环境变量管理 Supabase 凭证和站长密码
- Toast 通知替代 alert，自定义确认框替代 confirm
- URL Hash 路由（`#reading`、`#hearthstone` 等），支持分享链接
- 登录/登出无刷新，局部更新数据
- 全板块 loading 状态
- 炉石视频 hover 播放，减少 CPU 占用
- 移动端侧边栏遮罩层
