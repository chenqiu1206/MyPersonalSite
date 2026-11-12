<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import MobileMenuButton from '../components/MobileMenuButton.vue'
import SectionShell from '../components/SectionShell.vue'
import Sidebar from '../components/Sidebar.vue'
import { resolveSectionComponent } from '../components/sections'
import { profile, sectionIds, sections } from '../content'
import { useActiveSection } from '../composables/useActiveSection'
import { useDrawer } from '../composables/useDrawer'
import { useMediaQuery } from '../composables/useMediaQuery'
import { useNavigation } from '../composables/useNavigation'

/**
 * 横向分栏的启用条件：视口足够宽，且不是竖长比例。
 * 宽度与纵横比都参与判断，因此平板竖屏、分屏窄窗同样会降级为抽屉导航。
 */
const isWide = useMediaQuery('(min-width: 900px) and (min-aspect-ratio: 1 / 1)')

const { activeId, lockTo, refresh } = useActiveSection(sectionIds)

const {
  expandedMap,
  isExpanded,
  toggleExpanded,
  activateSection,
  activateFromDrawer,
} = useNavigation({ activeId, lockTo })

const {
  drawerOpen,
  close: closeDrawer,
  toggle: toggleDrawer,
  triggerRef: menuButtonRef,
  panelRef: drawerRef,
} = useDrawer()

/**
 * 渲染前把内容数据与视图组件对齐：
 * 组件缺失时该项 component 为 null，模板会跳过渲染。
 */
const sectionList = computed(() =>
  sections.map((section, index) => ({
    section,
    component: resolveSectionComponent(section.id),
    isLast: index === sections.length - 1,
  })),
)

// 开发环境兜底：内容层登记了板块但没登记组件时，立刻能看出来
if (import.meta.env.DEV) {
  const missing = sections
    .filter((section) => !resolveSectionComponent(section.id))
    .map((section) => section.id)
  if (missing.length > 0) {
    console.warn(
      `[sections] 以下板块缺少视图组件，请到 components/sections/index.js 登记：${missing.join(', ')}`,
    )
  }
}

const currentYear = new Date().getFullYear()

/**
 * 最后一块至少撑满一屏（减去页脚高度约 4.5rem）。
 * 这样「作品展示上边界贴到视口顶部」就恰好等于「页面滚到底」，
 * 到顶之后无法再继续下滑；内容超过一屏时以内容为准，仍可正常滚动。
 */
const lastSectionClass = 'min-h-[calc(100dvh_-_4.5rem)]'

let refreshTimer = 0
watch(
  expandedMap,
  () => {
    // 折叠动画结束后页面高度才稳定，此时再校准当前板块
    window.clearTimeout(refreshTimer)
    refreshTimer = window.setTimeout(refresh, 320)
  },
  { deep: true },
)

/* 视口回到横向布局时自动收起抽屉 */
watch(isWide, (wide) => {
  if (wide && drawerOpen.value) closeDrawer()
})

onBeforeUnmount(() => {
  window.clearTimeout(refreshTimer)
})
</script>

<template>
  <div class="relative min-h-dvh">
    <MobileMenuButton
      v-if="!isWide"
      ref="menuButtonRef"
      :expanded="drawerOpen"
      @toggle="toggleDrawer"
    />

    <div
      class="grid min-h-dvh"
      :class="isWide ? 'grid-cols-[19rem_minmax(0,1fr)]' : 'grid-cols-1'"
    >
      <!-- 桌面侧栏：占一列并吸附视口；窄屏不渲染，因此不占页面宽度 -->
      <aside
        v-if="isWide"
        class="sticky top-0 h-dvh self-start border-r border-line bg-white"
      >
        <Sidebar
          :sections="sections"
          :active-id="activeId"
          :is-expanded="isExpanded"
          @activate="activateSection"
        />
      </aside>

      <!-- 右侧主内容：宽度随窗口伸缩 -->
      <main class="min-w-0">
        <div
          class="mx-auto w-full max-w-[54rem] px-5 sm:px-10"
          :class="isWide ? 'py-16' : 'pt-16 pb-24'"
        >
          <div>
            <SectionShell
              v-for="{ section, component, isLast } in sectionList"
              :key="section.id"
              :id="section.id"
              :title="section.title"
              :summary="section.summary"
              :expanded="isExpanded(section.id)"
              :active="activeId === section.id"
              :compact="!isWide"
              :class="isLast ? lastSectionClass : ''"
              @toggle="toggleExpanded(section.id)"
            >
              <component v-if="component" :is="component" :content="section" />
            </SectionShell>
          </div>

          <footer class="mt-6 border-t border-line pt-6 text-[0.7rem] leading-6 text-slate-400">
            <p>© {{ currentYear }} {{ profile.name }}</p>
          </footer>
        </div>
      </main>
    </div>

    <!-- 窄屏抽屉导航 -->
    <Teleport to="body">
      <div v-if="!isWide">
        <Transition name="drawer-mask">
          <div
            v-if="drawerOpen"
            class="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm"
            @click="closeDrawer"
          />
        </Transition>

        <Transition name="drawer-panel">
          <div
            v-if="drawerOpen"
            id="site-drawer"
            ref="drawerRef"
            role="dialog"
            aria-modal="true"
            aria-label="站点导航"
            tabindex="-1"
            class="fixed inset-y-0 left-0 z-50 w-[19rem] max-w-[85vw] border-r border-line bg-ink-950/95 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] outline-none backdrop-blur-xl"
          >
            <Sidebar
              :sections="sections"
              :active-id="activeId"
              :is-expanded="isExpanded"
              @activate="activateFromDrawer"
            />
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.drawer-mask-enter-active,
.drawer-mask-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-mask-enter-from,
.drawer-mask-leave-to {
  opacity: 0;
}

.drawer-panel-enter-active {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-panel-leave-active {
  transition: transform 0.24s cubic-bezier(0.4, 0, 1, 1);
}
.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(-100%);
}
</style>
