<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SidebarMenu @navigate="navigateTo"  />

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <div v-if="authStore.currentAdministrator === null || authStore.company === null" class="login-status bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18h.01M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12s4.03 9 9 9 9-4.03 9-9z"></path>
          </svg>
          <p>이용신청을 해야 이용이 가능 합니다. </p>
        </div>
      </div>
      <div v-else-if="authStore.company?.kakaoInfo?.noticeCodeDeliveryStart === ''" class="login-status bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-4">
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 18h.01M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12s4.03 9 9 9 9-4.03 9-9z"></path>
          </svg>
          <p>카카오 알림 심사중입니다.(0~5일 소요) </p>
        </div>
      </div>


      <!-- Input Section -->
      <section class="input-section bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">송장번호 입력</h2>
        <textarea 
          v-model="excelData" 
          class="w-full p-2 border rounded mb-4" 
          rows="6" 
          placeholder="엑셀에서 복사한 값을 여기에 붙여넣으세요">
        </textarea>
        <button 
          @click="sendData" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          변환
        </button>
      </section>

      <!-- Extracted Data Table -->
      <section v-if="extractedData.length" class="mt-6 bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">추출된 데이터</h2>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">이름</th>
              <th class="border border-gray-300 px-4 py-2">전화번호</th>
              <th class="border border-gray-300 px-4 py-2">등기번호</th>
              <th 
                v-for="(field, index) in maxUnprocessedFields" 
                :key="index" 
                class="border border-gray-300 px-4 py-2">
                변환 불가 필드 {{ index + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(data, index) in extractedData" 
              :key="index" 
              :class="{'bg-red-100': data.hasInvalidFields}">
              <td class="border border-gray-300 px-4 py-2">{{ data.name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ data.phone }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ data.trackingNumber }}</td>
              <td 
                v-for="(field, fieldIndex) in data.unprocessedFields" 
                :key="fieldIndex" 
                class="border border-gray-300 px-4 py-2">
                {{ field }}
              </td>
              <!-- 빈 칸 채우기 -->
              <td 
                v-for="emptyIndex in maxUnprocessedFields - data.unprocessedFields.length" 
                :key="'empty-' + emptyIndex" 
                class="border border-gray-300 px-4 py-2">
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';
import { ref, computed } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

const excelData = ref(''); // 엑셀 데이터 저장
const extractedData = ref([]); // 추출된 데이터 저장

// 최대 변환 불가 필드 수 계산
const maxUnprocessedFields = computed(() => {
  return Math.max(...extractedData.value.map(data => data.unprocessedFields.length), 0);
});

function navigateTo(path) {
  router.push(path); // 지정된 경로로 이동
}

async function handleLogout() {
  try {
    await authStore.logout(); // 로그아웃 처리
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}

function sendData() {
  if (excelData.value.trim() === '') {
    alert('송장번호를 입력해주세요.');
    return;
  }

  // 데이터 분석 로직
  const lines = excelData.value.split('\n').filter(line => line.trim() !== '');
  const maxFields = Math.max(
    ...lines.map(line => line.split(/\s+/).length)
  );

  const allExtractedData = lines.map(line => {
    const parts = line.split(/\s+/);

    // 빈 값일 경우 예외 처리
    if (parts.every(part => part.trim() === '')) {
      return {
        name: '이름 없음',
        phone: '전화번호 없음',
        trackingNumber: '등기번호 없음',
        unprocessedFields: [],
      };
    }

    // 필드 수를 맞추기 위해 부족한 필드는 빈 문자열로 채움
    while (parts.length < maxFields) {
      parts.push('');
    }

    const name = parts.find(part => /[\uac00-\ud7a3a-zA-Z]+/.test(part)) || '이름 없음'; // 이름 추출
    const phone = parts.find(part => /\d{3}-\d{4}-\d{4}/.test(part) || /^010\d{8}$/.test(part)) || '전화번호 없음'; // 전화번호 추출
    const trackingNumber = parts.find(part => /^\d{10,}$/.test(part)) || '등기번호 없음'; // 10자리 이상의 숫자 추출

    // 변환되지 않은 필드 추출
    const unprocessedFields = parts.map((part, index) => {
      if (part === name || part === phone || part === trackingNumber || part.trim() === '') {
        return null;
      }
      return part;
    }).filter(Boolean);

    return { name, phone, trackingNumber, unprocessedFields };
  });

  // 필드별로 성공 여부를 확인
  const fieldSuccess = {
    phone: allExtractedData.some(data => data.phone !== '전화번호 없음'),
    trackingNumber: allExtractedData.some(data => data.trackingNumber !== '등기번호 없음'),
  };

  // 각 행의 변환 실패 여부 확인
  extractedData.value = allExtractedData.map(data => {
    const hasInvalidFields =
      (fieldSuccess.phone && data.phone === '전화번호 없음') ||
      (fieldSuccess.trackingNumber && data.trackingNumber === '등기번호 없음');

    return { ...data, hasInvalidFields };
  });

  console.log('추출된 데이터:', extractedData.value);
}
</script>

<style scoped>
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
.app-description {
  margin-bottom: 1.5rem;
}
.input-section textarea {
  resize: none;
}
.bg-red-100 {
  background-color: #fee2e2;
}
</style>
