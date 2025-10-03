export interface SignUpRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
  };
  token?: string;
}
