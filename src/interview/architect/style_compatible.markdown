✅ 一、预防措施（提前避免兼容性问题）

1. 使用 CSS 兼容性好的属性和写法
   优先使用主流标准属性，避免使用实验性（experimental）属性。

查阅 MDN 或 Can I use 查询属性的浏览器支持情况。

2. 使用 CSS 预处理器 / 后处理器
   使用 PostCSS + Autoprefixer 自动添加厂商前缀（如 -webkit-、-moz- 等）。
   npm install postcss autoprefixer

3. 选择现代框架和 UI 库
   使用如 Tailwind CSS、Bootstrap、MUI 等经过兼容性处理的 UI 框架，减少原生 CSS 的兼容问题。

React / Vue / Next.js 等框架通常也封装了部分浏览器兼容性处理。

4. 使用 CSS Reset / Normalize.css
   可消除不同浏览器默认样式差异：
   bash: npm install normalize.css
   js: import 'normalize.css';

🔧 二、补救措施（发现问题后的处理）

1. 检测兼容性问题
   手动使用主流浏览器测试：Chrome、Safari、Firefox、Edge。

使用浏览器的开发者工具（F12）查看报错或不兼容的样式。

使用自动化工具如 BrowserStack、Lambdatest 做多浏览器测试。

2. 添加厂商前缀
   兼容老旧浏览器时可手动或自动添加：

   ```css
   .example {
     -webkit-transform: rotate(45deg); /* Safari/Chrome */
     -moz-transform: rotate(45deg); /* Firefox */
     transform: rotate(45deg); /* 标准 */
   }
   ```

3. 使用特定 Hack 技巧（仅作为最后手段）
   比如使用 \* 或 \_ 选择器 Hack IE6/7，或 @supports 条件样式支持新属性：

   ```css
   @supports (display: grid) {
     .container {
       display: grid;
     }
   }
   ```

4. 针对不同浏览器做兼容性分支
   使用 JS 检测用户代理或功能支持：

```js
if ("flex" in document.body.style) {
  // 支持 flex 的写法
} else {
  // 回退方案
}
```
