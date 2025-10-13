import { PopupMessageType } from "./PopupMessageType";

export class JsonResponseModel {
  isError: boolean = true;
  strMessage: string = '';
  title: PopupMessageType = PopupMessageType.Error;
  type: PopupMessageType = PopupMessageType.Error;
  result?: any;
}