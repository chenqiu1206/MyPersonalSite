import About from './About.vue'
import Contact from './Contact.vue'
import Experience from './Experience.vue'
import Overview from './Overview.vue'
import Skills from './Skills.vue'
import Works from './Works.vue'

/**
 * 板块 id → 视图组件。
 *
 * 新增板块的完整步骤：
 * 1. 在 `content/` 新建数据文件
 * 2. 在 `content/index.js` 的 `sections` 数组中登记（决定顺序）
 * 3. 在这里登记对应组件
 *
 * 第 2、3 步不一致时，`PageLayout` 会在开发环境给出警告。
 */
export const sectionComponents = {
  about: About,
  contact: Contact,
  experience: Experience,
  overview: Overview,
  skills: Skills,
  works: Works,
}

/** 取不到时返回 null，由调用方决定降级方式 */
export function resolveSectionComponent(id) {
  return sectionComponents[id] ?? null
}
