<template>
  <div class="place">
    <h1 class="float-left">Thiết lập địa điểm</h1>
    <div class="mb-1 d-flex justify-content-end">
      <a-button type="primary" @click="showModalAdd"> Thêm địa điểm </a-button>
    </div>

    <a-row :gutter="8">
      <a-col
        v-for="place in placeStore.placeList"
        :key="place.id"
        :span="8"
        class="mb-2"
      >
        <a-card hoverable>
          <template #title>
            <div class="d-flex justify-content-between">
              {{ place.name }}
              <a-popover>
                <template #content>
                  {{ place.description }}
                </template>
                <SettingOutlined @click="openEditModal(place)" />
              </a-popover>
            </div>
          </template>

          <!-- <p class="text-right">
            <a-popover>
              <template #content>
                {{ $t("updatedAt") }}
              </template>
              <span class="updated-at">
                {{ dayjs(item.updatedAt).format("DD/MM/YYYY | HH:mm:ss") }}
              </span>
            </a-popover>
          </p> -->
        </a-card>
      </a-col>
    </a-row>

    <a-modal v-model:open="visibleModalAdd" title="Thêm địa điểm">
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
            { required: true, message: 'Please input your name place!' },
          ]"
        >
          <a-input v-model:value="formAdd.name">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Description" name="description">
          <a-input v-model:value="formAdd.description">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
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
            { required: true, message: 'Please input your name place!' },
          ]"
        >
          <a-input v-model:value="formUpdate.name">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Description" name="description">
          <a-input v-model:value="formUpdate.description">
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
import { usePlaceStore, PLace } from "@/store";
const loading = ref(false);
const visibleModalAdd = ref(false);
const visibleModalUpdate = ref(false);

export interface PlaceFormProps {
  name: string | undefined;
  description: string | undefined;
}

export interface PlaceFormUpdateProps {
  name: string | undefined;
  description: string | undefined;
  id: number | undefined;
}

const formAdd = reactive<PlaceFormProps>({
  name: undefined,
  description: undefined,
});

const formUpdate = reactive<PlaceFormUpdateProps>({
  name: undefined,
  description: undefined,
  id: undefined,
});

const placeStore = usePlaceStore();
placeStore.fetchPlaceList();

function handleCancel() {
  console.log("here");
}

function showModalAdd() {
  visibleModalAdd.value = true;
}
function onSave() {
  loading.value = true;

  placeStore
    .savePlace(
      formAdd.name as unknown as string,
      formAdd.description as unknown as string
    )
    .then(() => {
      notification.success({
        message: "Thêm địa điểm thành công",
      });
      placeStore.fetchPlaceList();
      visibleModalAdd.value = false;
      formAdd.name = undefined;
      formAdd.description = undefined;
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
  placeStore
    .updatePlace(
      formUpdate.id as unknown as number,
      formUpdate.name as unknown as string,
      formUpdate.description as unknown as string
    )
    .then(() => {
      notification.success({
        message: "Cập nhật địa điểm thành công",
      });
      placeStore.fetchPlaceList();
      visibleModalUpdate.value = false;
      formUpdate.id = undefined;
      formUpdate.name = undefined;
      formUpdate.description = undefined;
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
  placeStore
    .deletePlace(
      formUpdate.id as unknown as number
    )
    .then(() => {
      notification.success({
        message: "Xóa địa điểm thành công",
      });
      placeStore.fetchPlaceList();
      visibleModalUpdate.value = false;
      formUpdate.id = undefined;
      formUpdate.name = undefined;
      formUpdate.description = undefined;
    })
    .catch((e) => {
      notification.error({
        message: e.data?.detail || "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
function openEditModal(place: PLace) {
  visibleModalUpdate.value = true;
  formUpdate.name = place.name;
  formUpdate.description = place.description;
  formUpdate.id = place.id;
}
</script>
