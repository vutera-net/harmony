/** @jest-environment node */
import { createToken, verifyToken } from '../jwt-utils';

describe('JWT Utilities', () => {
  const payload = { userId: '123', email: 'test@example.com' };

  it('should create a token and verify it correctly', async () => {
    const token = await createToken(payload);
    expect(typeof token).toBe('string');

    const decoded = await verifyToken(token);
    expect(decoded).toMatchObject(payload);
  });

  it('should throw an error for an invalid token', async () => {
    const invalidToken = 'this.is.an.invalid.token';
    await expect(verifyToken(invalidToken)).rejects.toThrow('Invalid or expired token');
  });

  it('should throw an error for a token signed with a different secret', async () => {
    await expect(verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature')).rejects.toThrow();
  });
});
