<script setup lang="ts">
import { navItems } from '~/data/site'

const route = useRoute()

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
</script>

<template>
  <nav class="site-nav">
    <div class="container nav-inner">
      <NuxtLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.path"
        :class="{ 'is-active': isActive(item.path) }"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
