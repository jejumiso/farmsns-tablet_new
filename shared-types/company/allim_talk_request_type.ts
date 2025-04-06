export type AllimtalkRequest = {
    senderkey: string;
    tpl_code: string;
    sender: string;
    senddate: string;
    receiver_1: string;
    recvname_1: string;
    subject_1: string;
    message_1: string;
    emtitle_1: string;
    button_1: string;
    
    failover?: string;
    fsubject?: string;
    fmessage?: string;
};

