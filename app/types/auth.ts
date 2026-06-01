// User type
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

// Auth response from API
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  error?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  passwordConfirm: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
