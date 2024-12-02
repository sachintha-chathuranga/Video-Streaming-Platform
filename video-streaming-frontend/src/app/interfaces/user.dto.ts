
export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  pictureUrl?: string;
  about?: string;
  subscribersCount?: number;
  sub?: string;
}

export interface UserUpdateDto {
  firstName: string;
  lastName: string;
  about: string;
}
export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  sub?: string;
}