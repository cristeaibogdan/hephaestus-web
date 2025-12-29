export interface CreateUserRequest {
  code: string;
  organization: string;
  country: string;

  email: string;
  username: string;
  password: string;
}
