<template>
  <div class="ant-layout-header-customer">
    <router-link to="/" @click="reloadWeb"
      ><img src="../assets/icon.png" alt="logo" class="logo"
    /></router-link>
    <div class="right-header">
      <span class="action-container">
        <ConfigDropdown />
      </span>
      <span
        class="action-container ml-3 notification"
        @click="seenNotification"
      >
        <a-dropdown :trigger="['click']" overlayClassName="action-dropdown">
          <template #overlay>
            <div
              class="action-dropdown-background chain-dropdown py-1 rounded-sm"
            >
              <div
                v-for="(
                  notification, index
                ) in notificationStore.notificationList"
                class="dropdown-select-item"
                :key="notification.id"
                @click="showDetail(notification.id)"
              >
                <h3>{{ notification.title }}</h3>
                <p>
                  {{
                    "Thời gian: " +
                    dayjs(notification.created_at).format("DD/MM/YYYY HH:mm:ss")
                  }}
                </p>
                <a-divider
                  v-if="index != notificationStore.notificationList.length - 1"
                  style="margin: 4px 0"
                />
              </div>
            </div>
          </template>
          <img src="../assets/notification.png" alt="" />
        </a-dropdown>
        <span v-if="numberUnseen > 0" class="badge">
          {{ numberUnseen }}
        </span>
      </span>
      <span class="action-container ml-3">
        <a-dropdown overlayClassName="action-dropdown">
          <template #overlay>
            <div
              class="action-dropdown-background chain-dropdown py-1 rounded-sm"
            >
              <div class="dropdown-select-item" @click.stop="logout">
                <logout-outlined class="mr-1" />
                Đăng xuất
              </div>
            </div>
          </template>
          <span class="name-header">Than Minh Nam</span>
        </a-dropdown>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ConfigDropdown from "@/components/ConfigDropdown.vue";
import { useAccountStore } from "@/store";
import { notification } from "ant-design-vue";
import { useNotificationStore } from "@/store";
import { LogoutOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const router = useRouter();

const notificationStore = useNotificationStore();
notificationStore.fetchNotificationList();

const loading = ref(false);
const accountStore = useAccountStore();
let numberUnseen = ref(0);

async function updateNumberUnseen() {
  try {
    numberUnseen.value = await notificationStore.fetchNotificationUnseenList();
  } catch (error) {
    console.error("Error fetching unseen notifications:", error);
  }
}

updateNumberUnseen();

function setupWebSocket() {
  const ws = new WebSocket("ws://localhost:8000/ws/notifications");
  ws.onopen = () => {
    console.log("WebSocket connection opened.");
  };
  ws.onmessage = async (event) => {
    if (event.data == "new notification") {
      notificationStore.fetchNotificationList();
      updateNumberUnseen();
      notification.warn({
        message: "Phát hiện người xâm nhập!",
      });
    }
  };
  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  ws.onclose = () => {
    console.log("WebSocket connection closed.");
  };
}

setupWebSocket();

function seenNotification() {
  if (numberUnseen.value > 0) {
    notificationStore
      .updateStatus()
      .then(() => {
        updateNumberUnseen();
      })
      .catch(() => {
        notification.error({
          message: "Không thành công",
        });
      });
  } else return;
}

function logout() {
  loading.value = true;
  accountStore
    .logout()
    .then(() => {
      window.location.reload();
    })
    .catch(() => {
      notification.error({
        message: "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
function reloadWeb() {
  router.push("/").then(() => {
    window.location.reload();
  });
}
function showDetail(id: number) {
  router.push(`/notification/${id}`);
}
</script>

<style scoped lang="less">
.ant-layout-header-customer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.logo {
  width: auto;
  height: 50px;
  padding: 3px auto;
  cursor: pointer;
}
.ant-row-rtl .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.ant-select-dropdown.ant-select-dropdown-empty.ant-select-dropdown-placement-bottomLeft {
  color: white;
  background-color: black;
}

@media screen and (max-width: 768px) {
  .action-container {
    display: none;
  }
}

@media screen and (min-width: 769px) {
  .action-containter-mobile {
    display: none !important;
  }
}

.personal.stepin-header-action .avatar {
  display: none;
}

.personal .username:hover {
  color: white;
}

.stepin-header-avatar-menu .ant-dropdown-menu-item {
  color: var(--header-text-color) !important;
  &:hover {
    color: white !important;
  }
}

.ant-list-split .ant-list-item:last-child {
  border-bottom: 1px solid var(--color-border-2) !important;
}

.feature-disabled-text .ant-checkbox-wrapper {
  color: var(--color-text-1) !important;
}

.name-header {
  color: white;
  cursor: pointer;
}

.notification {
  position: relative;
  cursor: pointer;
}

.notification .badge {
  position: absolute;
  top: -15px;
  right: -15px;
  padding: 5px 10px;
  border-radius: 50%;
  background: red;
  color: white;
  line-height: 8px;
  font-size: 12px;
}

.action-dropdown-background {
  background-color: blue !important;
  color: white !important;
  border-radius: 5px;
}
</style>
