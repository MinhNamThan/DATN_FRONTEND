<template>
  <div class="common-layout">
    <div class="top mb-5 d-flex justify-content-center">
      <div class="form-login">
        <div class="header">
          <span class="title">HỆ THỐNG JAVIS Ai</span>
        </div>
        <a-form
          :model="form"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          class="mx-2"
          autocomplete="off"
          @finish="register"
        >
          <a-form-item
            label="Name"
            name="name"
            :rules="[{ required: true, message: 'Please input your name!' }]"
          >
            <a-input v-model:value="form.name">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Email"
            name="email"
            :rules="[{ required: true, message: 'Please input your email!' }]"
          >
            <a-input v-model:value="form.email">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[
              { required: true, message: 'Please input your password!' },
            ]"
          >
            <a-input-password v-model:value="form.password">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
            <a-button type="primary" @click="register">Tạo tài khoản</a-button>
          </a-form-item> -->
          <a-button
            htmlType="submit"
            class="h-[40px] w-full"
            type="primary"
            :loading="loading"
          >
            Tạo tài khoản
          </a-button>
        </a-form>
        <div class="px-4 d-flex justify-content-between">
          <span class="title">
            <router-link to="/login">Đăng nhập</router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import { useAccountStore } from "@/store";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";

const router = useRouter();
export interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
}

const loading = ref(false);

const form = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
});

const accountStore = useAccountStore();
function register(params: RegisterFormProps) {
  loading.value = true;

  accountStore
    .register(params.name, params.email, params.password)
    .then(() => {
      notification.success({
        message: "Đã gửi mã đến email",
      });
      localStorage.setItem("emailCur", params.email);
      router.push("/verify");
    })
    .catch((e) => {
      if (e.data?.detail == "Email is already exists.") {
        notification.error({
          message: "Tài khoản đã tồn tại",
        });
      } else if (e.data?.detail == "Please provide a strong password.") {
        notification.error({
          message: "Hãy cung cấp mật khẩu mạnh hơn",
        });
      } else {
        notification.error({
          message: e.data?.detail || "Không thành công",
        });
      }
    })
    .finally(() => (loading.value = false));
}
</script>

<style lang="less" scoped>
.common-layout {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  background-color: #f0f2f5;
  background-image: url("https://developers.hanet.ai/images/login_1.jpg");
  background-size: cover;
  .content {
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px) {
      padding: 112px 0 24px;
    }
  }
}
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      margin-bottom: 20px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: rgba(0, 0, 0, 0.85);
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
  }
}
.form-login {
  background-color: #fff;
  width: 600px;
  border-radius: 5px;
  padding: 20px 10px;
}
</style>
