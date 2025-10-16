export class MCommonEntitiesMaster {
  public isActive: boolean = false;
  public createdBy: number = 0;
  public createdDate?: Date = new Date();
  public updatedBy: number = 0;
  public updatedDate?: Date = new Date();
  public isDeleted: boolean = false;
  public deletedBy: number = 0;
  public deletedDate?: Date = new Date();
}