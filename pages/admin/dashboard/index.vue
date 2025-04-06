<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <SidebarMenu @navigate="navigateTo" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-8">
      
      <!-- App Description Section -->
      <section class="app-description bg-white p-6 rounded-lg shadow-lg mb-8">
        <div class="space-y-6">
          <div>
            <span class="text-base text-gray-600 font-medium">카카오톡으로 송장번호 전송</span>
            <p class="text-sm text-gray-600 mt-2">
              엑셀 데이터를 복사 붙여 넣으면 끝.
            </p>
          </div>
          <div>
            <span class="text-base text-gray-600 font-medium">카카오톡에서 바로 주문</span>
            <p class="text-sm text-gray-600 mt-2">
              고객은 카카오톡으로 송장번호를 수신하여여<br />
              송장번호 조회 및<br />
              카톡에서 상품을 바로 주문도 할 수 있어요.<br />
              
            </p>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';

const router = useRouter();
const authStore = useAuthStore();

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
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>
