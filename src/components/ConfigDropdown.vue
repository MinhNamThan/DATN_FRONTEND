<template>
  <a-dropdown overlayClassName="action-dropdown">
    <template #overlay>
      <div class="action-dropdown-background chain-dropdown py-1 rounded-sm">
        <router-link to="/place">
          <div class="dropdown-select-item">
            <setting-outlined class="mr-1" />
            Địa chỉ
          </div>
        </router-link>
        <a-divider style="margin: 4px 0" />
        <router-link to="/box">
          <div class="dropdown-select-item">
            <setting-outlined class="mr-1" />
            Thiết bị
          </div>
        </router-link>
        <a-divider style="margin: 4px 0" />
        <router-link to="/camera">
          <div class="dropdown-select-item">
            <setting-outlined class="mr-1" />
            Camera
          </div>
        </router-link>
        <a-divider style="margin: 4px 0" />

        <!-- <div class="dropdown-select-item">
          <setting-outlined class="mr-1" />
          Bài Ai
        </div> -->
      </div>
    </template>
    <a-button class="btn-custom-header">
      Thiết lập
      <SettingOutlined />
    </a-button>
  </a-dropdown>
</template>

<script setup lang="ts">
import { SettingOutlined } from "@ant-design/icons-vue";
// import { useChainStore } from "@/store";
// import { ref, computed } from "vue";

// const props = defineProps<{
//   currentChainId: number | undefined;
//   currentSiteId: number | undefined;
//   currentChain: string | undefined;
//   handleChainConfig: () => void;
//   handleChainChange: (chainId: number) => void;
//   handleSiteChange: (siteId: number) => void;
// }>();

// const chainStore = useChainStore();

// let canConfigureChain = computed(() => {
//   let currentUserId = JSON.parse(localStorage.getItem("account")).userId;
//   let sharedUser = chainStore.chainSharedUserList.find(
//     (item) => item.userId === currentUserId
//   );
//   return sharedUser && sharedUser.role !== "STAFF";
// });
</script>

<style lang="less">
.dropdown-select-item {
  padding: 4px 8px;
  cursor: pointer;
}

@media screen and (min-width: 769px) {
  .chain-dropdown .ant-divider {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: white;
    font-size: var(--font-size);
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum";
    border-top: 0.5px solid white;
  }

  .dropdown-select-item {
    &:hover {
      color: white;
    }
  }

  .action-dropdown-background {
    background-color: black !important;
    color: white !important;
  }
}

@media screen and (max-width: 768px) {
  .action-dropdown-background {
    position: relative;
    margin: 0;
    padding: 4px 0;
    text-align: left;
    list-style-type: none;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014,
      0 9px 28px 8px #0000000d;
  }

  .dropdown-select-item {
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
