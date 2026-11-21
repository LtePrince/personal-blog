# 访客端实现架构

项目使用 Next.js App Router、React 和 TypeScript。页面负责组织视图；本站的 Route Handler 对接 Go 后端并转换响应；客户端组件负责分页、搜索、主题和阅读交互。业务数据经只读 API 获取。

## 页面到后端的路径

| 层 | 输入与输出 |
|---|---|
| `src/app` | 首页与阅读详情使用服务端取数；博客列表交由 `ClientBlog` 在浏览器取数。根布局挂载主题和语言 Provider。 |
| `src/app/api` | 浏览器请求同源 `/api/blog` 或 `/api/columns` 等入口；处理器向 `BLOG_BACKEND_URL/api/v1/...` 发出请求。普通博客在本站路由使用单数 `blog`，Go 后端使用复数 `blogs`。 |
| `src/lib`、`src/types` | SSR 使用 `apiFetch` 以 `NEXT_PUBLIC_API_BASE_URL` 为本站 origin 构造绝对 URL。处理器把后端的 `{code,message,data}` 转成 `{success,data}` 或错误，列表保留 `total`。博客 ID 转成字符串，章节时间由 `updated_at` 转成 `updatedAt`。 |
| `src/components`、`src/contexts` | 展示组件消费前端类型。`ThemeContext` 同步 HTML 主题与本地存储；`LocaleContext` 控制当前界面语言，初始值来自 `siteConfig`。 |

SSR 的本站 origin 和后端 origin 是不同配置项。正文中的 `/static/...` 图片请求通过 Next rewrite 转发到后端的同名路径，由后端判断公开范围。[API 客户端](../../src/lib/api.ts) · [博客列表适配](../../src/app/api/blog/route.ts) · [专栏类型转换](../../src/lib/columns.ts) · [静态资源转发](../../next.config.ts)

## 两条主要读取链路

**首页混排。** `getLatestFeed` 并行请求最近 10 篇博客和第一页专栏（上限 100 栏），然后逐栏并行获取目录。`buildFeed` 把博客和各章映射为 `FeedItem`，按 `sortAt` 降序后截取 10 条。旧博客的排序时间依次回退到创建时间、文章日期、0；旧后端缺少章节时间时回退到专栏时间。首页和详情使用动态渲染，相关请求指定 `no-store`。[页面取数](../../src/app/home/page.tsx) · [混排实现](../../src/lib/feed.ts)

**章节阅读。** 动态路由用专栏和章节两个 slug 请求详情，适配出专栏摘要、完整目录、当前正文与相邻章节。`ColumnReader` 控制导航，普通文章与章节共用 `Markdown`。GFM 与数学语法由 remark 插件解析；rehype 依次生成标题锚点、清理 HTML、渲染 KaTeX。文内目录读取实际渲染的标题元素。普通博客详情另挂载 Giscus，按 pathname 区分讨论。[章节组件](../../src/components/column/ColumnReader.tsx) · [正文渲染](../../src/components/common/Markdown.tsx) · [评论组件](../../src/components/common/Comments.tsx)

## 验证与发布

改排序时检查旧博客更新后的位置、仅更新 B 时 A 的位置、旧数据缺少时间字段的回退。改正文渲染时检查公式、代码、锚点及图片路径。可在仓库内执行 `npx tsc --noEmit --incremental false` 和 `npm run lint`。生产工作流由 `vX.Y.Z` 版本标签触发，执行依赖安装与 Next 构建，打包后切换发布目录并通过 PM2 启动。合入 `main` 后，按部署任务核对标签指向的提交和线上页面。[生产工作流](../../.github/workflows/main.yaml) · [功能设计](../design/features.md) · [视觉设计](../design/visual.md)
