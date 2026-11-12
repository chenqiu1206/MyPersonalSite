/**
 * 板块：联系方式
 * 说明：示例占位内容。href 为 null 时按纯文本展示，不做成可点击链接。
 */
export default {
  id: 'contact',
  title: '联系方式',
  summary:
    '邮件是我回得最快的渠道，一般 24 小时内给你答复。要约沟通，建议把背景和你想要的结果先写给我，这样能省掉一轮来回。',
  channels: [
    {
      label: '电子邮箱',
      value: 'chenqiu1206@163.com',
      href: 'mailto:chenqiu1206@163.com',
      hint: '首选方式，24 小时内回复',
    },
    {
      label: 'GitHub',
      value: 'github.com/example',
      href: 'https://github.com/',
      hint: '开源项目与代码沉淀',
    },
    {
      label: '所在城市',
      value: '杭州 · 支持远程',
      href: null,
      hint: '可跨时区协作',
    },
  ],
  note: '如需简历 PDF 或完整作品集，请在邮件里说明，我会尽快回你。',
}
