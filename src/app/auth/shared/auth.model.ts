export const AUTH_DATA = 'diss-auth-data';
export const USER_DATA = 'diss-user-data';

export interface Login {
  email: string;
  password: string;
}

export interface UserData {
  user: {
    // TODO
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    storedAt: number;
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface JSONResponse {
  data: any;
}
