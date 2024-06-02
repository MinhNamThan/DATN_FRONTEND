<template>
  <div class="home">
    <video
      v-for="notification in notificationStore.notificationList"
      :key="notification.id"
      class="mx-2 my-1"
      width="320"
      height="240"
      controls
      ref="videos"
    >
      <source :src="notification.videoUrl" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
// import { notification } from "ant-design-vue";
import { useNotificationStore } from "@/store";

const notificationStore = useNotificationStore();
const videos = ref<HTMLVideoElement[]>([]);

onMounted(() => {
  videos.value.forEach(video => {
    video.playbackRate = 0.5;
  });
});
</script>

<style scoped></style>
