/**
 * Unit Tests for Validation Utils
 */
import { validateEmail, validatePassword, validateStockSymbol } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@brx.ma')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test @domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('MyP@ssw0rd')).toBe(true);
      expect(validatePassword('Str0ng!Pass')).toBe(true);
    });

    it('should reject weak passwords', () => {
      // Too short
      expect(validatePassword('Pass1!')).toBe(false);

      // No uppercase
      expect(validatePassword('password123!')).toBe(false);

      // No lowercase
      expect(validatePassword('PASSWORD123!')).toBe(false);

      // No number
      expect(validatePassword('Password!')).toBe(false);

      // No special character
      expect(validatePassword('Password123')).toBe(false);

      // Empty
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateStockSymbol', () => {
    it('should validate BVC stock symbols', () => {
      expect(validateStockSymbol('ATW')).toBe(true);
      expect(validateStockSymbol('IAM')).toBe(true);
      expect(validateStockSymbol('BCP')).toBe(true);
      expect(validateStockSymbol('CIH')).toBe(true);
    });

    it('should reject invalid stock symbols', () => {
      expect(validateStockSymbol('')).toBe(false);
      expect(validateStockSymbol('A')).toBe(false); // Too short
      expect(validateStockSymbol('TOOLONG')).toBe(false); // Too long
      expect(validateStockSymbol('123')).toBe(false); // Numbers only
      expect(validateStockSymbol('atw')).toBe(false); // Lowercase
      expect(validateStockSymbol('AT-W')).toBe(false); // Special chars
    });
  });
});
