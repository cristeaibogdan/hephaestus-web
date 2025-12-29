export interface LoginUserResponse {
  code: string;
  organization: string;
  country: string;

  email: string;
  username: string;
}

export interface LoginUserRequest {
  username: string;
  password: string;
}
