// import { db } from '@/firebase'; // Firestore 인스턴스 가져오기
// import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

// // Firestore에서 데이터를 가져오는 함수
// export const getCollectionData = async (collectionName: string) => {
//   const collectionRef = collection(db, collectionName);
//   const snapshot = await getDocs(collectionRef);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// // Firestore에 새 문서를 추가하는 함수
// export const addDocument = async (collectionName: string, data: any) => {
//   const collectionRef = collection(db, collectionName);
//   return await addDoc(collectionRef, data);
// };

// // Firestore 문서를 업데이트하는 함수
// export const updateDocument = async (collectionName: string, documentId: string, data: any) => {
//   const documentRef = doc(db, collectionName, documentId);
//   return await updateDoc(documentRef, data);
// };
