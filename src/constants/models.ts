export const Roles = ["admin", "vendor", "user"] as const;
export type RoleType = typeof Roles;

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
  role: RoleType[number];
  isActive: boolean;
  refreshToken: string;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  hasPasswordChange: string | null;
  lastLoginDate: string;
}
