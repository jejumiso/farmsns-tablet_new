<template>
  <div class="login-page">
    <header class="header">
      <h1>FarmSNS Admin</h1>
      <p>FarmSNS는 농업 관련 소셜 네트워크 서비스를 제공합니다.</p>
    </header>
    <div class="login-container">
      <div class="login-card">
        <h1 class="title">FarmSNS Admin Login</h1>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="phone" class="form-label">핸드폰 번호</label>
            <input 
              id="phone" 
              v-model="phoneNumber" 
              type="tel" 
              class="form-input" 
              required 
              @input="formatPhoneInput" 
            />
          </div>
          <div class="form-group" v-if="isCodeSent">
            <label for="code" class="form-label">Verification Code</label>
            <input 
              id="code" 
              v-model="verificationCode" 
              type="text" 
              class="form-input" 
              required 
              @input="formatVerificationCodeInput" 
            />
          </div>
          <button 
            type="button" 
            @click="sendCode" 
            class="login-button" 
            :disabled="phoneNumber.length !== 13" 
            v-if="!isCodeSent"
          >
            코드전송
          </button>
          <button 
            type="submit" 
            class="login-button" 
            :disabled="verificationCode.length !== 4" 
            v-if="isCodeSent"
          >
            로그인
          </button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>

      </div>
    </div>
    <BusinessInfo />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { formatPhone } from '@/';
import BusinessInfo from '@/components/common/BusinessInfo.vue';
const { $authService } = useNuxtApp(); // 명시적으로 가져오기

const phoneNumber = ref('010-');
const verificationCode = ref('');
const isCodeSent = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const sendCode = async () => {
  try {
    errorMessage.value = ''
    await $authService.sendSms(phoneNumber.value); // 명시적으로 가져온 $authService 사용
    isCodeSent.value = true;
  } catch (error) {
    console.error('Send code error:', error);
    errorMessage.value = error.message || '인증 코드를 전송하는 데 실패했습니다.';
  }
};

const handleLogin = async () => {
  try {
    errorMessage.value = '';
    const user = await $authService.verifySms(phoneNumber.value, verificationCode.value);
    // authStore.user = user; // 로그인 성공 시 useAuthStore의 user 업데이트

    // router.push('/admin/dashboard'); // 로그인 성공 시 대시보드로 이동
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.message || '로그인에 실패했습니다. 인증 코드를 확인하세요.';
  }
};

const formatPhoneInput = () => {
  phoneNumber.value = formatPhone(phoneNumber.value);
};

const formatVerificationCodeInput = () => {
  verificationCode.value = verificationCode.value.replace(/\D/g, '').slice(0, 4);
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

.login-button {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #2563eb;
}

.login-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
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
