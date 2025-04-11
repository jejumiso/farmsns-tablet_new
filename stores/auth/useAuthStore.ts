import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router'; // 라우터 가져오기
import  {  type Administrator } from '@/shared-types/administrator/administrator';
import type { Company } from '@/shared-types/company/company'; // 회사 타입 가져오기
import type { User } from 'firebase/auth'; // Firebase User 타입 가져오기
import { createAdministratorService } from '@/services/administrator/administratorService'; 
import { createCompanyService } from '@/services/company/companyService'; 
import { useProductStore } from '@/stores/product/useProductStore';
import { unwatchCompanyRealtime, watchCompanyRealtime } from '@/composables/company/useCompanyWatcher';




export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null, // Firebase Auth 유저
    currentAdministrator: null as Administrator | null, // 앱의 유저
    currentCompany: null as Company | null, // 현재 로그인한 사용자의 회사 정보
  }),
  getters: {
    user(state) {
      return state.currentUser; // getter로 Firebase 유저 반환
    },
    administrator(state) {
      return state.currentAdministrator; // getter로 앱 유저 반환
    },
    isLoggedIn(state) {
      return !!state.currentUser; // Firebase 유저가 존재하면 true 반환
    },
    company(state) {
      return state.currentCompany; // getter로 회사 정보 반환
    },
  },
  actions: {
    //핸드폰로그인을 여기에 추가했어야 했나..

    async login(email: string, password: string) {
      //이메일 로그인 없는데 지워도 되나..
      const nuxtApp = useNuxtApp()
      
      this.currentUser = await nuxtApp.$authService.login(email, password); // Firebase 로그인 처리
    },
    async logout() {
      const nuxtApp = useNuxtApp()
      await nuxtApp.$authService.logout(); // 로그아웃 처리
      this.currentUser = null; // Firebase 유저 초기화
      this.currentAdministrator = null; // 앱 유저 초기화
      this.currentCompany = null; // 회사 정보 초기화
      // ✅ 다른 저장소 초기화
      const productStore = useProductStore()
      productStore.$reset() // 상품 저장소 초기화
      console.log('[authStore] User logged out'); // 디버깅 로그 추가
      unwatchCompanyRealtime();
    },
    setFirebaseUser(user: any) {
      this.currentUser = user; // Firebase 유저 상태 업데이트
      console.log('[authStore] Firebase User set:', user);
    },
    setAppUser(administrator: Administrator) {
      this.currentAdministrator = administrator; // 앱 유저 상태 업데이트
      console.log('[authStore] App User set:', administrator);
    },
    setCompany(company: Company) {
      this.currentCompany = company; // 회사 상태 업데이트
      console.log('[authStore] Company set:', company);
    },
    initializeAuth() {
      const nuxtApp = useNuxtApp()
      const router = useRouter(); // 라우터 인스턴스 생성

      if (this.currentUser !== null) {
        console.log('[authStore] Auth already initialized');
        return; // 이미 초기화된 경우 중복 호출 방지
      }

      nuxtApp.$authService.onAuthStateChange(async (firebaseUser: any) => {
        this.currentUser = firebaseUser as User; // Firebase 인증 상태 동기화
        console.log('[authStore] Firebase Auth state changed:', firebaseUser);

        if (firebaseUser) {
          // 앱 유저 정보 가져오기
          try {
            const getAdministratorResponse = await createAdministratorService().getAdministratorById(firebaseUser.uid);
          
            if (getAdministratorResponse.isSuccess) {
              
              const getCompanyResponse = await createCompanyService().getCompanyById(getAdministratorResponse.data!.companyId);
              console.log('로그인 회사 받으 값', JSON.stringify(getCompanyResponse));
              if (getCompanyResponse.isSuccess) {
                this.currentAdministrator = getAdministratorResponse.data as Administrator
                this.currentCompany = getCompanyResponse.data as Company
                console.log('[authStore] App User and Company set:', this.currentAdministrator, this.currentCompany);
                 // ✅ 여기 추가!
                watchCompanyRealtime(this.currentCompany.id)
                

              } else {
                console.error('[authStore] Error fetching company:', getCompanyResponse.error);
              }

            } else {
              //empty : isSuccess가 false이면 어차피 catch
            }
          } catch (error: any) {
            if (error.response?.status === 404) {
              console.error('[authStore] User not found (404):', error.response.data?.message || 'No user found.');
            } else if (error instanceof Error) {
              console.error('[authStore] Error fetching app user:', error.message);
            } else {
              console.error('[authStore] Unexpected error fetching app user:', error);
            }
            this.currentAdministrator = null; // 진짜 오류 발생 시 앱 유저 초기화
            this.currentCompany = null; // 진짜 오류 발생 시 회사 정보 초기화
          }

          
        } else {
          this.currentAdministrator = null;
          this.currentCompany = null
        }

        // 현재 경로 가져오기
        const currentPath = router.currentRoute.value.path;
        const isAdminRoute = currentPath.startsWith('/admin');
        const isUserRoute = currentPath.startsWith('/user');

        if (isAdminRoute) {
          const onlyForGuests = ['/admin/login']; // 비로그인 상태에서만 접근 가능한 페이지
          const accessibleByAll = ['/admin','/admin/', '/admin/index', '/admin/welcome', '/admin/login'];

          if (firebaseUser && onlyForGuests.includes(currentPath)) {
            console.log('[authStore] 1 Redirecting to /admin/dashboard');
            return navigateTo('/admin/dashboard');
          }

          if (!firebaseUser && !accessibleByAll.includes(currentPath)) {
            console.log('[authStore] 1 Redirecting to /admin/login');
            return navigateTo('/admin/login');
          }
        } else if (isUserRoute) {
          const onlyForGuests = ['/user/login']; // 비로그인 상태에서만 접근 가능한 페이지
          const accessibleByAll = ['/user', '/user/index', '/user/welcome', '/user/login'];

          if (firebaseUser && onlyForGuests.includes(currentPath)) {
            console.log('[authStore] 2 Redirecting to /user/dashboard');
            return navigateTo('/user/dashboard');
          }

          if (!firebaseUser && !accessibleByAll.includes(currentPath)) {
            console.log('[authStore] 2 Redirecting to /user/login');
            return navigateTo('/user/login');
          }
        }
      });
    },
  },
});
