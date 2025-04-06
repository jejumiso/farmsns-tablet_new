//services/firebaseService.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore/lite';

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;


export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
}


export function initializeFirebase(config: FirebaseConfig) {
  if (!config.apiKey || !config.authDomain) {
    throw new Error('Firebase 환경 변수가 누락되었습니다.');
  }

  firebaseApp = getApps().length ? getApp() : initializeApp(config);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error('Firebase가 초기화되지 않았습니다.');
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) throw new Error('Firebase가 초기화되지 않았습니다.');
  return db;
}
