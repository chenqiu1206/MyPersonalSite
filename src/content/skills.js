/**
 * 板块：核心技能
 * 说明：示例占位内容。level 用于展示熟练度进度条（0-100）。
 */
export default {
  id: 'skills',
  title: '核心技能',
  summary:
    '我主要用 Vue 3 和 TypeScript 干活，从组件体系到构建链路都自己趟过一遍。样式上偏爱用设计令牌约束出来的原子化方案，而不是一层层覆盖。',
  groups: [
    {
      name: '前端框架',
      items: [
        { name: 'Vue 3 · Composition API', level: 95, note: '熟悉响应式原理、渲染机制与性能边界' },
        { name: 'TypeScript', level: 88, note: '类型建模、泛型约束与工程配置治理' },
        { name: 'React · Hooks', level: 75, note: '可独立承担中型项目开发' },
      ],
    },
    {
      name: '样式与交互体验',
      items: [
        { name: 'Tailwind CSS', level: 92, note: '设计令牌驱动的原子化样式体系' },
        { name: 'CSS 布局与动效', level: 86, note: '布局稳定性、过渡曲线与可访问性' },
        { name: '可视化 · ECharts', level: 78, note: '看板搭建与大数据量渲染优化' },
      ],
    },
    {
      name: '工程化与协作',
      items: [
        { name: 'Vite · 构建优化', level: 86, note: '分包策略、冷启动与产物体积治理' },
        { name: 'Node.js · BFF', level: 72, note: '接口聚合与轻量服务开发' },
        { name: '测试 · Vitest / Playwright', level: 68, note: '冒烟与回归用例设计' },
      ],
    },
  ],
}
