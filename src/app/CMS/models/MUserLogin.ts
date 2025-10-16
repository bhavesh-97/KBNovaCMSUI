// user-login.model.ts
import { MCommonEntitiesMaster } from './MCommonEntitiesMaster';

export class MUserLogin {
  public userID: number = 0;
  public fullName: string = '';
  public mobileNumber: number = 0;
  public emailID: string = '';
  public password: string = '';
  public isPasswordReset: boolean = false;
  public mCommonEntitiesMaster: MCommonEntitiesMaster = new MCommonEntitiesMaster();
}
