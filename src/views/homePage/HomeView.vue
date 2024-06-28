<template>
  <div class="home">
    <a-row class="mx-3 mb-2" :gutter="8">
      <a-col>
        <a-select
          v-model:value="formQuery.camera_id"
          placeholder="Lựa chọn camera"
        >
          <a-select-option
            v-for="camera in cameraStore.cameraList"
            :key="camera.id"
            :value="camera.id"
          >
            {{ camera.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <a-date-picker show-time placeholder="Thời gian bắn đầu" @change="onChangeStartDate" />
      </a-col>
      <a-col>
        <a-date-picker show-time placeholder="Thời gian kết thúc" @change="onChangeEndDate" />
      </a-col>
      <a-col><a-button type="primary" @click="filterNotification">Lọc</a-button></a-col>
    </a-row>
    <a-row class="mx-4 mb-2">
      <a-col>
        <h1 class="title-number">
          Số lần phát hiện người: {{ notificationStore.total }}
        </h1>
      </a-col>
    </a-row>
    <a-row>
      <a-col
        :span="7"
        class="mx-4 mb-4"
        v-for="notification in notificationStore.notificationList"
        :key="notification.id"
      >
        <a-card :bordered="true">
          <template #cover>
            <a-row>
              <video
                :key="notification.videoUrl"
                width="100%"
                height="300px"
                controls
                ref="setVideoRef"
              >
                <source :src="notification.videoUrl" />
                Your browser does not support the video tag.
              </video>
            </a-row>
            <a-row>
              <h1 @click="showDetail(notification.id)">{{ notification.title }}</h1>
              <p>{{ notification.description }}</p>
            </a-row>
          </template>
        </a-card>
      </a-col>
    </a-row>
    <a-pagination
      v-model:current="current"
      :total="notificationStore.total"
      show-less-items
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, nextTick, reactive } from "vue";
// import { notification } from "ant-design-vue";
import { useNotificationStore, useCameraStore } from "@/store";
import { Dayjs } from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();
const notificationStore = useNotificationStore();
const cameraStore = useCameraStore();
cameraStore.fetchCameraList();
const videos = ref<HTMLVideoElement[]>([]);
const current = ref(1);
export interface QueryFormProps {
  camera_id: number | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
}

const formQuery = reactive<QueryFormProps>({
  camera_id: undefined,
  start_date: undefined,
  end_date: undefined,
});

const setVideoRef = (el: HTMLVideoElement) => {
  if (el) {
    videos.value.push(el);
  }
};

watch(current, () => {
  notificationStore.fetchNotificationList(current.value);
});

watch(
  () => notificationStore.notificationList,
  async () => {
    // Clear previous video refs
    videos.value = [];
    await nextTick(); // Wait for the DOM to update
    videos.value.forEach((video) => {
      video.playbackRate = 0.5;
    });
  },
  { immediate: true }
);

onMounted(() => {
  videos.value.forEach((video) => {
    video.playbackRate = 0.5;
  });
});

function filterNotification() {
  notificationStore.fetchNotificationList(
    current.value,
    6,
    formQuery.camera_id,
    formQuery.start_date,
    formQuery.end_date
  );
}

const onChangeStartDate = (value: Dayjs, dateString: string) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
  formQuery.start_date = dateString;
};

const onChangeEndDate = (value: Dayjs, dateString: string) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
  formQuery.end_date = dateString;
};

function showDetail(id: number) {
  router.push(`/notification/${id}`);
}
</script>

<style scoped>
.title-number {
  font-size: 24px;
  font-weight: bold;
}
</style>
