export interface User {
  id: number;
  email: string;
  role: string;
  username: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}
