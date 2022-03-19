import speakeasy from "speakeasy";
export function generate2faSecret({ email }: { email: string }) {
  const secret = speakeasy.generateSecret({ issuer: "MessageBox", name: `MessageBox - ${email}` });
  return secret;
}
