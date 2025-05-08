export const UserRoles = ["admin", "vendor", "customer"] as const;
export type UserRoleType = typeof UserRoles;

export interface BaseAttributes {
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type Response<T> =
  | {
      status: "Success";
      data: T;
      error: null;
    }
  | {
      status: "Error";
      data: null;
      error: {
        message?: string;
        detail?: string;
      };
    };
export interface PaginatedResult<T> {
  parameters: T[];
  count: number;
}
export interface User extends BaseAttributes {
  id: string;
  fullName: string;
  email: string;
  foreignPersonId: string;
  foreignPersonType: string;
  role: UserRoleType[number];
  isActive: boolean;
  refreshToken: string;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  hasPasswordChange: string | null;
  lastLoginDate: string;
}
export enum vendorState {
  CREATED = "created",
  VERIFIED = "verified",
  SUSPENDED = "suspended",
}
export const VendorStates = ["created", "verified", "suspended"] as const;
export type VendorStatesType = typeof VendorStates;

export const VendorGenders = ["M","F","O"] as const;
export type VendorGendersType = typeof VendorStates;

export interface Vendor extends BaseAttributes {
  id: string;
  internalCode: string; // max length 100
  fullName: string; // max length 255
  identification: string; // max length 100
  email: string; //max length 150
  isEmailVerified: boolean;
  cellphone: string; // max length 20
  country: string; // max length 100
  city: string; // max length 100
  address: string; // max length 255
  age?: number;
  gender?: VendorGendersType[number];
  avatar?: string;
  isHabeasDataConfirm: boolean; //default false
  state: vendorState;
  stateHistory: Array<{ state: vendorState; changedAt: Date, reason: string }>; //default []
  isActive: boolean; //default true
  isReadyToSell: boolean; //default false
  rank: number; //default 0
  incomes: string; //default 0
  bankAccount?: {
      number: string;
      entity: string;
      type: 'Ahorros' | 'Corriente' | string;
  };
  commercialRegistry?: string; // max length 255
  rut?: string; // max length 255
  bio?: string;
}

export const ParameterCategory = [
  "string",
  "boolean",
  "number",
  "json",
] as const;
export type ParameterCategoryType = typeof ParameterCategory;

export interface Parameter extends BaseAttributes {
  id: string;
  displayName: string;
  name: string;
  description: string;
  value: string;
  type: ParameterCategoryType[number];
  isActive: boolean;
  data: string;
}
