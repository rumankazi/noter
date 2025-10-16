/**
 * Unit test for environment utility functions
 * Tests the environment detection functions used in the main process
 */

import {
  isDev,
  isProd,
  getEnvironment,
} from '../../src/main/utils/environment';

describe('Environment Utils', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalArgv = process.argv;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    process.argv = originalArgv;
  });

  describe('isDev', () => {
    it('should return true when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isDev()).toBe(true);
    });

    it('should return true when --dev flag is present', () => {
      process.env.NODE_ENV = 'production';
      process.argv = ['node', 'app.js', '--dev'];
      expect(isDev()).toBe(true);
    });

    it('should return false when in production without --dev flag', () => {
      process.env.NODE_ENV = 'production';
      process.argv = ['node', 'app.js'];
      expect(isDev()).toBe(false);
    });
  });

  describe('isProd', () => {
    it('should return false when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isProd()).toBe(false);
    });

    it('should return true when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      process.argv = ['node', 'app.js'];
      expect(isProd()).toBe(true);
    });
  });

  describe('getEnvironment', () => {
    it('should return the NODE_ENV value', () => {
      process.env.NODE_ENV = 'test';
      expect(getEnvironment()).toBe('test');
    });

    it('should return production as default', () => {
      delete process.env.NODE_ENV;
      expect(getEnvironment()).toBe('production');
    });
  });
});
