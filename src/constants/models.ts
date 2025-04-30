export const UserRoles = ["admin", "vendor", "user"] as const;
export type UserRoleType = typeof UserRoles;

export interface BaseAttributes {
  createdBy: string;
  createdAt: number; //format "2025-04-27T03:02:53.862Z"
  updatedBy?: string;
  updatedAt?: number; //format "2025-04-27T03:02:53.862Z"
}
export interface ErrorBody {
  message: string;
  data: {
    message: string;
  };
}
export interface succesResponse<T> {
    status: number
    data: T | null
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

export const ParameterCategory = ["string","bool","number","array"] as const;
export type ParameterCategoryType = typeof ParameterCategory;

export interface Parameter extends BaseAttributes {
  id: string;
  displayName: string;
  name: string;
  description: string;
  value: string;
  type: ParameterCategoryType[number];
  isActive: boolean;
}
