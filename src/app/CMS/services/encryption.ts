import { Injectable } from '@angular/core';
import { encryptionKey,encryptionIv } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Encryption {
  private frontEncrypt(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), encryptionKey, {
      keySize: 128 / 8,
      iv: encryptionIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  private frontDecrypt(value: string): string {
    const decrypted = CryptoJS.AES.decrypt(value, encryptionKey, {
      keySize: 128 / 8,
      iv: encryptionIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
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

   public frontDecryptDecode(value: string): string {
    if (!this.checkValue(value)) {
      return '';
    }
    const decodedText = this.decodeSpecialCharacters(value);
    const decryptBase64Text = this.decodeBase64String(decodedText);
    const decryptDecodedText = this.frontDecrypt(decryptBase64Text);
    return decryptDecodedText;
  }
  public checkValue(value: string): boolean {
    return value !== null && value !== undefined && value.trim() !== '';
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

  public decodeBase64String(base64Text: string): string {
    return this.checkValue(base64Text) ? atob(base64Text) : '';
  }

  public decodeSpecialCharacters(encodedText: string): string {
    if (this.checkValue(encodedText)) {
      return encodedText.replace(/%([0-9A-F]{2})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
    }
    return '';
  }

}
