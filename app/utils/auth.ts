/**
 * Barrel exports for auth utilities
 * Makes imports cleaner across the app
 * 
 * Usage:
 * import { useAuth, authService } from "@/app/utils/auth";
 * instead of:
 * import { useAuth } from "@/app/context/AuthContext";
 * import { authService } from "@/app/services/auth";
 */

export { useAuth, AuthProvider } from "@/app/context/AuthContext";
export { authService } from "@/app/services/auth";
export type {
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  AuthContextType,
} from "@/app/types/auth";
