import { LoginCredentials, SignupCredentials, AuthResponse, User } from "../types/auth";

// Set your backend API URL here
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },

  /**
   * Signup user with email, password, and name
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },

  /**
   * Logout user - clear stored credentials
   */
  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  },

  /**
   * Get stored user
   */
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("authToken");
    }
    return false;
  },

  /**
   * Validate token with backend
   */
  async validateToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();
      return { valid: true, user: data.user };
    } catch (error) {
      console.error("Token validation error:", error);
      return { valid: false };
    }
  },
};
