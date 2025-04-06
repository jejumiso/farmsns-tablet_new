// // option_group_types.ts

// import type { Option } from "./option";
// import { Timestamp } from 'firebase/firestore';

// export type OptionGroup = {
//     id: string,
//     isHeadData: boolean,
//     originaCompanyId: string,
//     optionGroupName: string,
//     optionIds: string[],
//     options: Option[], // 주의!! firestore에는 저장하지 않음.
//     dateCreated : Timestamp,
//     dateModified: Timestamp;
// };

// // 비어있는 값으로 초기화된 OptionGroupModelType 객체 생성 함수
// export function createEmptyOptionGroup(): OptionGroup {
//     return {
//         id: '',
//         isHeadData: false,
//         originaCompanyId: '',
//         optionGroupName: '',
//         optionIds: [],
//         options: [],
//         dateCreated : Timestamp.fromDate(new Date(0)),
//         dateModified: Timestamp.fromDate(new Date(0)), // 초기값으로 Unix epoch (1970-01-01)을 사용
//     };
// }
