<script setup lang="ts">
import { fetchSiteSettings } from '~/api/site'

const { data: settings } = await useAsyncData('site-settings-footer', fetchSiteSettings)
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-main">
        <img :src="settings?.logo" :alt="settings?.schoolName" />
        <div>
          <h3>{{ settings?.schoolName }}</h3>
          <p>地址：{{ settings?.address }}</p>
          <p>电话：{{ settings?.phone }}　邮箱：{{ settings?.email }}</p>
        </div>
      </div>

      <div class="footer-meta">
        <p>© {{ settings?.copyrightYear }} {{ settings?.schoolName }} 版权所有</p>
        <p>{{ settings?.icp }}</p>
        <p>建议使用 Chrome、Edge 浏览器访问</p>
      </div>
    </div>
  </footer>
</template>
