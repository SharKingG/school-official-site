<script setup lang="ts">
import { fetchNavMenus, type WebNavMenu } from '~/api/site'

const route = useRoute()
const { data: menus } = await useAsyncData('site-nav-menus', fetchNavMenus)

function menuPath(item: WebNavMenu) {
  return item.path || (item.slug === 'home' ? '/' : `/news?category=${item.slug}`)
}

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }

  const category = path.split('category=')[1]

  if (!category) {
    return route.path === path
  }

  return route.path === '/news' && route.query.category === category
}

function hasActiveChild(item: WebNavMenu) {
  return (item.children || []).some((child) => isActive(menuPath(child)))
}
</script>

<template>
  <nav class="site-nav">
    <div class="container nav-inner">
      <div
        v-for="item in menus || []"
        :key="item.id || item.slug"
        class="nav-item-wrap"
        :class="{ 'is-active': isActive(menuPath(item)) || hasActiveChild(item) }"
      >
        <NuxtLink class="nav-link" :to="menuPath(item)">
          {{ item.label || item.name }}
        </NuxtLink>

        <div v-if="item.children?.length" class="nav-dropdown">
          <NuxtLink
            v-for="child in item.children"
            :key="child.id || child.slug"
            :to="menuPath(child)"
            class="nav-dropdown-link"
            :class="{ 'is-active': isActive(menuPath(child)) }"
          >
            {{ child.label || child.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
