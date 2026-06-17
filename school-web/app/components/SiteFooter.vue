<script setup lang="ts">
import { siteConfig } from '~/data/site'
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-main">
        <img :src="siteConfig.logo" :alt="siteConfig.schoolName" />
        <div>
          <h3>{{ siteConfig.schoolName }}</h3>
          <p>地址：{{ siteConfig.address }}</p>
          <p>电话：{{ siteConfig.phone }}　邮箱：{{ siteConfig.email }}</p>
        </div>
      </div>

      <div class="footer-meta">
        <p>© {{ siteConfig.copyrightYear }} {{ siteConfig.schoolName }} 版权所有</p>
        <p>{{ siteConfig.icp }}</p>
        <p>建议使用 Chrome、Edge 浏览器访问</p>
      </div>
    </div>
  </footer>
</template>
