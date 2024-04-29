export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  role: string;
  department: string;
  location: string;
  level: number;
  points: number;
  type: string;
}

export interface UserDocument {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface UserProgressUpdate {
  id: number;
  points: number;
  level: number;
}
