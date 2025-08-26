import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import userRoutes from '../../routes/userRoutes';
import * as UserService from '../../services/userService';
import * as AuthService from '../../services/authService';

// Mock services
vi.mock('../../services/userService');
vi.mock('../../services/authService');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use('/api/users', userRoutes);

describe('User Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'test-uuid',
        account_id: 'testuser',
        user_name: 'Test User',
        user_image: '/images/default-avatar.png',
        user_contents: null,
      };

      vi.mocked(UserService.createUser).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/register')
        .send({
          accountId: 'testuser',
          password: 'password123',
          userName: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('ユーザー登録が成功しました。');
      expect(response.body.user).toEqual(mockUser);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          accountId: 'testuser',
          // missing password and userName
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('必須項目が不足しています。');
    });

    it('should return 409 for duplicate user ID', async () => {
      vi.mocked(UserService.createUser).mockRejectedValue({
        code: 'ER_DUP_ENTRY',
      });

      const response = await request(app)
        .post('/api/users/register')
        .send({
          accountId: 'existinguser',
          password: 'password123',
          userName: 'Test User',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('このユーザーIDは既に使用されています。');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'test-uuid',
        account_id: 'testuser',
        user_name: 'Test User',
        user_image: '/images/default-avatar.png',
        user_contents: null,
      };

      vi.mocked(AuthService.authenticateUser).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          accountId: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('ログインに成功しました。');
      expect(response.body.user).toEqual(mockUser);
    });

    it('should return 401 for invalid credentials', async () => {
      vi.mocked(AuthService.authenticateUser).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          accountId: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('ユーザーIDまたはパスワードが正しくありません。');
    });
  });

  describe('GET /api/users/profile/:id', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 'test-uuid',
        account_id: 'testuser',
        user_name: 'Test User',
        user_image: '/images/test-avatar.jpg',
        user_contents: 'Test bio',
        user_header: '/images/test-banner.jpg',
      };

      vi.mocked(UserService.findUserByAccountId).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/profile/testuser');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({
        id: 'test-uuid',
        name: 'Test User',
        bio: 'Test bio',
        userId: 'testuser',
        bannerImageUrl: '/images/test-banner.jpg',
        avatarImageUrl: '/images/test-avatar.jpg',
      });
    });

    it('should return 404 for non-existent user', async () => {
      vi.mocked(UserService.findUserByAccountId).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/profile/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('ユーザーが見つかりません');
    });
  });

  describe('POST /api/users/profile/update', () => {
    it('should update user profile successfully', async () => {
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/users/profile/update')
        .field('id', 'test-uuid')
        .field('name', 'Updated Name')
        .field('accountId', 'updateduser')
        .field('bio', 'Updated bio')
        .field('deleteProfileImage', 'false');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('プロフィール更新に成功しました。');
    });

    it('should handle duplicate user ID error', async () => {
      vi.mocked(UserService.updateUserProfile).mockRejectedValue(
        new Error('そのユーザーIDはすでに使われています。')
      );

      const response = await request(app)
        .post('/api/users/profile/update')
        .field('id', 'test-uuid')
        .field('name', 'Updated Name')
        .field('accountId', 'existinguser')
        .field('bio', 'Updated bio');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('プロフィールの更新中にエラーが発生しました。');
    });
  });

  describe('POST /api/users/check-duplicate', () => {
    it('should return true for available user ID', async () => {
      vi.mocked(UserService.checkUserIdExists).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/users/check-duplicate')
        .send({ userId: 'newuser' });

      expect(response.status).toBe(200);
      expect(response.body.isAvailable).toBe(true);
    });

    it('should return false for existing user ID', async () => {
      vi.mocked(UserService.checkUserIdExists).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/users/check-duplicate')
        .send({ userId: 'existinguser' });

      expect(response.status).toBe(200);
      expect(response.body.isAvailable).toBe(false);
    });
  });
}); 