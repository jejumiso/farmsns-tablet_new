// types/pinia-plugin.d.ts
import 'pinia'

declare module 'pinia' {
  export interface PersistenceOptions {
    key?: string
    storage?: Storage
    paths?: string[]
  }

  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistenceOptions | PersistenceOptions[]
  }
}
