import { Timestamp } from 'firebase-admin/firestore'

//types/models/tablet/tablet_model.ts
export interface TabletSettings {
  allowTouchOnStandby:boolean;
    pendingRewardAmount: number;
    rewardType: 'stamp' | 'point';
    useStandbyScreen: boolean;
    usePhoneInputScreen: boolean;
    useRewardInputScreen : boolean;
    rewardResetValue: number;
    dateModified: Timestamp | null; // 마지막 수정 날짜
    dateCreated:Timestamp | null;
  }