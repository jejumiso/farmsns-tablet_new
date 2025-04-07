// src/types/common/documentMeta.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';
export interface DocumentMeta {
    id: string
    dateCreated :Timestamp,
    dateModified :Timestamp

  }
  