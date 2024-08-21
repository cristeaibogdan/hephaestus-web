import { ReturnType } from '../../enums/return-type.enum';

export interface PageRequestDTO {
  pageIndex: number;
  pageSize: number;

  category: string;
  manufacturer: string;

  damageType: string;
  returnType: ReturnType;
  identificationMode: string;

  serialNumber: string;
  model: string;
  type: string;

  damageLevel: number;
  recommendation: string;

  createdAt: string;
}
