<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>GIS 应用系统</h2>
        <p>请登录您的账户</p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <p>管理员：admin / 123456</p>
        <p>使用者：gis123 / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/store';

const router = useRouter();
const authStore = useAuthStore();
const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: ''
});

const validateUsername = (rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error('请输入用户名'));
  } else {
    callback();
  }
};

const validatePassword = (rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
};

const loginRules: FormRules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      
      // 模拟登录请求
      setTimeout(() => {
        const success = authStore.login(loginForm.username, loginForm.password);
        
        if (success) {
          ElMessage.success('登录成功');
          router.push('/');
        } else {
          ElMessage.error('用户名或密码错误');
        }
        
        loading.value = false;
      }, 500);
    }
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 420px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  .login-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      font-size: 28px;
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      font-size: 14px;
      color: #666;
    }
  }

  .login-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    .login-button {
      width: 100%;
      margin-top: 10px;
    }
  }

  .login-tips {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    text-align: center;

    p {
      font-size: 12px;
      color: #999;
      margin: 5px 0;
    }
  }
}
</style>

