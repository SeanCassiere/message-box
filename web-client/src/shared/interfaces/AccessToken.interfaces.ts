export interface AccessTokenPair {
  access_token: string | null;
  expiresIn: number;
  token_type: string;
}

export interface JwtPayload {
  message_box_clientId: string;
  message_box_userId: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

export interface TwoFactorSecretPair {
  base32: string;
  otpauth_url: string;
}
