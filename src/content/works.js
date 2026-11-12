/**
 * 板块：作品展示
 * 说明：示例占位内容。href 为 null 时不渲染外链。
 */
export default {
  id: 'works',
  title: '作品展示',
  summary:
    '这些是我能公开讲的项目：一个组件库、两块数据看板，还有一次把页面性能拉回来的治理专项。细节都可以邮件聊。',
  items: [
    {
      name: 'Lumen UI 组件库',
      year: '2024',
      role: '发起人 · 核心开发',
      desc: '面向中后台场景的 Vue 3 组件库，包含 38 个组件与完整的设计令牌方案，支持主题定制与暗色模式。',
      tags: ['Vue 3', 'TypeScript', 'Vite', '设计令牌'],
      metrics: [
        { label: '组件数', value: '38' },
        { label: '接入项目', value: '12' },
        { label: '单测覆盖', value: '86%' },
      ],
      href: 'https://github.com/',
    },
    {
      name: '运营数据看板',
      year: '2023',
      role: '前端负责人',
      desc: '面向运营团队的多维数据看板，支持自定义指标卡、拖拽布局与十万级数据点渲染优化。',
      tags: ['ECharts', '虚拟滚动', 'Web Worker'],
      metrics: [
        { label: '首屏渲染', value: '1.4s' },
        { label: '数据量', value: '10w+' },
      ],
      href: null,
    },
    {
      name: '页面性能治理专项',
      year: '2023',
      role: '方案设计与落地',
      desc: '针对存量项目做打包体积与加载链路治理，建立体积预算与回归卡点，避免劣化回潮。',
      tags: ['构建优化', '性能预算', 'CI'],
      metrics: [
        { label: '体积下降', value: '32%' },
        { label: 'LCP', value: '1.8s' },
      ],
      href: null,
    },
    {
      name: '活动页搭建平台',
      year: '2021',
      role: '核心开发',
      desc: '可视化拖拽搭建活动页，内置物料库与模板市场，支持多地区多语种一键发布。',
      tags: ['拖拽编排', 'Schema', '多语言'],
      metrics: [
        { label: '交付提速', value: '3.3x' },
        { label: '上线页面', value: '60+/年' },
      ],
      href: null,
    },
  ],
}
