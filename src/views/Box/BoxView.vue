<template>
  <div class="box">
    <div class="mb-1 d-flex justify-content-between">
      <h1 class="float-left">Thiết lập thiết bị</h1>
      <a-button type="primary" @click="showModalAdd" size="large">
        Thêm Thiết bị
      </a-button>
    </div>

    <a-row :gutter="8">
      <a-col
        v-for="box in boxStore.boxList"
        :key="box.id"
        :span="8"
        class="mb-2"
      >
        <a-card hoverable>
          <template #title>
            <div class="d-flex justify-content-between">
              {{ box.name }}
              <a-popover>
                <template #content>
                  {{ box.link }}
                </template>
                <SettingOutlined @click="openEditModal(box)" />
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

    <a-modal v-model:open="visibleModalAdd" title="Thêm thiết bị">
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

        <a-form-item label="Link" name="link">
          <a-input v-model:value="formAdd.link">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="username" name="username">
          <a-input v-model:value="formAdd.username">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="password" name="password">
          <a-input v-model:value="formAdd.password">
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

        <a-form-item label="Link" name="link">
          <a-input v-model:value="formUpdate.link">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="username" name="username">
          <a-input v-model:value="formUpdate.username">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="password" name="password">
          <a-input v-model:value="formUpdate.password">
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
import { useBoxStore, Box, usePlaceStore } from "@/store";
const loading = ref(false);
const visibleModalAdd = ref(false);
const visibleModalUpdate = ref(false);

export interface BoxFormProps {
  name: string | undefined;
  link: string | undefined;
  username: string | undefined;
  password: string | undefined;
  place_id: number | undefined;
}

export interface BoxFormUpdateProps {
  name: string | undefined;
  link: string | undefined;
  username: string | undefined;
  password: string | undefined;
  id: number | undefined;
}

const formAdd = reactive<BoxFormProps>({
  name: undefined,
  link: undefined,
  username: undefined,
  password: undefined,
  place_id: undefined,
});

const formUpdate = reactive<BoxFormUpdateProps>({
  name: undefined,
  link: undefined,
  username: undefined,
  password: undefined,
  id: undefined,
});

const boxStore = useBoxStore();
const placeStore = usePlaceStore();
placeStore.fetchPlaceList();
boxStore.fetchBoxList();

function handleCancel() {
  console.log("here");
}

function showModalAdd() {
  visibleModalAdd.value = true;
}
function onSave() {
  loading.value = true;

  boxStore
    .saveBox(
      formAdd.place_id as unknown as number,
      formAdd.name as unknown as string,
      formAdd.link as unknown as string,
      formAdd.username as unknown as string,
      formAdd.password as unknown as string
    )
    .then(() => {
      notification.success({
        message: "Thêm thiết bị thành công",
      });
      boxStore.fetchBoxList();
      visibleModalAdd.value = false;
      formAdd.place_id = undefined;
      formAdd.name = undefined;
      formAdd.link = undefined;
      formAdd.username = undefined;
      formAdd.password = undefined;
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
  boxStore
    .updateBox(
      formUpdate.id as unknown as number,
      formUpdate.name as unknown as string,
      formUpdate.link as unknown as string,
      formUpdate.username as unknown as string,
      formUpdate.password as unknown as string
    )
    .then(() => {
      notification.success({
        message: "Cập nhật thiết bị thành công",
      });
      boxStore.fetchBoxList();
      visibleModalUpdate.value = false;
      formUpdate.id = undefined;
      formUpdate.name = undefined;
      formUpdate.link = undefined;
      formUpdate.username = undefined;
      formUpdate.password = undefined;
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
  boxStore
    .deleteBox(formUpdate.id as unknown as number)
    .then(() => {
      notification.success({
        message: "Xóa thiết bị thành công",
      });
      boxStore.fetchBoxList();
      visibleModalUpdate.value = false;
      formUpdate.id = undefined;
      formUpdate.name = undefined;
      formUpdate.link = undefined;
      formUpdate.username = undefined;
      formUpdate.password = undefined;
    })
    .catch((e) => {
      notification.error({
        message: e.data?.detail || "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
function openEditModal(box: Box) {
  visibleModalUpdate.value = true;
  formUpdate.name = box.name;
  formUpdate.link = box.link;
  formUpdate.username = box.username;
  formUpdate.password = box.password;
  formUpdate.id = box.id;
}
</script>

<style scoped>
.box {
  padding: 0 50px;
  font-size: 18px;
}
</style>
