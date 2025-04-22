<template>
  <div class="flex min-h-screen bg-gray-100 p-6 space-x-6">

    <!-- 왼쪽: 인증번호 등록 -->
    <main class="flex-1 bg-white p-6 rounded shadow-md max-w-md">
      <p>카카오 채널의 등록 후 이용이 가능합니다.</p>
      <a @click="showPopup = true" class="text-blue-500 cursor-pointer mb-4 inline-block">
        카카오채널 ID 등록방법
      </a>

      <!-- 기존 인증 폼 -->
      <form>
        <!-- 카카오 ID -->
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
        <!-- 핸드폰 번호 -->
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
        <!-- 인증번호 발송 버튼 -->
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
        <!-- 인증번호 입력 -->
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

    <!-- 오른쪽: SenderKey 등록 -->
    <aside class="flex-1 bg-white p-6 rounded shadow-md max-w-md flex flex-col justify-center">
      <p class="text-lg font-bold mb-4">이미 등록이 되어 있나요?</p>
      <p class="mb-4">senderkey를 입력해주세요.</p>
      <input
        v-model="senderKey"
        type="text"
        class="w-full px-3 py-2 border rounded mb-4"
        placeholder="SenderKey를 입력하세요"
      />
      <button
        @click="registerSenderKey"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        :disabled="!senderKey"
        :class="{ 'cursor-not-allowed bg-gray-400': !senderKey }"
      >
        등록하기
      </button>
    </aside>

    <!-- 팝업 -->
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
import { encryptWithIv } from '@/shared-utils/crypto/encryption';
import { createEmptyAdministrator, type Administrator } from '@/shared-types/administrator/administrator';
import { createEmptyCompany, type Company } from '@/shared-types/company/company';
import { formatPhone } from '@/shared-utils/common';
import crypto from 'crypto'
import { generateRandomIv } from '@/utils/crypto/generateRandomIv';
const router = useRouter();
const authStore = useAuthStore();

const nuxtApp = useNuxtApp()


const form = ref({
  kakaoId: '@farmsns',
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
    console.error('인증번호 발송 실패~:', error);
    alert('인증번호 발송 중 오류가 발생했습니다.');
  }
}
const senderKey = ref('0bf4b6d7f8058708198a81b8a47db020e2f9bb6b')
async function registerSenderKey() {
  await handleSuccessfulVerification(senderKey.value);
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
    const ivBase64 = generateRandomIv(); // ✅ 브라우저용 IV 생성
    const shopName = result2.data.name;
    const newCompany : Company = createEmptyCompany() as Company;
    newCompany.businessInfo.shopName = shopName;
    newCompany.kakaoInfo.kakaoChannelId = form.value.kakaoId;
    newCompany.kakaoInfo.securedSenderKey = encryptWithIv(senderKey,ivBase64);
    newCompany.kakaoInfo.securedSender = encryptWithIv(form.value.phoneNumber,ivBase64);
    

    const raw = form.value.phoneNumber;                   // '010-1234-1234'
    const digits = raw.replace(/\D/g, '');                // '01012341234'
    const last8  = digits.slice(-8);                      // '12341234'
    const dashedPhone = last8.replace(/(\d{4})(\d{4})/, '$1-$2'); // '1234-1234'

    const securedPhone = encryptWithIv(dashedPhone, ivBase64) // iv는 별도로 생성
    const phoneSuffix = dashedPhone.slice(-4)

    const newAdmin = createEmptyAdministrator({
      uid:authStore.user!.uid,
      securedPhone: securedPhone,
      phoneSuffix: phoneSuffix,
      searchField:[],
      iv: ivBase64

    }) as Administrator;

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
