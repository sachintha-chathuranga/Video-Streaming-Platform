
export interface UserDto {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  pictureUrl?: string;
  about?: string;
  subscribersCount?: number;
  sub: string;
}