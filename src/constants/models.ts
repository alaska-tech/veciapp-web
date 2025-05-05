export const UserRoles = ["admin", "vendor", "customer"] as const;
export type UserRoleType = typeof UserRoles;

export interface BaseAttributes {
  createdBy: string;
  createdAt: number; //format "2025-04-27T03:02:53.862Z"
  updatedBy?: string;
  updatedAt?: number; //format "2025-04-27T03:02:53.862Z"
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
  value: string | number | boolean;
  type: ParameterCategoryType[number];
  isActive: boolean;
}
