<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SidebarMenu @navigate="navigateTo" />

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <p>카카오 채널의 등록 후 이용이 가능합니다.</p>
      <a @click="showPopup = true" class="text-blue-500 cursor-pointer mb-4 inline-block">
        카카오채널 ID 등록방법
      </a>

      <form class="bg-white p-4 rounded shadow-md max-w-md">
        <div class="mb-4">
          <label for="kakaoId" class="block text-gray-700 font-bold mb-2">카카오채널 검색용 아이디</label>
          <input
            v-model="form.kakaoId"
            id="kakaoId"
            type="text"
            class="w-full px-3 py-2 border rounded"
            placeholder="카카오 ID를 입력하세요"
            @input="formatKakaoIdInput"
          />
        </div>
        <div class="mb-4">
          <label for="phoneNumber" class="block text-gray-700 font-bold mb-2">핸드폰 번호</label>
          <input
            v-model="form.phoneNumber"
            id="phoneNumber"
            type="text"
            class="w-full px-3 py-2 border rounded"
            placeholder="핸드폰 번호를 입력하세요"
            @input="formatPhoneInput"
          />
          <span class="text-red-500 text-sm">! 카카오채널 관리자에 등록된 핸드폰 번호만 인증가능</span>
          <a
            href="https://accounts.kakao.com/login/?continue=https%3A%2F%2Fcenter-pf.kakao.com%2Fsettings%2Faccount#login"
            target="_blank"
            class="text-blue-500 text-sm cursor-pointer mb-4 inline-block"
          >
            카카오채널 관리자 핸드폰번호 확인하기
          </a>
        </div>

        <button 
          @click="sendVerificationCode" 
          type="button" 
          class="px-4 py-2 text-white rounded hover:bg-blue-600"
          :class="{
            'bg-blue-500': form.phoneNumber.length === 13 && form.kakaoId.length >= 3,
            'bg-gray-400 cursor-not-allowed': form.phoneNumber.length !== 13 || form.kakaoId.length < 3
          }"
          :disabled="form.phoneNumber.length !== 13 || form.kakaoId.length < 3"
        >
          인증번호 발송
        </button>

        <div v-if="verificationSent" class="mt-4">
          <label for="verificationCode" class="block text-gray-700 font-bold mb-2">인증번호</label>
          <input
            v-model="form.verificationCode"
            id="verificationCode"
            type="text"
            class="w-full px-3 py-2 border rounded"
            placeholder="인증번호를 입력하세요"
            @input="formatVerificationCodeInput"
          />
          <button 
            @click="verifyCode" 
            type="button" 
            class="mt-2 px-4 py-2 text-white rounded hover:bg-green-600"
            :class="{
              'bg-green-500': form.verificationCode.length === 6,
              'bg-gray-400 cursor-not-allowed': form.verificationCode.length !== 6
            }"
            :disabled="form.verificationCode.length !== 6"
          >
            인증번호 확인
          </button>
        </div>
      </form>
    </main>

    <!-- Popup -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <KakaoChannelGuide />
        <button @click="showPopup = false" class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';
import KakaoChannelGuide from './kakao-channel-guide.vue';

import { createKakaoService } from '@/services/kakao/kakaoService';
import { createAuthService } from '@/services/auth/authService';
import { encryptAndUrlSafe2 } from '@/shared-utils/encryption';
import { createEmptyAdministrator, type Administrator } from '@/shared-types/administrator/administrator';
import { createEmptyCompany, type Company } from '@/shared-types/company/company';
import { formatPhone } from '@/shared-utils/common';

const router = useRouter();
const authStore = useAuthStore();

const nuxtApp = useNuxtApp()


const form = ref({
  kakaoId: '@moapoint',
  phoneNumber: '010-4775-2111',
  verificationCode: '',
});

const showPopup = ref(false);
const verificationSent = ref(false);

const formatPhoneInput = () => {
  form.value.phoneNumber = formatPhone(form.value.phoneNumber);
};

const formatKakaoIdInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  if (!value.startsWith('@')) {
    value = '@' + value.replace(/@/g, '');
  }
  form.value.kakaoId = value.replace(/[^a-zA-Z0-9@]/g, '');
};

const formatVerificationCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  form.value.verificationCode = input.value.replace(/\D/g, '').slice(0, 6);
};

function navigateTo(path: string) {
  router.push(path);
}

async function handleLogout() {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}

async function sendVerificationCode() {
  try {
    const result = await createKakaoService().profileAuth(form.value.kakaoId, form.value.phoneNumber);
    if (result.isSuccess) {
      verificationSent.value = true;
      alert('인증번호를 확인해주세요');
    } else {
      alert(`인증번호 발송 실패: ${result.message}`);
    }
  } catch (error) {
    console.error('인증번호 발송 실패:', error);
    alert('인증번호 발송 중 오류가 발생했습니다.');
  }
}

async function verifyCode() {
  try {
    const thirdBusinessTypeCode = '00600040001';
    const authnum = form.value.verificationCode;
    if (authnum.length < 6) {
      alert('인증번호를 6자리로 입력해주세요.');
      return;
    }

    const result = await createKakaoService().profileAdd(
      form.value.kakaoId,
      authnum,
      form.value.phoneNumber,
      thirdBusinessTypeCode
    );
    console.log('인증번호 확인 결과:', result);
    console.log('인증번호 확인 결과:', JSON.stringify(result));

    if (result.isSuccess) {
      await handleSuccessfulVerification(result.data);
    } else {
      await handleSuccessfulVerification(result.data);
      alert('인증번호 확인 실패');
    }
  } catch (error) {
    console.error('인증번호 확인 실패:', error);
    alert('인증번호 확인 중 오류가 발생했습니다.');
  }
}

async function handleSuccessfulVerification(senderKey: string) {
  try {
    const result2 = await createKakaoService().getFriendBySenderKey(senderKey);
    if (!result2.isSuccess) {
      alert('카카오 친구 정보 가져오기 실패');
      return;
    }

    console.log('새로 등록 할 플친 정보:', result2);

    const shopName = result2.data.name;
    const newCompany : Company = createEmptyCompany() as Company;
    newCompany.shopName = shopName;
    newCompany.kakaoInfo.kakaoChannelId = form.value.kakaoId;
    newCompany.kakaoInfo.resSenderKey = encryptAndUrlSafe2(senderKey);
    newCompany.kakaoInfo.resSender = encryptAndUrlSafe2(form.value.phoneNumber);

    const newAdmin = createEmptyAdministrator();
    alert(authStore.user!.uid);

    newAdmin.id = authStore.user!.uid;
    console.log('새로 등록 할 회사 정보:', newCompany);
    const result = await nuxtApp.$authService.addAdministratorAndCompany(newAdmin, newCompany);

    if (result.isSuccess) {
      // authStore.setAppUser(newAdmin);
      // authStore.setCompany(newCompany);
      alert('회원가입이 완료되었습니다.');
      // router.push('/admin/dashboard');
      window.location.href = '/admin'; // 루트 페이지로 이동하면서 새로고침

    } else {
      alert('회원가입 실패');
    }
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error);
    alert('회원가입 처리 중 오류가 발생했습니다.');
  }
}
</script>
