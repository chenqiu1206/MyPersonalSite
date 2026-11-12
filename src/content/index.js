import overview from './overview.js'
import skills from './skills.js'
import contact from './contact.js'
import about from './about.js'
import experience from './experience.js'
import works from './works.js'

/**
 * 内容数据层统一出口。
 * 数组顺序 = 侧栏导航顺序 = 页面板块顺序；增删板块只需在此调整并新增对应文件。
 */
export const sections = [overview, works, experience, skills, about, contact]

/** 板块 id 列表，供滚动联动监听使用 */
export const sectionIds = sections.map((section) => section.id)

/** 站点级元信息 */
export const profile = {
  name: '示例姓名',
  initials: 'YN',
  role: '全栈工程师 / 前端方向',
}
