/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as CryptoJS from 'crypto-js';
export const environment = {
  production: false,
  environmentName: 'Localhost',
  CMSUrl: 'https://localhost:7129/CMS', 
  WebUrl: 'https://localhost:7129/Web', 
};


export const encryptionKey = CryptoJS.enc.Utf8.parse('4090909090909020');
export const encryptionIv = CryptoJS.enc.Utf8.parse('4090909090909020');

