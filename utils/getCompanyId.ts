import { useAuthStore } from "~/stores/auth/useAuthStore";

export function getCompanyId(): string | null {
    return useAuthStore().currentCompany?.id || null
  }
  