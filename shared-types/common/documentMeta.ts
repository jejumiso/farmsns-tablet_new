// src/types/common/documentMeta.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';
export interface BaseDocument<T> {
    id: string,
    companyId :string,
    dateCreated :Timestamp,
    dateModified :Timestamp,
    documentSize :number,
    data : T[]

  }

  export type DocumentMetaOnly = Omit<BaseDocument<any>, 'data' | 'companyId'>;
  