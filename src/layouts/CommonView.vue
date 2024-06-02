<template>
  <a-layout class="layout">
    <a-layout-header :style="{ height: '64px' }">
      <PageHeader />
    </a-layout-header>
    <a-layout-content :style="{ minHeight: '80%' }">
      <div :style="{ background: '#fff', padding: '24px 0px', height: '100%' }">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center; height: 64px">
      <PageFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import { PageFooter, PageHeader } from "./index";
// import { useNotificationStore } from "@/store";

</script>

<style scope>
.layout {
  height: 100vh;
}

[data-theme="dark"] .site-layout-content {
  background: #141414;
}
</style>
