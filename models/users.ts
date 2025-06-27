export interface UserBase {
  id?: number;
  email: string;
}

export interface User extends UserBase {
  role: string;
}
