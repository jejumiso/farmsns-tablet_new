import { purgeExpiredCompanyCaches } from "~/utils/cache/companyCache"

export default defineNuxtPlugin(() => {
    purgeExpiredCompanyCaches()
  })
  