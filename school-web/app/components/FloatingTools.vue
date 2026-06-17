<script setup lang="ts">
import { quickLinks } from '~/data/site'

const isOpen = ref(false)
</script>

<template>
  <aside class="floating-tools" :class="{ 'is-open': isOpen }">
    <button class="floating-main" type="button" @click="isOpen = !isOpen">
      <span class="grid-icon">▦</span>
      <em>更多功能</em>
    </button>

    <div class="floating-menu">
      <NuxtLink v-for="item in quickLinks" :key="item.label" :to="item.path">
        <span>{{ item.icon }}</span>
        {{ item.label }}
      </NuxtLink>
    </div>
  </aside>
</template>
