<!-- 📁 pages\tablet\phone-input-screen.vue -->
<template>
  <div class="flex h-screen">
    <!-- 왼쪽 섹션 -->
    <div class="w-1/2 bg-gray-100 flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4" @click="handleTitleClick">스탬프 적립</h1>
      <p class="text-lg text-gray-600 text-center">
        입력하신 번호로 적립내역을<br />카카오톡 메시지로 보내드립니다.
      </p>
    </div>

    <!-- 오른쪽 섹션 -->
    <div class="w-1/2 bg-white flex flex-col">
    <!-- 상단 40% -->
     <div v-if="isSubmitting" class="flex-[4] w-full border-b border-gray-300 flex flex-col items-center justify-center px-4">
      
        <h2 class="text-2xl font-semibold mb-4">적립중입니다...</h2>
        <div class="text-4xl font-black font-[montserrat]">
          {{ phoneNumber }}
        </div>
      </div>
    <div v-else class="flex-[4] w-full border-b border-gray-300 flex flex-col items-center justify-center px-4">
      

      <!-- 상단 취소 버튼을 오른쪽 정렬된 줄로 배치 -->
      <div class="w-full flex justify-end">
        <button
          @click="handleCancel"
          class="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded shadow hover:bg-red-600 transition"
        >
          ✕ 취소
        </button>
      </div>

      <!-- 안내 텍스트 -->
      <div class="mt-2 text-center">
        <h2 class="text-2xl font-semibold">핸드폰 번호를 입력해주세요</h2>
      </div>

      <!-- 전화번호 -->
      <div class="mt-2 text-4xl font-black font-[montserrat]">
        {{ phoneNumber }}
      </div>
    </div>




      <!-- 하단 60% -->
      <div class="flex-[6]">
        <Keypad @keypadClick="handleKeypadClick" :isSubmitting="isSubmitting" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import Keypad from '@/components/Keypad.vue'
import { usePhoneKeypadHandler } from '@/composables/useKeypadHandler'
import { convertToKoreanPhoneNumber } from '@/utils/common/common'
import { encryptWithIv } from '@/shared-utils/crypto/encryption'
import { decryptWithIv } from '@/shared-utils/crypto/decryption'
import { makeTimestamps } from '@/shared-utils/makeTimestamps'
import { saveRewardByPhoneNumber, updatePendingReward } from '@/services/reward/rewardService'
import type { RewardLog } from '~/shared-types/reward/rewardLog'
import type { AllimtalkRequest } from '~/shared-types/company/allim_talk_request_type'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()
const clickCount = ref(0)

const { phone: phoneNumber, handleClick: handleKeypadClickBase } = usePhoneKeypadHandler('010-')
const formattedPhoneNumber = computed(() => convertToKoreanPhoneNumber(phoneNumber.value))
const isSubmitting = ref(false)
const handleKeypadClick = async (key: string | number) => {
  const valid = handleKeypadClickBase(key)

  if (key !== '확인' || valid !== true) return
  if (isSubmitting.value) return // 연타 방지

  isSubmitting.value = true // 요청 시작

  try {
    const companyId = authStore.company?.id
    const adminUserId = authStore.administrator?.id
    const tabletNum = Number(localStorage.getItem('tabletNumber'))

    if (!companyId || !adminUserId || isNaN(tabletNum)) {
      throw new Error('회사 ID, 관리자 ID 또는 태블릿 번호가 유효하지 않습니다.')
    }

    const { rewardType, pendingRewardAmount } = tabletSettingsStore.settings
    const last8Digits = formattedPhoneNumber.value.slice(4)
    const ivStr = authStore.company?.iv
    if (!ivStr) throw new Error('IV 정보가 없습니다.')

    const encryptedPhone = encryptWithIv(last8Digits, ivStr)
    const adminSecuredPhone = authStore.currentAdministrator?.contactInfo.securedPhoneMain ?? ''
    const timestamps = makeTimestamps()

    const rewardLog: RewardLog = {
      id: '',
      companyId,
      uid: '',
      orderId: '',
      adminUserId,
      securedPhone: encryptedPhone,
      adminSecuredPhone,
      stamp: rewardType === 'stamp' ? pendingRewardAmount : 0,
      point: rewardType === 'point' ? pendingRewardAmount : 0,
      usedStamp: 0,
      usedPoint: 0,
      stampRemaining: 0,
      pointRemaining: 0,
      tabletNum,
      rewardType: rewardType === 'stamp' ? 'stampSave' : 'pointSave',
      memo: '',
      ...timestamps,
      source: 'tablet'
    }

    const template = authStore.kakaoAlimTemplate
    if (!template) {
      alert('알림톡 템플릿이 설정되지 않았습니다.')
      return
    }

    const securedSender = authStore.company?.kakaoInfo?.securedSender
    if (!securedSender) {
      alert('카카오 발신자 정보가 없습니다.')
      return
    }

    const allimtalkRequest: AllimtalkRequest = {
      senderkey: template.senderKey,
      tpl_code: template.templtCode,
      sender: decryptWithIv(securedSender, ivStr),
      senddate: '',
      receiver_1: formattedPhoneNumber.value,
      recvname_1: '',
      subject_1: template.templtName,
      message_1: template.templtContent,
      emtitle_1: template.templtTitle,
      button_1: JSON.stringify({
        button: template.buttons.map((btn) => ({
          name: btn.name,
          linkType: btn.linkType,
          linkTypeName: btn.linkTypeName,
          linkMo: btn.linkMo,
          linkPc: btn.linkPc,
          linkIos: btn.linkIos,
          linkAnd: btn.linkAnd
        }))
      }),
      failover: 'N',
      fsubject: '',
      fmessage: ''
    }

    await saveRewardByPhoneNumber({
      rewardLog,
      allimtalkRequest,
      couponDefinitions: authStore.couponDefinition,
      iv: ivStr
    })

    await updatePendingReward(companyId, tabletNum, 0)

    window.FlutterChannel?.postMessage(JSON.stringify({
      action: 'playAudio',
      fileName: 'reward_completed'
    }))

    phoneNumber.value = '010-'

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    alert('적립 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false // 요청 종료
  }
}

const handleTitleClick = () => {
  clickCount.value++
  if (clickCount.value === 10) {
    alert('로그아웃됩니다.')
    authStore.logout()
    setTimeout(() => {
      router.push('/tablet/login')
    }, 100)
  }
}

const handleCancel = async () => {
  const companyId = authStore.company?.id
  const tabletNum = Number(localStorage.getItem('tabletNumber'))

  if (!companyId || isNaN(tabletNum)) {
    alert('회사 ID 또는 태블릿 번호가 유효하지 않습니다.')
    return
  }

  try {
    await updatePendingReward(companyId, tabletNum, 0)
    tabletSettingsStore.settings.pendingRewardAmount = 0
    phoneNumber.value = '010-'
  } catch (err) {
    console.error('❌ 취소 처리 실패:', err)
    alert('취소 중 오류가 발생했습니다.')
  }
}


onMounted(() => {
  clickCount.value = 0
})
</script>

<style scoped>
/* Tailwind CSS로 충분합니다 */
</style>
