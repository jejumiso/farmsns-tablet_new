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
import { type PointSave } from '@/shared-types/reward/pointSave'
import type { KakaoAlimTemplate } from '~/shared-types/kakao/templateResponse'
import { Timestamp } from '~/shared/firebase/firebaseTypes'
import type { AllimtalkRequest } from '~/shared-types/company/allim_talk_request_type'
import { decryptWithIv } from '~/shared-utils/crypto/decryption'
import { makeTimestamps } from '~/shared-utils/makeTimestamps'
import { saveRewardByPhoneNumber, updatePendingReward } from '~/services/reward/rewardService'

const router = useRouter()
const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()

const phoneNumber = ref('010-')
const formattedPhoneNumber = computed(() => convertToKoreanPhoneNumber(phoneNumber.value))
const clickCount = ref(0)
const iv = authStore.company?.iv;

// 🎧 안내 음성
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
      const stamp = rewardType === 'stamp' ? pendingRewardAmount : 0
      const point = rewardType === 'point' ? pendingRewardAmount : 0

      // 1. '1234-1234' 부분만 추출
      const last8Digits = formattedPhoneNumber.value.slice(4) // '010-' 이후 부분
      // 2. IV 문자열은 회사 정보에서 가져옴 (항상 존재해야 함)
      const ivStr = authStore.company?.iv
      if (!ivStr) {
        throw new Error('IV 정보가 없습니다.')
      }
      // 3. 암호화 수행
      const encryptedPhone = encryptWithIv(last8Digits, ivStr)
      const adminSecuredPhone = authStore.currentAdministrator?.contactInfo.securedPhoneMain??''

      const pointSave: PointSave = {
        id: '',
        companyId: '',
        userId: '',
        orderId: '',
        adminUserId: '',
        securedPhone: encryptedPhone,
        adminSecuredPhone: adminSecuredPhone,
        stamp: tabletSettingsStore.settings.rewardType === 'stamp' ? pendingRewardAmount : 0,
        point: tabletSettingsStore.settings.rewardType === 'point' ? pendingRewardAmount : 0,
        stampRemaining: 0,
        pointRemaining: 0,
        tabletNum: Number(localStorage.getItem('tabletNumber')),
        rewardType: tabletSettingsStore.settings.rewardType,
        memo: '',
        ...
        makeTimestamps()
      }

      // 알림톡 템플릿 구성
      const template = authStore.kakaoAlimTemplate
      if(template == null) {
        alert('알림톡 템플릿이 설정되지 않았습니다.')
        return
      }
      const allimtalkRequest: AllimtalkRequest ={
            senderkey: template.senderKey,
            tpl_code: template.templtCode,
            sender: decryptWithIv(authStore.company?.kakaoInfo.securedSender!,ivStr),
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

      // const result = await saveRewardByPhoneNumber({
      //   pointSave,
      //   allimtalkRequest,
      //   couponCreationConditions: authStore.couponDefinition
      // })

      await updatePendingReward(companyId, tabletNum, 0)

      window.FlutterChannel?.postMessage(JSON.stringify({
        action: 'playAudio',
        fileName: 'reward_completed'
      }))

      phoneNumber.value = '010-' // 초기화

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
    }, 100) // ✅ 미들웨어가 auth 상태 갱신을 반영할 시간 확보
  }
}

onMounted(() => {
  clickCount.value = 0
})
</script>

<style scoped>
/* Tailwind CSS로 충분합니다 */
</style>
