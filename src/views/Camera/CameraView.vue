<template>
  <div class="camera">
    <h1 class="float-left">Thiết lập Camera</h1>
    <div class="mb-1 d-flex justify-content-end">
      <a-button type="primary" @click="showModalAdd">
        Thêm địa camera
      </a-button>
    </div>

    <a-row :gutter="8">
      <a-col
        v-for="camera in cameraStore.cameraList"
        :key="camera.id"
        :span="11"
        :offset="1"
        class="mb-2"
      >
        <a-card hoverable>
          <template #title>
            <div class="d-flex justify-content-end">
              <p class="mb-0 mr-3">{{ camera.name }}</p>
              <a-popover class="mt-1">
                <template #content> Chỉnh sửa </template>
                <SettingOutlined @click="openEditModal(camera)" />
              </a-popover>
            </div>
          </template>
          <template #cover>
            <a-spin v-if="imageLoading[camera.id]" size="large" />
            <img
              v-else
              :src="`http://0.0.0.0:8001/?url=${camera.url}`"
              alt=""
              width="100%"
              class="img-camera"
              @load="handleImageLoad(camera.id)"
            />
          </template>
        </a-card>
      </a-col>
    </a-row>

    <!-- <img :src="`http://0.0.0.0:8001/?url=${testUrl}`" alt="test" width="600px" /> -->
    <!-- <video width="320" height="240" autoplay>
      <source src="rtsp://admin:JCNMJQ@namthan.ddns.net:554" type="video/mp4" />
    </video> -->

    <a-modal v-model:open="visibleModalAdd" title="Thêm camera">
      <template #footer>
        <a-button key="back" @click="handleCancel">Hủy</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="onSave"
          >Lưu</a-button
        >
      </template>
      <a-divider style="margin: 4px 0" />
      <a-form
        :model="formAdd"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="on"
        class="mx-2"
      >
        <a-form-item
          label="Name"
          name="name"
          :rules="[
            { required: true, message: 'Please input your name camera!' },
          ]"
        >
          <a-input v-model:value="formAdd.name">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Url"
          name="url"
          :rules="[
            { required: true, message: 'Please input your url camera!' },
          ]"
        >
          <a-input v-model:value="formAdd.url">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Place"
          name="place_id"
          :rules="[
            { required: true, message: 'Please choise your place camera!' },
          ]"
        >
          <a-select
            v-model:value="formAdd.place_id"
            placeholder="please select your place"
          >
            <a-select-option
              v-for="place in placeStore.placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-divider style="margin: 4px 0" />
    </a-modal>

    <a-modal v-model:open="visibleModalUpdate" title="Thay đổi">
      <template #footer>
        <a-button key="back" danger @click="Ondelete">Xóa</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="onUpdate"
          >Lưu</a-button
        >
      </template>
      <a-divider style="margin: 4px 0" />
      <a-form
        :model="formUpdate"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="on"
        class="mx-2"
      >
        <a-form-item
          label="Name"
          name="name"
          :rules="[
            { required: true, message: 'Please input your name camera!' },
          ]"
        >
          <a-input v-model:value="formUpdate.name">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Url" name="url">
          <a-input v-model:value="formUpdate.url">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
      <a-divider style="margin: 4px 0" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { useCameraStore, Camera, usePlaceStore } from "@/store";
const loading = ref(false);
const visibleModalAdd = ref(false);
const visibleModalUpdate = ref(false);
const token = localStorage.getItem("Authorization");
console.log(token);
const imageLoading = reactive<Record<number, boolean>>({});
export interface CameraFormProps {
  place_id: number | undefined;
  name: string | undefined;
  url: string | undefined;
}

export interface CameraFormUpdateProps {
  place_id: number | undefined;
  name: string | undefined;
  url: string | undefined;
  id: number | undefined;
}

const formAdd = reactive<CameraFormProps>({
  place_id: undefined,
  name: undefined,
  url: undefined,
});

const formUpdate = reactive<CameraFormUpdateProps>({
  place_id: undefined,
  name: undefined,
  url: undefined,
  id: undefined,
});

const cameraStore = useCameraStore();
const placeStore = usePlaceStore();
placeStore.fetchPlaceList();
cameraStore.fetchCameraList().then(() => setLoading());

function setLoading() {
  cameraStore.cameraList.forEach((camera) => {
    console.log(camera);
    imageLoading[camera.id] = true;
  });
}

function handleCancel() {
  console.log("here");
}

function showModalAdd() {
  visibleModalAdd.value = true;
}
function onSave() {
  loading.value = true;

  cameraStore
    .saveCamera(
      formAdd.place_id as unknown as number,
      formAdd.name as unknown as string,
      formAdd.url as unknown as string
    )
    .then(() => {
      notification.success({
        message: "Thêm camera thành công",
      });
      cameraStore.fetchCameraList();
      visibleModalAdd.value = false;
      formAdd.place_id = undefined;
      formAdd.name = undefined;
      formAdd.url = undefined;
    })
    .catch((e) => {
      notification.error({
        message: e.data?.detail || "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
function onUpdate() {
  loading.value = true;
  cameraStore
    .updateCamera(
      formUpdate.id as unknown as number,
      formUpdate.name as unknown as string,
      formUpdate.url as unknown as string
    )
    .then(() => {
      notification.success({
        message: "Cập nhật camera thành công",
      });
      cameraStore.fetchCameraList();
      visibleModalUpdate.value = false;
      formUpdate.id = undefined;
      formUpdate.place_id = undefined;
      formUpdate.name = undefined;
      formUpdate.url = undefined;
    })
    .catch((e) => {
      notification.error({
        message: e.data?.detail || "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
function Ondelete() {
  loading.value = true;
  cameraStore
    .deleteCamera(formUpdate.id as unknown as number)
    .then(() => {
      notification.success({
        message: "Xóa camera thành công",
      });
      cameraStore.fetchCameraList();
      visibleModalUpdate.value = false;
      formUpdate.id = undefined;
      formUpdate.place_id = undefined;
      formUpdate.name = undefined;
      formUpdate.url = undefined;
    })
    .catch((e) => {
      notification.error({
        message: e.data?.detail || "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
function openEditModal(camera: Camera) {
  visibleModalUpdate.value = true;
  formUpdate.name = camera.name;
  formUpdate.url = camera.url;
  formUpdate.place_id = camera.place_id;
  formUpdate.id = camera.id;
}

function handleImageLoad(id: number) {
  imageLoading[id] = false;
}
</script>

<style scoped>
.img-camera {
  border-radius: 10px;
}
</style>
