<template>
  <div class="mx-4">
    <a-row :gutter="24">
      <a-col :span="16">
        <video
          :key="notificationStore.notificationCur.videoUrl"
          width="100%"
          controls
          ref="setVideoRef"
        >
          <source :src="notificationStore.notificationCur.videoUrl" />
          Your browser does not support the video tag.
        </video>
      </a-col>
      <a-col :span="8">
        <a-row>
          <a-col :span="6"><p class="info float-left">Tiêu đề:</p></a-col>
          <a-col
            ><p class="info float-left">
              {{ notificationStore.notificationCur.title }}
            </p></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="6"><p class="info float-left">Mô tả:</p> </a-col>
          <a-col
            ><p class="info float-left">
              {{ notificationStore.notificationCur.description }}
            </p></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="6"><p class="info float-left">Thời gian:</p> </a-col>
          <a-col
            ><p class="info float-left">
              {{
                dayjs(notificationStore.notificationCur.created_at).format(
                  "DD-MM-YYYY"
                )
              }}
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6"
            ><p class="info float-left">Phát hiện lúc:</p>
          </a-col>
          <a-col
            ><p class="info float-left">
              {{
                dayjs(notificationStore.notificationCur.created_at).format(
                  "HH:mm:ss"
                )
              }}
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6"><p class="info float-left">Từ camera:</p></a-col>
          <a-col
            ><p
              class="info float-left"
              v-if="notificationStore.notificationCur.camera"
            >
              {{ notificationStore.notificationCur.camera.name }}
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6"><p class="info float-left">Địa điểm:</p></a-col>
          <a-col
            ><p
              class="info float-left"
              v-if="notificationStore.notificationCur.camera"
            >
              {{ notificationStore.notificationCur.camera.box.place.name }}
            </p>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { useNotificationStore } from "@/store";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

const route = useRoute();
const notificationStore = useNotificationStore();
onMounted(async () => {
  await notificationStore.fetchNotificationById(route.params.id.toString());
});
</script>
<style scoped>
.info {
  font-size: 20px;
  font-weight: bold;
}
</style>
