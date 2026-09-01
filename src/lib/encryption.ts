import CryptoJS from 'crypto-js';

// 마스터 암호 (코드 내 환경변수로 숨김 처리)
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'gtown-pm-master-secret-key-2026!';

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (cipherText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("데이터 복호화 실패:", error);
    return "";
  }
};
