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
import { Timestamp } from 'firebase/firestore'

const router = useRouter()
const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()

const phoneNumber = ref('010-')
const formattedPhoneNumber = computed(() => convertToKoreanPhoneNumber(phoneNumber.value))
const clickCount = ref(0)

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
  } else if (key === '확인') {
    if (formattedPhoneNumber.value.length === 13) {
      try {
        const companyId = authStore.company?.id
        const adminUserId = authStore.administrator?.id
        const tabletNumber = Number(localStorage.getItem('tabletNumber'))

        if (!companyId || !adminUserId || isNaN(tabletNumber)) {
          throw new Error('회사 정보 또는 관리자 ID, 태블릿 번호가 유효하지 않습니다.')
        }

        const { rewardType, pendingRewardAmount } = tabletSettingsStore.settings
        const stamp = rewardType === 'stamp' ? pendingRewardAmount : 0
        const point = rewardType === 'point' ? pendingRewardAmount : 0
        const resUserPhoneNumber = encryptWithIv(formattedPhoneNumber.value,'')

        const pointSave: PointSaveModel = {
          id: '',
          phoneNumber: formattedPhoneNumber.value,
          idUser: resUserPhoneNumber,
          idCompany: companyId,
          idOrder: '',
          resUserPhoneNumber,
          resAdminPhoneNumber: authStore.administrator?.resPhoneNumber || '',
          saveType: '스템프적립',
          saveType2: '테블릿스템프적립',
          memo: '',
          stamp,
          point,
          stampRemaining: 0,
          pointRemaining: 0,
          tabletNum: tabletNumber,
          dateCreateyyyy: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, '')),
          dateCreateyyyyMM: parseInt(new Date().toISOString().slice(0, 7).replace(/-/g, '')),
          dateCreateyyyyMMdd: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, '')),
          adminUserId,
          dateCreate: Timestamp.now(),
        }

        const template = authStore.template
        const allimtalkRequest: AllimtalkRequest | null = template.templtCode !== '' ? {
          senderkey: template.senderKey,
          tpl_code: template.templtCode,
          sender: decryptData2(authStore.company?.kakaoInfo.resSender!),
          senddate: '',
          receiver_1: formattedPhoneNumber.value,
          recvname_1: '',
          subject_1: template.templtName,
          message_1: template.templtContent,
          emtitle_1: template.templtTitle,
          button_1: JSON.stringify({
            button: template.buttons.map((button) => ({
              name: button.name,
              linkType: button.linkType,
              linkTypeName: button.linkTypeName,
              linkMo: button.linkMo,
              linkPc: button.linkPc,
              linkIos: button.linkIos,
              linkAnd: button.linkAnd,
            })),
          }),
          failover: 'N',
          fsubject: '',
          fmessage: '',
        } : null

        await saveRewardByPhoneNumber({
          pointSave,
          allimtalkRequest,
          couponCreationConditions: authStore.collectionCouponCreationConditions,
        })

        await updatePendingReward(companyId, tabletNumber, 0)

        if (window.FlutterChannel) {
          window.FlutterChannel.postMessage(JSON.stringify({
            action: 'playAudio',
            fileName: 'reward_completed',
          }))
        }

        phoneNumber.value = '010-'

      } catch (err) {
        console.error('❌ 적립 처리 실패:', err)
        alert('적립 중 오류가 발생했습니다.')
      }
    } else {
      alert('유효한 전화번호를 입력해주세요.')
    }
  } else {
    if (phoneNumber.value.length < 13) {
      phoneNumber.value += key
    }
  }
}

const handleTitleClick = () => {
  clickCount.value++
  if (clickCount.value === 10) {
    alert('로그아웃됩니다.')
    authStore.logout()
    router.push('/tablet/login')
  }
}

onMounted(() => {
  clickCount.value = 0
})
</script>

<style scoped>
/* Tailwind CSS로 충분합니다 */
</style>
