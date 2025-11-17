/**
 * Core Auth Types
 *
 * Platform-independent type definitions for authentication.
 * These types are used across the application and are not tied to any specific auth library.
 */

/**
 * User information from auth session
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Session information
 */
export type AuthSessionData = {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
};

/**
 * Authentication error types
 */
export type AuthErrorType =
  | "invalid_credentials"
  | "email_already_exists"
  | "weak_password"
  | "session_expired"
  | "unauthorized"
  | "email_not_verified"
  | "unknown_error";

/**
 * Authentication error
 */
export type AuthError = {
  type: AuthErrorType;
  message: string;
};

/**
 * Sign up input
 */
export type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

/**
 * Sign in input
 */
export type SignInInput = {
  email: string;
  password: string;
};

/**
 * Update user input
 */
export type UpdateUserInput = {
  name?: string;
  image?: string;
};

/**
 * Change password input
 */
export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

/**
 * Password reset request input
 */
export type PasswordResetRequestInput = {
  email: string;
};

/**
 * Password reset input
 */
export type PasswordResetInput = {
  token: string;
  newPassword: string;
};
