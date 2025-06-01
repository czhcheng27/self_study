1. 问题识别（Identify Performance Bottlenecks）
   “在大型项目中，性能问题通常来源于多个层面。我会从前端加载性能、运行时性能、网络请求、和后端协作几个维度进行定位和分析。”

举例工具：Chrome DevTools、Lighthouse、WebPageTest、React Profiler 等。

2. 解决策略（Optimization Techniques）
   可以按场景分类讲述具体做法：

A. 首屏加载性能优化

- 使用 Code Splitting（如 React.lazy + Suspense 或 Next.js 动态导入）

- 静态资源压缩（Webpack gzip/brotli）

- 图片懒加载（loading="lazy"）、使用 WebP 格式

- 使用 CDN 加速资源加载

- SSR/SSG（Next.js）加快 TTFB，提升 SEO 和首屏体验

B. 渲染性能优化（运行时）

- 减少不必要的 re-render（React.memo、useMemo、useCallback）

- 虚拟化长列表（如 react-window、react-virtualized）

- DOM 操作合并（例如避免 layout thrashing）

C. 网络请求优化

- 请求合并（batching）、缓存策略（如 SWR、React Query）

- 减少不必要的 API 请求（懒加载、滚动加载）

- 使用 HTTP/2 或 GraphQL 减少请求次数

D. 状态管理与数据处理

- 区分全局状态与局部状态，避免过度使用重型库（如 Redux）

- 使用更轻量的状态方案：Zustand、Jotai、Recoil 等

---

“SSR（服务器端渲染）能加快首屏加载、利于 SEO，而 CSR（客户端渲染）更适合交互性强、首屏依赖登录或用户数据的场景。”

| 维度           | SSR 适合                         | CSR 适合                   |
| -------------- | -------------------------------- | -------------------------- |
| SEO 要求       | ✅（如博客、电商）               | ❌（需配合预渲染）         |
| 首屏加载速度   | ✅（服务器预渲染 + TTFB 优势）   | ❌（白屏时间较长）         |
| 动态个性化内容 | ❌（需做缓存控制、打补丁）       | ✅（运行在客户端）         |
| 技术复杂度     | ❌（服务端部署、缓存管理更复杂） | ✅（部署简单，纯静态资源） |
