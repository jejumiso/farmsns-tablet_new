<!-- 📁 pages/tablet/phone-input-screen.vue -->
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
      <div class="flex-[4] flex flex-col justify-center items-center border-b border-gray-300">
        <h2 class="text-2xl font-semibold mb-4">핸드폰 번호를 입력해주세요</h2>
        <div class="text-4xl font-black font-[montserrat]">
          {{ formattedPhoneNumber }}
        </div>
      </div>
      <!-- 하단 60% -->
      <div class="flex-[6]">
        <Keypad @keypadClick="handleKeypadClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import Keypad from '@/components/Keypad.vue'
import { convertToKoreanPhoneNumber } from '@/utils/common/common'
import { encryptWithIv } from '@/shared-utils/crypto/encryption'
import { decryptWithIv } from '@/shared-utils/crypto/decryption'
import { makeTimestamps } from '@/shared-utils/makeTimestamps'
import { saveRewardByPhoneNumber, updatePendingReward } from '@/services/reward/rewardService'
import type { RewardLog } from '~/shared-types/reward/rewardLog'
import type { AllimtalkRequest } from '~/shared-types/company/allim_talk_request_type'

const router = useRouter()
const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()

const phoneNumber = ref('010-')
const formattedPhoneNumber = computed(() => convertToKoreanPhoneNumber(phoneNumber.value))
const clickCount = ref(0)
const iv = authStore.company?.iv

watch(
  () => tabletSettingsStore.settings.pendingRewardAmount,
  (newValue) => {
    if (newValue > 0 && window.FlutterChannel) {
      window.FlutterChannel.postMessage(JSON.stringify({
        action: 'playAudio',
        fileName: 'phone_input_instruction'
      }))
    }
  }
)

const handleKeypadClick = async (key: string | number) => {
  if (key === '←') {
    phoneNumber.value = phoneNumber.value.slice(0, -1)
    return
  }

  if (key === '확인') {
    if (formattedPhoneNumber.value.length !== 13) {
      alert('유효한 전화번호를 입력해주세요.')
      return
    }

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
    }
    return
  }

  if (phoneNumber.value.length < 13) {
    phoneNumber.value += key.toString()
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

onMounted(() => {
  clickCount.value = 0
})
</script>

<style scoped>
/* Tailwind CSS로 충분합니다 */
</style>