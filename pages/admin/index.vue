<template>
  <div class="login-page">
    <header class="header">
      <h1>FarmSNS Admin</h1>
      <p>FarmSNS는 농업 관련 소셜 네트워크 서비스를 제공합니다.</p>
    </header>
    <div class="login-container">
      <div class="login-card">
        <h1 class="title">FarmSNS Admin</h1>
        <div v-if="!authStore.isLoggedIn" class="not-logged-in">
          <p>로그인이 필요합니다.</p>
          <button @click="goToLogin" class="button login-button" aria-label="로그인 페이지로 이동">로그인 페이지로 이동</button>
        </div>
        <div v-else>
          <p>환영합니다, 관리자님!</p>
          <button @click="goToDashboard" class="button dashboard-button" aria-label="대시보드로 이동">대시보드로 이동</button>
        </div>
      </div>
    </div>
      <BusinessInfo />
  </div>
  {{ name }}
  
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import BusinessInfo from '@/components/common/BusinessInfo.vue';
import { decryptWithIv } from '@/shared-utils/crypto/decryption';
const router = useRouter();
const authStore = useAuthStore();

let name = 'x';
if(authStore.administrator != null){
  name = decryptWithIv(authStore.administrator.securedUserName, authStore.administrator.iv);
} 

const goToLogin = () => {
  router.push('/admin/login'); // 로그인 페이지로 이동
};

const goToDashboard = () => {
  router.push('/admin/dashboard'); // 대시보드 페이지로 이동
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 1rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
}

.login-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  text-align: left;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555555;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  color: #333333;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.button {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button {
  background-color: #3b82f6;
  color: #ffffff;
}

.login-button:hover {
  background-color: #2563eb;
}

.dashboard-button {
  background-color: #10b981;
  color: #ffffff;
}

.dashboard-button:hover {
  background-color: #059669;
}

.error-message {
  margin-top: 1rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.login-status {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

.text-green-500 {
  color: #10b981;
}

.text-red-500 {
  color: #ef4444;
}
</style>
