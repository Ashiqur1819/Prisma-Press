export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
