<template>
  <div class="camera">
    <div>
      <a-page-header @back="() => null">
        <template #title>
          <h2>
            {{
              Object.keys(CameraCurrent).length === 0
                ? "Thiết lập Camera"
                : "Chi tiết Camera"
            }}
          </h2>
        </template>
        <template #backIcon>
          <a-button v-if="Object.keys(CameraCurrent).length !== 0">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
        </template>
        <template #extra>
          <a-button
            v-if="Object.keys(CameraCurrent).length === 0"
            type="primary"
            @click="showModalAdd"
            size="large"
          >
            Thêm camera
          </a-button>
        </template>
      </a-page-header>
    </div>

    <CameraDetail
      :CameraCurrent="CameraCurrent"
      v-if="Object.keys(CameraCurrent).length > 0"
      @success="onUpdatePointsSuccess"
    />
    <a-row :gutter="8" v-else>
      <a-col
        v-for="camera in cameraStore.cameraList"
        :key="`${camera.id}-${reloadTimestamp[camera.id]}`"
        :span="11"
        class="mb-2 mx-4"
      >
        <a-card hoverable>
          <template #title>
            <div class="d-flex justify-content-end">
              <p class="mb-0 mr-3" @click="getCam(camera)">{{ camera.name }}</p>
              <a-popover class="mt-1">
                <template #content> Chỉnh sửa </template>
                <SettingOutlined @click="openEditModal(camera)" />
              </a-popover>
            </div>
          </template>
          <template #cover>
            <img
              :src="`${camera.box.link}?url=${camera.url}&username=${camera.box.username}&password=${camera.box.password}`"
              alt=""
              width="100%"
              class="img-camera"
              @load="handleImageLoad(camera.id)"
            />
            <a-spin v-if="imageLoading[camera.id]" size="large" />
          </template>
        </a-card>
      </a-col>
    </a-row>

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
          label="Box"
          name="box_id"
          :rules="[
            { required: true, message: 'Please choise your place camera!' },
          ]"
        >
          <a-select
            v-model:value="formAdd.box_id"
            placeholder="please select your place"
          >
            <a-select-option
              v-for="box in boxStore.boxList"
              :key="box.id"
              :value="box.id"
            >
              {{ box.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Detect" name="detected">
          <a-checkbox v-model:checked="formAdd.detected"></a-checkbox>
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

        <a-form-item label="Detect" name="detected">
          <a-checkbox v-model:checked="formUpdate.detected"></a-checkbox>
        </a-form-item>
      </a-form>
      <a-divider style="margin: 4px 0" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";
import CameraDetail from "./CameraDetail/CameraDetail.vue";
import { notification } from "ant-design-vue";
import { useCameraStore, Camera, useBoxStore } from "@/store";
import axios from "axios";
const loading = ref(false);
const visibleModalAdd = ref(false);
const visibleModalUpdate = ref(false);
const CameraCurrent = ref<Camera | {}>({});
const reloadTimestamp = reactive<Record<number, number>>({});

const imageLoading = reactive<Record<number, boolean>>({});
export interface CameraFormProps {
  box_id: number | undefined;
  name: string | undefined;
  url: string | undefined;
  detected: boolean | undefined;
}

export interface CameraFormUpdateProps {
  box_id: number | undefined;
  name: string | undefined;
  url: string | undefined;
  id: number | undefined;
  detected: boolean | undefined;
}

const formAdd = reactive<CameraFormProps>({
  box_id: undefined,
  name: undefined,
  url: undefined,
  detected: false,
});

const formUpdate = reactive<CameraFormUpdateProps>({
  box_id: undefined,
  name: undefined,
  url: undefined,
  id: undefined,
  detected: false,
});

const cameraStore = useCameraStore();
const boxStore = useBoxStore();
boxStore.fetchBoxList();


onMounted(() => {
  cameraStore.fetchCameraList().then(() => {
    cameraStore.cameraList.forEach((camera) => {
      imageLoading[camera.id as number] = true;
      reloadTimestamp[camera.id as number] = Date.now();
    });
  })
});

function handleImageLoad(id: number) {
  imageLoading[id] = false;
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
      formAdd.box_id as unknown as number,
      formAdd.name as unknown as string,
      formAdd.url as unknown as string,
      formAdd.detected as unknown as boolean,
      JSON.stringify([])
    )
    .then(() => {
      notification.success({
        message: "Thêm camera thành công",
      });
      cameraStore.fetchCameraList();
      visibleModalAdd.value = false;
      formAdd.box_id = undefined;
      formAdd.name = undefined;
      formAdd.url = undefined;
      formAdd.detected = false;
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
      formUpdate.url as unknown as string,
      formUpdate.detected as unknown as boolean,
      JSON.stringify([])
    )
    .then(() => {
      notification.success({
        message: "Cập nhật camera thành công",
      });
      cameraStore.fetchCameraList();
      visibleModalUpdate.value = false;
      if(formUpdate.id){
        reloadTimestamp[formUpdate.id as number] = Date.now();
        console.log(reloadTimestamp[formUpdate.id as number])
      }
      formUpdate.id = undefined;
      formUpdate.box_id = undefined;
      formUpdate.name = undefined;
      formUpdate.url = undefined;
      formUpdate.detected = false;
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
      formUpdate.box_id = undefined;
      formUpdate.name = undefined;
      formUpdate.url = undefined;
      formUpdate.detected = false;
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
  formUpdate.box_id = camera.box.id;
  formUpdate.id = camera.id;
  formUpdate.detected = camera.detected;
}

async function getCam(camera: Camera) {
  await axios.get(camera.box.link + "stop_stream?urllink=" + camera.url);
  CameraCurrent.value = camera;
}
function onUpdatePointsSuccess() {
  if(CameraCurrent.value && 'id' in CameraCurrent.value){
    reloadTimestamp[CameraCurrent.value.id as number] = Date.now();
  }
  CameraCurrent.value = {};
  cameraStore.fetchCameraList();
  notification.success({
    message: "Cập nhật camera thành công",
  });
}
</script>

<style scoped>
.img-camera {
  border-radius: 10px;
}
.camera {
  padding: 0 50px;
  font-size: 18px;
}
</style>
