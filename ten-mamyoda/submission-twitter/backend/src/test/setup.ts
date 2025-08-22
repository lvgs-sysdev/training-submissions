import { vi } from 'vitest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Mock database connection
vi.mock('../config/db', () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock('../config/db', () => ({
  default: {
    query: vi.fn(),
  },
}));

// Mock bcrypt
vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
  compare: vi.fn().mockResolvedValue(true),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v7: vi.fn().mockReturnValue('test-uuid'),
}));

// Mock multer
vi.mock('multer', () => {
  const multer = () => {
    return {
      fields: vi.fn().mockReturnValue((req: any, res: any, next: any) => {
        req.files = {
          bannerImage: [{ filename: 'test-banner.jpg' }],
          avatarImage: [{ filename: 'test-avatar.jpg' }],
        };
        next();
      }),
    };
  };
  multer.diskStorage = vi.fn().mockReturnValue({});
  return multer;
});

// Global test utilities
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}; 