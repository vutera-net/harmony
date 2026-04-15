import * as jose from 'jose';

const SECRET = process.env.AUTH_SECRET || 'default-secret-key-for-development-only-1234567890';
const encodedSecret = new TextEncoder().encode(SECRET);

export const createToken = async (payload: any) => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encodedSecret);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
