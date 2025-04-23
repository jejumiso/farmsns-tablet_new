<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-yellow-400 px-4 space-y-8">
    <!-- 회사 소개 -->
    <div class="text-center text-black space-y-4">
      <h1 class="text-4xl font-bold">우리포인트</h1>
      <p class="text-lg">카카오톡으로 매출을 높여요</p>
    </div>

    <!-- 로그인 카드 -->
    <div class="w-full max-w-md bg-white shadow-2xl rounded-lg overflow-hidden">
      <div class="p-8 space-y-6">
        <!-- 핸드폰 번호 -->
        <div class="space-y-2">
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">핸드폰 번호</label>
          <input
            id="phoneNumber"
            v-model="phoneNumber"
            type="tel"
            placeholder="010-1234-5678"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @input="formatPhoneInput"
            :disabled="isCodeSent"
          />
        </div>

        <!-- 코드 전송 -->
        <button
          @click="sendCode"
          :disabled="phoneNumber.length !== 13"
          class="w-full py-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          v-if="!isCodeSent"
        >
          인증 코드 요청
        </button>

        <!-- 인증 코드 입력 -->
        <div v-if="isCodeSent" class="space-y-2">
          <label for="verificationCode" class="block text-sm font-medium text-gray-700">인증 코드</label>
          <input
            id="verificationCode"
            v-model="verificationCode"
            type="text"
            placeholder="4자리 인증 코드"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            @input="formatVerificationCodeInput"
          />
        </div>

        <!-- 로그인 버튼 -->
        <button
          @click="handleLogin"
          class="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          :disabled="verificationCode.length !== 4"
          v-if="isCodeSent"
        >
          인증 확인
        </button>

        <!-- 에러 메시지 -->
        <p v-if="errorMessage" class="text-sm text-red-500 text-center">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty', // layouts/empty.vue 사용
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatPhone } from '@/shared-utils/common'
import { useNuxtApp } from '#app'

const phoneNumber = ref('010-')
const verificationCode = ref('')
const isCodeSent = ref(false)
const errorMessage = ref('')
const router = useRouter()
const nuxtApp = useNuxtApp()

// 인증 요청
const sendCode = async () => {
  try {
    errorMessage.value = ''
    await nuxtApp.$authService.sendSms(phoneNumber.value)
    isCodeSent.value = true
  } catch (error: any) {
    errorMessage.value = error.message || '인증 코드 전송 실패'
    console.error(error)
  }
}

// 로그인 처리
const handleLogin = async () => {
  try {
    errorMessage.value = ''
    const user = await nuxtApp.$authService.verifySms(phoneNumber.value, verificationCode.value)
    if (user) {
      router.push('/tablet')
    }
  } catch (error: any) {
    errorMessage.value = error.message || '인증 실패'
    console.error(error)
  }
}

// 포맷팅
const formatPhoneInput = () => {
  phoneNumber.value = formatPhone(phoneNumber.value)
}

const formatVerificationCodeInput = () => {
  verificationCode.value = verificationCode.value.replace(/\D/g, '').slice(0, 4)
}
</script>
