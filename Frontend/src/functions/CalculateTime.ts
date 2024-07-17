import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie'


export const CalculateTime: Function = (time:number): Date => {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + (time * 60000));
}


export const encryptUserID = (userId: string | any) => {
    const encrypted = CryptoJS.AES.encrypt(userId, 'dheerajpradi@gmail.com').toString();
    return encodeURIComponent(encrypted);
};

export const decryptUserID = (UserId: string | any) => {
    const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(UserId), 'dheerajpradi@gmail.com').toString(CryptoJS.enc.Utf8);
    return decrypted;
};

export const getCookie: Function = (token: string): string | undefined => {
    return Cookies.get(token)
}

export const setCookie: Function = (name: string, token: string) => {
    return Cookies.set(name, token)
}


export const removeCookie: Function = (name: string) => {
    return Cookies.remove(name)
}