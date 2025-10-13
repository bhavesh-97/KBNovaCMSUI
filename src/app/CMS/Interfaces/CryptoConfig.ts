import * as CryptoJS from 'crypto-js';
export interface CryptoConfig {
  key: CryptoJS.lib.WordArray;
  iv: CryptoJS.lib.WordArray;
}