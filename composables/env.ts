// composables/env.ts
export const getEnv = () => {
    const config = useRuntimeConfig()
  
    return {
      firebaseApiKey: config.public.FIREBASE_API_KEY as string,
      firebaseProjectId: config.public.FIREBASE_PROJECT_ID as string,
      firebaseAuthDomain: config.public.FIREBASE_AUTH_DOMAIN as string,
      getEncryptionKey : config.public.ENCRYPTION_KEY as string,
      getEncryptionIv : config.public.ENCRYPTION_IV as string,
    }
  }
  