// /types/Option/optionModel.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';

export interface Option {
  id: string
  isHeadData: boolean
  originaCompanyId: string
  optionName: string
  type: string
  styleType: string
  optionItems: string[]
  optionItemsPrice: number[]
  price: number
  priceShort: string
  msg: string
  mustNotOptionMsg: string
  mustNotOptionTogether: string
  mustNotOptionTogetherOption: string
  displayLevel: number
  dateCreated : Timestamp | null
  dateModified: Timestamp | null
}

export const emptyOption: Option = {
  id: '',
  isHeadData: false,
  originaCompanyId: '',
  optionName: '',
  type: '무료옵션선택',
  styleType: '',
  optionItems: [],
  optionItemsPrice: [],
  price: 0,
  priceShort: '',
  msg: '',
  mustNotOptionMsg: '',
  mustNotOptionTogether: '',
  mustNotOptionTogetherOption: '',
  displayLevel: 0,
  dateCreated : null,
  dateModified: null
}
