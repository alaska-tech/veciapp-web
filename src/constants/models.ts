export const CustomerRoles = ["admin", "vendor", "customer"] as const;
export type CustomerRoleType = typeof CustomerRoles;

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
  data: T[];
  meta: {
    lastPage: number;
    limit: number;
    page: number;
    total: number;
  };
}
export interface User extends BaseAttributes {
  id: string;
  fullName: string;
  email: string;
  foreignPersonId: string;
  foreignPersonType: string;
  role: CustomerRoleType[number];
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

export interface Customer extends BaseAttributes {
  id: string;
  fullName: string; //max 255
  identification: string; //max 100
  email: string; //max 150
  isEmailVerified: boolean; //default false
  cellphone: string; // max 20
  country: string; //max 100
  city: string; //max 100
  address: string; //max 255
  age?: number;
  birthdate?: Date;
  gender?: VendorGendersType[number];
  isHabeasDataConfirm: boolean; //default false
  state: vendorState;
  stateHistory: Array<{ state: vendorState; changedAt: Date; reason: string }>; //default []
  isActive: boolean; //default true
  score: number;
  interests: string[];
  locations?: Record<
    string,
    {
      label: string;
      address: string;
      coordinates?: { lat: number; lng: number };
    }
  >;
  codeOtpAuthorization?: string; //max 10
  avatar?: string; //max 255
  totalSpent: number; //default 0
  preferredPaymentMethod?: string; //max 100
  dietaryRestrictions: string[]; //default []
  lastOrderDate?: Date; //timestamp
}

export const VendorStates = ["created", "verified", "suspended"] as const;
export type VendorStatesType = typeof VendorStates;

export const VendorGenders = ["M", "F", "O"] as const;
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
  stateHistory: Array<{ state: vendorState; changedAt: Date; reason: string }>; //default []
  isActive: boolean; //default true
  isReadyToSell: boolean; //default false
  rank: number; //default 0
  incomes: string; //default 0
  bankAccount?: {
    number: string;
    entity: string;
    type: "Ahorros" | "Corriente" | string;
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

export const BranchState = [
  "active",
  "temporarily_closed",
  "maintenance",
  "inactive",
] as const;
export type BranchStateType = typeof BranchState;

export const BranchBusiness = ["individual", "company"] as const;
export type BranchBusinessType = typeof BranchBusiness;

export const weekDay = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type weekDayType = typeof weekDay;

export const WEEKDAY_LABEL: Record<weekDayType[number], string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const LocationType = ["Point"] as const;
export type LocationTypeType = typeof LocationType;

export interface Branch extends BaseAttributes {
  id: string;
  vendorId: string;
  name: string; //max 255
  location: {
    type: string;
    coordinates: [number, number]; //lat, lng
  };
  address: string; //max 255
  country: string; //max 100
  city: string; //max 100
  phone: string; //max 20
  email: string; //max 150
  rank: number; //default 0
  state: LocationTypeType[number]; //default active
  businessType: BranchBusinessType[number]; //default individual
  operatingHours?: Record<
    weekDayType[number],
    {
      open: string; //hora en formato hh:mm, como 19:00 o 14:30
      close: string;
      isOpen: boolean;
    }
  >;
  logo?: string; //max 255
  deliveryRadius: number; //default 0 min 0
  deliveryFee: string; // default 0 min 0
  estimatedDeliveryTime: number; //default 0 min 0
  managerName?: string; //max 255
  managerPhone?: string; //max 20
  images: string[]; //default []
  isPickupAvailable: boolean; //default false
  isDeliveryAvailable: boolean; //default false
  availablePaymentMethods: string[]; //default []
  description?: string;
}
