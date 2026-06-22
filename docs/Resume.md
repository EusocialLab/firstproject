我担心page.tsx以后会越来越大，比如const legacyStars: LegacyStar[]里的description: 'A quiet star near the horizon.',以后会扩展成长文本，而且以后还会在该长文本内加链接more，点击以后会出现一段更长的文本。还有就是点击 id: 'star-6' 这个Button的时候会跳出Google账户登录框。根据以后该页面的功能扩展，你准备怎么refactor [page.tsx] into smaller presentational and logic components

根据你的扩展计划，我建议分解 page.tsx 成以下结构。这样既符合 300 行限制，又预留了未来功能扩展的空间

具体分割方案：

src/constants/stars.ts — 星点数据配置

legacyStars 数组
imageSize、legacyCopyPoint
类型定义（LegacyStar、Size）
src/hooks/useStarField.ts — 状态和坐标映射逻辑

mapImagePointToContainer() 函数
useStarField() Hook 管理容器大小、悬停状态
返回计算后的位置和状态
src/components/stars/Star.tsx — 单个星点按钮

接收 star、mapped、onHover、onUnhover、onClickAction
渲染按钮、发光效果
处理 Google 登录触发或故事展开
src/components/stars/StarTooltip.tsx — 悬停提示

接收 position、content
简单的定位和显示逻辑
src/components/stars/StarField.tsx — 星田容器

使用 useStarField() Hook
遍历 legacyStars 渲染 <Star> 组件
管理背景和 CSS 动画
src/components/legacy/LegacyCopy.tsx — 右下角文本

接收 position
纯展示组件
src/components/modal/StoryModal.tsx — 扩展文本模态框

显示长文本和链接
支持嵌套故事或额外内容
src/features/authentication/GoogleAuthButton.tsx — Google 登录触发

点击时调用登录逻辑
可配置哪个星点触发登录
page.tsx — 轻量页面入口

组装 <StarField>、<LegacyCopy> 等
管理模态框状态（是否显示故事详情）
这样设计的好处：

✅ 每个组件 < 300 行
✅ UI 和逻辑分离（Hook 负责逻辑、Component 负责渲染）
✅ 易于添加长文本、链接、Google 登录等功能
✅ 数据与展示分离
✅ 符合 ARCHITECTURE.md 规则
需要我开始创建这些文件吗？