export interface Secret2FA {
	/**
	 * ASCII representation of the secret
	 */
	ascii: string;
	/**
	 * Hex representation of the secret
	 */
	hex: string;
	/**
	 * Base32 representation of the secret
	 */
	base32: string;
	/**
	 * Google Authenticator-compatible otpauth URL.
	 */
	otpauth_url?: string | undefined;
}
