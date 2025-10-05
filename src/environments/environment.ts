/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  environmentName: 'Localhost', 
  reportServerUrl: 'https://chennaicbskendodev.amnex.com', 
  //pnsUrl: 'https://localhost:44398',  //local
  //pnsUrl: 'http://10.195.96.148:6017',//live
  pnsUrl: 'https://chennaimasterdevapi.amnex.com/pns',
  masterUrl: 'https://chennaimasterdevapi.amnex.com/master'
};

export const ExportExcelLogoCellMerge: string = "A1:A3";

