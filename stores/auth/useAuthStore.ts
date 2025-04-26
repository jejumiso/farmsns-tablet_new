// stores/auth/useAuthStore.ts
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import type { User } from 'firebase/auth'
import type { Administrator } from '@/shared-types/administrator/administrator'
import type { Company } from '@/shared-types/company/company'
import { createAdministratorService } from '@/services/administrator/administratorService'
import { createCompanyService } from '@/services/company/companyService'
import { stopCompanyRealtimeWatcher } from '~/utils/watchCompanyRealtime'
import { clearAllCompanyCaches } from '~/utils/cache/companyCache'
import { handleCompanyChange } from '~/composables/company/useCompanyChange'
import { useTabletSettingsStore } from '../tablet/useTabletSettingsStore'
import { createEmptyTemplate, type KakaoAlimTemplate } from '~/shared-types/kakao/templateResponse'
import { useAlimtalkTemplates } from '~/composables/alimtalk/useAlimtalkTemplates'
import type { CouponDefinition } from '~/shared-types/coupon/couponDefinition'
import { useCouponDefinition } from '~/composables/couponDefinition/userCouponDefinition'
import { useTabletSettingsWatcher } from '~/composables/tablet/useTabletSettingsListener'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    initialized: false,
    currentUser: null as User | null,
    currentAdministrator: null as Administrator | null,
    currentCompany: null as Company | null,
    kakaoAlimTemplate: null as KakaoAlimTemplate | null, // ✅ 알림톡 템플릿 정보
    couponDefinition : [] as CouponDefinition[], // 스탬프 적립시 쿠폰 발급 조건

  }),
  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    user: (state) => state.currentUser,
    administrator: (state) => state.currentAdministrator,
    company: (state) => state.currentCompany,
  },
  actions: {
    async login(email: string, password: string) {
      const nuxtApp = useNuxtApp()
      this.currentUser = await nuxtApp.$authService.login(email, password)
    },

    async logout() {
      const nuxtApp = useNuxtApp()
      await nuxtApp.$authService.logout()
    
      this.currentUser = null
      this.currentAdministrator = null
      this.currentCompany = null
    
      // ✅ 태블릿 상태 초기화
      const tabletSettingsStore = useTabletSettingsStore()
      tabletSettingsStore.reset()
    
      // ✅ 실시간 리스너 중단
      const { stop: stopTabletWatcher } = useTabletSettingsWatcher()
      stopTabletWatcher();
    
      clearAllCompanyCaches()
      stopCompanyRealtimeWatcher()
    },

    setFirebaseUser(user: User | null) {
      this.currentUser = user
      console.log('[authStore] Firebase User set:', user)
    },

    setAppUser(admin: Administrator) {
      this.currentAdministrator = admin
      console.log('[authStore] App User set:', admin)
    },

    setCompany(company: Company) {
      this.currentCompany = company
      console.log('[authStore] Company set:', company)
    },

    async initializeAuth(): Promise<void> {
      const nuxtApp = useNuxtApp()
    
      return new Promise((resolve) => {
        nuxtApp.$authService.onAuthStateChange(async (firebaseUser: User | null) => {
          this.setFirebaseUser(firebaseUser)
    
          if (firebaseUser) {
            try {
              const adminRes = await createAdministratorService().getById('', firebaseUser.uid)
              console.log('어드민 데이터 요청 결과 : ', JSON.stringify(adminRes))
              
              if (adminRes.isSuccess) {
                const admin = adminRes.data!
                const companyRes = await createCompanyService().getById('', admin.companyId)
                
                if (companyRes.isSuccess) {
                  // 1️⃣ 관리자 및 회사 정보 저장
                  this.currentAdministrator = admin
                  this.currentCompany = companyRes.data!
                
                  // 2️⃣ 알림톡 템플릿 불러오기 (회사 kakaoChannelId 기준)
                  await useAlimtalkTemplates()
                  // 3️⃣ 쿠폰 발급 조건 불러오기 (회사 ID 기준)
                  await useCouponDefinition()
                
                  // 4️⃣ 태블릿 설정 리스닝 시작 (Firestore 실시간 구독)
                  const { start: startTabletWatcher } = useTabletSettingsWatcher()
                  const tabletNumber = Number(localStorage.getItem('tabletNumber') || '1')
                  console.log('[authStore] 테블릿 와칭 스타트', tabletNumber)
                  startTabletWatcher(this.currentCompany.id, tabletNumber)
                }
                 else {
                  
                  console.error('[authStore] Error fetching company:', companyRes.error)
                }
              }
            } catch (error: any) {
              
              console.error('[authStore] Error during user/company fetch:', error)
              this.currentAdministrator = null
              this.currentCompany = null
            }
          } else {
            this.currentAdministrator = null
            this.currentCompany = null
          }
    
          this.initialized = true
          resolve() // ✅ 모든 처리 후에 resolve 호출!
        })
      })
    }
  }
})
