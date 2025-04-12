<template>
  <aside class="w-64 bg-gray-800 text-white flex flex-col">
    <div class="p-4 text-lg font-bold border-b border-gray-700">관리자 메뉴</div>
    <nav class="flex-1">
      <ul>

        
        <li>
          <button
            @click="$emit('navigate', '/admin/invoice')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/invoice' ? 'bg-gray-600' : '']"
          >
            <RocketLaunchIcon class="h-5 w-5 mr-2" />
            송장발송
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/invoice2')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/invoice2' ? 'bg-gray-600' : '']"
          >
            <PencilIcon class="h-5 w-5 mr-2" />
            송장발송2
          </button>
        </li>

        
        <li>
          <button
            @click="toggleProductMenu"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', isProductMenuOpen ? 'bg-gray-600' : '']"
          >
            <WrenchIcon class="h-5 w-5 mr-2" />
            상품관리
          </button>
          <ul v-if="isProductMenuOpen" class="pl-6">
            <li>
              <button
                @click="$emit('navigate', '/admin/product')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/product' ? 'bg-gray-600' : '']"
              >
                상품
              </button>
            </li>
            <li>
              <button
                @click="$emit('navigate', '/admin/option')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/option' ? 'bg-gray-600' : '']"
              >
                옵션
              </button>
            </li>
            <li>
              <button
                @click="$emit('navigate', '/admin/option-group')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/option-group' ? 'bg-gray-600' : '']"
              >
                옵션그룹
              </button>
            </li>
            <li>
              <button
                @click="$emit('navigate', '/admin/category')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/category' ? 'bg-gray-600' : '']"
              >
                카테고리
              </button>
            </li>
          </ul>
        </li>
        <li v-if="authStore.administrator === null || authStore.currentCompany === null">
          <button
            @click="$emit('navigate', '/admin/join')"
            :class="['w-full text-left px-4 py-2 flex items-center font-bold', currentPath === '/admin/join' ? 'bg-yellow-500 text-black' : 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black']"
          >
            <PencilIcon class="h-5 w-5 mr-2" />
            이용신청
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/dashboard')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/dashboard' ? 'bg-gray-600' : '']"
          >
            <HomeIcon class="h-5 w-5 mr-2" />
            홈
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/invite')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/invite' ? 'bg-gray-600' : '']"
          >
            <ShareIcon class="h-5 w-5 mr-2" />
            초대
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/settings')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/settings' ? 'bg-gray-600' : '']"
          >
            <WrenchIcon class="h-5 w-5 mr-2" />
            셋팅
          </button>
        </li>
      </ul>
    </nav>
    <!-- ✅ 상품만 새로 동기화하는 버튼 -->
<button @click="syncProductStore" class="bg-blue-600 text-white px-4 py-2 m-2 rounded hover:bg-blue-700">
  상품 동기화
</button>
    <!-- 임시 저장소 초기화 버튼 -->
<button @click="resetStores" class="reset-button">
  저장소 초기화
</button>
    <button @click="logout" class="logout-button">
      {{ authStore.currentCompany === null || authStore.currentCompany.shopName === '' ? '관리자' : authStore.currentCompany.shopName  }} &nbsp;
      <PowerIcon class="h-5 w-5 mr-2" />
    </button>

  </aside>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { HomeIcon, PencilIcon, PowerIcon, ShareIcon, RocketLaunchIcon, WrenchIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'


const productStore = useProductStore()

function resetStores() {
  productStore.$reset()
  useCategoryStore().$reset()
  useOptionStore().$reset()
  useOptionGroupStore().$reset()
  console.log('🧹 저장소 초기화 완료')
}
async function syncProductStore() {
  await productStore.syncWithServer()
  alert('상품 동기화 완료')
}

const router = useRouter();
const currentPath = ref('');
const isProductMenuOpen = ref(false);

const authStore = useAuthStore();

function toggleProductMenu() {
  isProductMenuOpen.value = !isProductMenuOpen.value;
}

async function logout() {
  try {
    await authStore.logout(); // 로그아웃 처리
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}

// 현재 경로를 감시하여 상품관리 메뉴를 자동으로 열기
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    currentPath.value = newPath;
    // 상품, 옵션, 옵션그룹, 카테고리 경로일 때 상품관리 메뉴 열기
    const productPaths = [
      '/admin/product',
      '/admin/product/create',
      '/admin/product/edit/[id]', // 🔥 추가!
      '/admin/option',
      '/admin/option/create',
      '/admin/option/edit/[id]', // 🔥 추가!      
      '/admin/option-group',
      '/admin/categories',
    ];

    const isProductPath =
      productPaths.includes(newPath) ||
      productPaths.some(path =>
        path.includes('[id]') && (newPath.startsWith('/admin/product/edit/') || newPath.startsWith('/admin/option/edit/'))
      );

    isProductMenuOpen.value = isProductPath;
  },
  { immediate: true }
);
</script>

<style scoped>
.logout-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex; /* 기존 */
  align-items: center; /* 기존 */
  justify-content: center; /* 추가 */
}

.logout-button:hover {
  background-color: #dc2626;
}

.reset-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reset-button:hover {
  background-color: #2563eb;
}

</style>