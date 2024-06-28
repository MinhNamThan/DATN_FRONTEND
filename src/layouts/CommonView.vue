<template>
  <a-layout class="layout">
    <a-layout-header :style="{ height: '64px' }">
      <PageHeader />
    </a-layout-header>
    <a-layout-content class="layout-content">
      <div class="content">
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
import { useBoxStore } from "@/store";

const boxStore = useBoxStore();
boxStore.fetchBoxList();
</script>

<style scope>
.layout {
  min-height: 100vh;
}

[data-theme="dark"] .site-layout-content {
  background: #141414;
}

.layout-content {
  min-height: 80%;
  background-image: url("../assets/bg.jpg");
  background-size: 100%;
}
.content {
  padding: 24px 0px;
  min-height: 100vh;
  height: 100%;
}
</style>
