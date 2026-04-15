import { validateEmail, validatePasswordStrength } from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
      expect(validateEmail('email@sub.domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should return invalid if password is too short', () => {
      const result = validatePasswordStrength('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must be at least 8 characters long.');
    });

    it('should return invalid if password lacks uppercase letter', () => {
      const result = validatePasswordStrength('lowercase1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one uppercase letter.');
    });

    it('should return invalid if password lacks lowercase letter', () => {
      const result = validatePasswordStrength('UPPERCASE1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one lowercase letter.');
    });

    it('should return invalid if password lacks number', () => {
      const result = validatePasswordStrength('NoNumber!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one number.');
    });

    it('should return invalid if password lacks special character', () => {
      const result = validatePasswordStrength('NoSpecial1');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one special character.');
    });

    it('should return valid for a strong password', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Password is strong.');
    });
  });
});
