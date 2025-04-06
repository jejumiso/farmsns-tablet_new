// src/types/common/documentMeta.ts
import { Timestamp } from 'firebase/firestore'
export interface DocumentMeta {
    id: string
    updatedAt: number // 혹은 Timestamp
    dateCreated :Timestamp,
    dateModified :Timestamp

  }
  