import CryptoJS from 'crypto-js';

// Vercel 환경변수 세팅이 번거로우므로 직접 하드코딩
const SECRET_KEY = 'gtown-super-secret-key-0901!';

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
