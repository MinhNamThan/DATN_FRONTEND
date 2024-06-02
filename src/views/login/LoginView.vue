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
          autocomplete="on"
          class="mx-2"
          @finish="onLogin"
        >
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
          <a-button
            htmlType="submit"
            class="h-[40px] w-full"
            type="primary"
            :loading="loading"
          >
            Đăng nhập
          </a-button>
        </a-form>
        <div class="px-4 d-flex justify-content-between">
          <span class="title">
            <router-link to="/register">Đăng ký</router-link>
          </span>
          <span class="title">
            <router-link to="/forget">Quên mật khẩu?</router-link>
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

export interface LoginFormProps {
  email: string;
  password: string;
}

const loading = ref(false);

const form = reactive({
  email: undefined,
  password: undefined,
});

const accountStore = useAccountStore();

function onLogin(params: LoginFormProps) {
  console.log(form);
  loading.value = true;

  const formData = new URLSearchParams();
  formData.append("username", params.email);
  formData.append("password", params.password);

  console.log(formData);

  accountStore
    .login(formData)
    .then(() => {
      notification.success({
        message: "Đăng nhập thành công",
      });
      router.push("/");
    })
    .catch((e) => {
      if (e.data?.detail == "Email is not registered with us.") {
        notification.error({
          message: "Email chưa được đăng ký",
        });
      } else if (e.data?.detail == "Incorrect email or password.") {
        notification.error({
          message: "Tài khoản hoặc mật khẩu không chính xác",
        });
      } else if (
        e.data?.detail ==
        "Your account is not verified. Please check your email inbox to verify your account."
      ) {
        notification.error({
          message: "Tài khoản chưa được kích hoạt",
        });
      } else {
        notification.error({
          message: "Không thành công",
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
  background-repeat: no-repeat;
  background-size: 100%;
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
    margin-top: 10%;
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
