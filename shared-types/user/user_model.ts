import { Timestamp } from 'firebase-admin/firestore'

// Define the UserModel type
export type UserModel = {
    id: string | null; // Authentication UID
    phoneNumber: string; // Should not be stored in Firestore
    resPhoneNumber: string; // Encrypted phone number
    photoURL: string | null;
    companyIds: string[];
    userName: string;
    isMember: boolean; // Moa app membership status
    authUid: string; // Firebase Auth UID
    wooriMoney: number;
    wooriPoint: number;
    token: string;
    deliveryAddressList: any[];//DeliveryAddressModel[];
    customerRating: string; // Customer grade
    orderTotalCount: number; // Purchase count
    orderTotalPrice: number; // Purchase amount
    rewardCount: number;
    rewardCompany: string;
    dateLastOrder: Timestamp | null;
    dateCreated: Timestamp | null; // Creation date
    dateModified: Timestamp | null; // Last modification date
    dateLastAccess: Timestamp | null; // Last access date
    version: number;
};

// Utility function to create an empty UserModel
export const createEmptyUserModel = (): UserModel => {
    // const now = new Date();
    return {
        id: null,
        phoneNumber: '',
        resPhoneNumber: '',
        photoURL: null,
        companyIds: [],
        userName: '',
        isMember: false,
        authUid: '',
        wooriMoney: 0,
        wooriPoint: 0,
        token: '',
        deliveryAddressList: [],
        customerRating: '',
        orderTotalCount: 0,
        orderTotalPrice: 0,
        rewardCount: 0,
        rewardCompany: '',
        dateLastOrder: null,
        dateCreated: null,
        dateModified: null,
        dateLastAccess: null,
        version: 0,
    };
};
