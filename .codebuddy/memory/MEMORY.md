# 项目长期记忆

## 项目：个人网站（MyPersonalSite）

技术栈：Vite 8 + Vue 3（`<script setup>`）+ Tailwind CSS v4（`@tailwindcss/vite`，无 `tailwind.config.js`，设计令牌写在 `src/style.css` 的 `@theme` 中）。纯 JS，未使用 TypeScript。

命令：
- `npm run dev` → `http://localhost:5173`（Vite 绑 `::1`，`127.0.0.1` 不通）
- `npm run build` / `npm run preview`

## 目录约定（分层不可混）

- `src/layouts/` 布局层：`PageLayout.vue` 负责分栏、抽屉、焦点与滚动锁定
- `src/components/` 导航层与容器层：`Sidebar.vue`（桌面与抽屉共用同一组件）、`MobileMenuButton.vue`、`SectionShell.vue`
- `src/components/sections/` 板块视图 + `index.js` 注册表（`resolveSectionComponent(id)`）。**新增板块必须在这里登记**，否则 `PageLayout` 的开发期校验会 `console.warn` 列出缺失 id
- `src/content/` 内容数据层，每个板块一个 js 文件；`content/index.js` 的 `sections` 数组顺序即导航顺序
- `content/experience.js` 有两条时间线：`items`（工作履历）与 `social`（**社会实践**：社区/开源/公益），**字段必须保持一致**（period / company / role / desc / highlights）。`Experience.vue` 右上角是**左上 / 右下错位互换**：容器 `h-11 w-24`，两个 `<span pointer-events-none>` 各 `w-14 h-9`；选中项 `translate-x-0 translate-y-0` + 深色 + `opacity-100`，另一项 `translate-x-10`（40px）+ `translate-y-1` + 浅色 + `opacity-45`；位移/颜色/透明度共用 `duration-[900ms]` 同时进行（用户嫌 560ms 太快看不清、64px 间距太远）。**是纯平面位置交换，不要再引入 perspective / translateZ / rotateY / backface-visibility**。切换由容器 `role="button" tabindex="0"` 承担（两个 span 必须 `pointer-events-none`，否则重叠时只有上层能点）。**不要任何边框 / 底边线 / 背景 / 圆角 / 阴影**（用户逐项否掉过）
- `src/composables/` 状态逻辑：`useActiveSection`（滚动联动）、`useNavigation`（选中/展开状态机）、`useDrawer`（抽屉开关 / 焦点 / 滚动锁 / Esc）、`useMediaQuery`

## 稳定设计决策

- 横向分栏断点：`(min-width: 900px) and (min-aspect-ratio: 1/1)`；窄屏不渲染侧栏 `<aside>`。
- 折叠动画统一用 `grid-template-rows: 0fr/1fr`，不用 `max-height`。
- 滚动高亮用「贴近视口顶部的单判定线 + 最后一个越过者」，判定线 = `min(视口高 × 0.16, 160px)`，`scrollY ≤ 4` 时强制第一板块；不用 IntersectionObserver，也不用 30% 那类偏低的比例（大屏会误判到下一块）。
- 导航项二次点击 = toggle 展开（2026-11-11 用户明确确认保留，不必再问）；侧栏不显示展开箭头。
- **视觉风格：博客式横向线条分割**。内容板块一律 `border-t border-line` + 留白，不使用卡片（无圆角、无四边框、无内容色块）；行列表用 `divide-y`。只有控件（如汉堡按钮）保留边框圆角。

## 主题

当前为**灰白主题（纯灰阶，无任何彩色）**，2026-11-11 分两步确定：先深色 → 明亮 → 再收为灰白。

- 页面底 `#fafafa`，侧栏纯白，`ink-800 #f4f4f5` 作浅块，`line = rgba(24,24,27,0.08)`
- **accent / mint 令牌已全部降为中性灰**（`accent-400 #52525b`、`accent-500 #27272a`、`mint-400 #71717a`），只是工具类别名，不再产生彩色
- 无渐变光晕、无彩色选区；链接靠**下划线**而非颜色区分
- 组件内文字用 slate 色阶（标题 900/800、正文 600、弱化 400/500）

**不要擅自加回彩色**（强调色、渐变、彩色标签）。若要改回深色或加明暗切换：需同时改 `@theme` 令牌与组件内 slate 阶（`slate-900`↔`slate-100`），不能只改令牌。

## 版式（Minimal Editorial）

用户参照 `nularui-preview.web.app/templates/sidefolio-portfolio/` 选定了极简编辑排版风，2026-11-11 全面落地：

- 侧栏宽 **304px**（`grid-cols-[19rem_minmax(0,1fr)]`），抽屉同为 `w-[19rem]`；头像 `size-20`、导航文字 `0.95rem`、高亮竖条 3px
- 导航项**没有圆角**，高亮是**单个滑动块**：`ul` 内一个 absolute 层（左深右淡渐变底 + 2px `bg-slate-900/[0.3]` 竖条），靠 `translateY(button.offsetTop)` 在选中项之间滑动，`transition-[transform,height,opacity] 300ms`。不要再改回「每个导航项各自 opacity 淡入」，那是旧实现
- 导航间距用 `li` 的 `pb-1.5`，**不要用 `space-y`**（margin 会干扰绝对定位滑块）；button 加 `relative z-10` 压在滑块之上
- `prefers-reduced-motion` 里只禁用 `animation-*`，**不要**再全局压 `transition-duration`——那会让系统开启「减少动效」的用户整站看不到折叠动画
- 内容栏宽固定 **864px**（`max-w-[54rem]`），左右内边距 `sm:px-10`，桌面上下留白 `py-16`；不要把栏宽改回 720px、也不要把侧栏改回 272px（用户觉得全屏时留空过大、左侧太窄）
- 板块标题 **28px（<640px）/ 32px（≥640px）**，`leading-[1.08]` + `tracking-[-0.03em]`；用户嫌 36/40px 偏大并主动缩小两档，**不要再调回去**
- 每个板块头部**只有一个大标题**：没有编号、没有英文眉标、没有胶囊标签、**没有副标题**（用户在 2026-11-11 逐次要求全部删掉，不要以任何形式加回装饰性小字）
- 六个板块标题统一为**四个汉字**，顺序由 `content/index.js` 的 `sections` 数组决定（改顺序只动这一行）：个人总览 / 作品展示 / 工作履历 / 核心技能 / 自我评价 / 联系方式（导航项与抽屉共用同一 `title` 字段）
- **板块整块区域可点击展开/收起**（`SectionShell` 的 `handleSectionClick`）：排除链接/按钮/表单控件、排除 `#panel-*` 详细内容区、正在选字时不触发；加号按钮用 `@click.stop` 独立处理
- 折叠动画规格：高度 `grid-template-rows 0fr→1fr` **420ms** + `cubic-bezier(0.32,0.72,0,1)`；内容只做 **opacity 340ms 淡入，不要加 translateY 位移**（用户明确否掉）。别再调短时长，用户嫌 300ms 不明显
- 正文基准 `1rem / 1.85`，小字不低于 `0.72rem`
- 内容文案为**第一人称口语句**，不是第三人称简历体
- 板块用 `border-t` 分隔，无卡片容器、无阴影、无内容底色
- **末尾板块用最小高度撑满最后一屏**：`min-h-[calc(100dvh - 4.5rem)]`（见 `PageLayout.vue` 的 `lastSectionClass`，4.5rem 是页脚高度），保证「最后一块上边界贴顶 ⇔ 页面滚到底」。别再减 `scroll-margin-top`（会让分界线停在离顶一段距离处），也不要改回固定高度的空白块（用户明确不要多余空白），更不能删掉（否则高亮会回退/跳块）
- 侧栏底部只有一行版权，**没有 slogan / 签名句**（用户 2026-11-11 要求删除，不要再加）
- `style.css` 顶部有 `@source not "../.codebuddy"` 与 `@source not "../dist"`：防止记忆文件、旧构建产物里的类名被 Tailwind 当候选类编译进 CSS，**不要删除**（去掉 dist 这条会让产物每轮自我膨胀约 1.3KB）

## Tailwind v4 陷阱（务必记住）

v4 的位移 / 缩放 / 旋转工具类使用**独立 CSS 属性**，不再是 `transform`：

- `translate-x-*` / `translate-y-*` → `translate`
- `scale-*` → `scale`
- `rotate-*` → `rotate`

所以给这些类做过渡时，`transition-[transform]` **无效**，必须写成对应的属性名，例如 `transition-[translate,color,opacity]`。只有内联 `style="transform: ..."` 或自写 CSS 里的 `transform` 才用 `transition-transform`。用 `transition-all` 则不必区分。

## 文档与截图

- `README.md` 已存在，含 5 张配图（`docs/screenshots/`）、功能实现分布表、关键实现说明、内容维护指南。改功能后需同步更新其中「功能与实现分布」表。
- **截图方法（不装 playwright）**：系统有 Chrome，用 CDP 直连即可——`chrome --headless=new --remote-debugging-port=9333 --user-data-dir=<temp>`，Node 24 的全局 `WebSocket` 连 `/json/list` 的 `webSocketDebuggerUrl`；`Emulation.setDeviceMetricsOverride` 控视口、`Runtime.evaluate` 做点击、`Page.getLayoutMetrics` + `captureBeyondViewport` 出整页图。
- **禁止用加高窗口拍全页**：窗口高 > 宽会触发 `min-aspect-ratio: 1/1` 降级，侧栏消失。必须保持 1440×900 视口再用 `clip` 扩展。

## 待办

- `src/content/*.js` 全部是示例占位内容，需替换为真实资料；侧栏头像是首字母占位（`profile.initials`），替换真实照片需改 `Sidebar.vue` 为 `<img>`。
