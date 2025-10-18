import { Injectable } from '@angular/core';
import { encryptionKey,encryptionIv } from '../../../src/environments/environment';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class Encryption {
   
  public checkValue(value: string): boolean {
    return value !== null && value !== undefined && value.trim() !== '';
   }
  //#region Encryption Methods
  private frontEncrypt(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), encryptionKey, {
      keySize: 128 / 8,
      iv: encryptionIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  public frontEncryptEncode(value: string): string {
    if (!this.checkValue(value)) {
      return '';
    }
    const encryptedText = this.frontEncrypt(value);
    const encryptedBase64Text = this.encodeBase64String(encryptedText);
    const encryptedEncodedText = this.encodeSpecialCharacters(encryptedBase64Text);
    return encryptedEncodedText;
  }

  public encodeBase64String(plaintext: string): string {
    return this.checkValue(plaintext) ? btoa(plaintext) : '';
  }
  public encodeSpecialCharacters(plaintext: string): string {
    if (this.checkValue(plaintext)) {
      return plaintext.replace(/[\[\]<>=()|;{}+]/g, match => {
        return '%' + match.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
      });
    }
    return '';
  }
  //#endregion
  
  //#region Decryption Methods
  private frontDecrypt(value: string): string {
        if (!this.checkValue(value)) {
            return '';
        }
        try {
            const decrypted = CryptoJS.AES.decrypt(value, encryptionKey, {
                keySize: 128 / 8,
                iv: encryptionIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const result = decrypted.toString(CryptoJS.enc.Utf8);
            if (!result) {
                console.error('AES decryption failed: Empty or invalid result');
                return '';
            }
            return result;
        } catch (error) {
            console.error('AES decryption error:', error, 'Input:', value);
            return '';
        }
    }

    public frontDecryptDecode(value: string): string {
        if (!this.checkValue(value)) {
            return '';
        }
        try {
          debugger;
            const decodedText = this.decodeSpecialCharacters(value);
            const decryptBase64Text = this.decodeBase64String(decodedText)
            const decryptDecodedText = this.frontDecrypt(decryptBase64Text);
            return decryptDecodedText;
        } catch (error) {
            console.error('frontDecryptDecode error:', error, 'Input:', value);
            return '';
        }
    }

    public decodeBase64String(base64Text: string): string {
        if (!this.checkValue(base64Text)) {
            return '';
        }
        try {
            return atob(base64Text);
        } catch (error) {
            console.error('Base64 decoding failed:', error, 'Input:', base64Text);
            return '';
        }
    }

    public decodeSpecialCharacters(encodedText: string): string {
        if (!this.checkValue(encodedText)) {
            return '';
        }
        try {
            // Match both uppercase and lowercase hex values to align with C#
            return encodedText.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });
        } catch (error) {
            console.error('Special character decoding failed:', error, 'Input:', encodedText);
            return '';
        }
    }
  //#endregion
}
