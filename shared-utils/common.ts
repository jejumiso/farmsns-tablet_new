export const formatPhone = (value: string) => {
    let formattedValue = value.replace(/\D/g, ""); // 숫자만 허용

    // "010-" 기본값을 강제로 유지
    if (!formattedValue.startsWith("010")) {
        formattedValue = "010";
    }

    // "-" 자동 추가 (백스페이스 처리 포함)
    if (formattedValue.length > 3 && formattedValue.length <= 7) {
        formattedValue = "010-" + formattedValue.slice(3);
    } else if (formattedValue.length > 7) {
        formattedValue = "010-" + formattedValue.slice(3, 7) + "-" + formattedValue.slice(7, 11);
    }

    // "010-" 이하로 줄어들지 않도록 제한
    if (formattedValue.length < 4) {
        formattedValue = "010-";
    }

    return formattedValue;
};


export const convertToKoreanPhoneNumber = (value: string) => {
    // 숫자만 추출
    let formattedValue = value.replace(/\D/g, ""); // 숫자만 허용

    // +82를 010으로 변경
    if (formattedValue.startsWith("82")) {
        formattedValue = "0" + formattedValue.slice(2); // 82 -> 010
    }

    // "-" 자동 추가 (백스페이스 처리 포함)
    if (formattedValue.length > 3 && formattedValue.length <= 7) {
        formattedValue = "010-" + formattedValue.slice(3); // 010-xxxx
    } else if (formattedValue.length > 7) {
        formattedValue = "010-" + formattedValue.slice(3, 7) + "-" + formattedValue.slice(7, 11); // 010-xxxx-xxxx
    }

    // "010-" 이하로 줄어들지 않도록 제한
    if (formattedValue.length < 4) {
        formattedValue = "010-";
    }

    return formattedValue;
};
