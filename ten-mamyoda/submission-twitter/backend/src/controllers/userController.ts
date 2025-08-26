import { RequestHandler } from 'express';
import * as AuthService from '../services/authService';
import * as UserService from '../services/userService';
import type { Request, Response, NextFunction } from 'express';

const validateFields = (fields: Record<string, any>): string | null => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return `${key}が不足しています。`;
        }
    }
    return null;
};

const handleServerError = (res: any, error: unknown) => {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    return;
};

export const registerUser: RequestHandler = async (req, res) => {
    const { accountId, password, userName } = req.body;
    const validationError = validateFields({ accountId, password, userName });
    if (validationError) {
        res.status(400).json({ message: '必須項目が不足しています。' });
        return;
    }

    try {
        const newUser = await UserService.createUser(accountId, password, userName);
        res.status(201).json({ message: 'ユーザー登録が成功しました。', user: newUser });
        return;
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'このユーザーIDは既に使用されています。' });
            return;
        }
        handleServerError(res, error);
        return;
    }
};

export const loginUser: RequestHandler = async (req, res) => {
    const { accountId, password } = req.body;
    const validationError = validateFields({ accountId, password });
    if (validationError) {
        res.status(400).json({ message: 'ユーザーIDとパスワードを入力してください。' });
        return;
    }

    try {
        const user = await AuthService.authenticateUser(accountId, password);
        if (!user) {
            res.status(401).json({ message: 'ユーザーIDまたはパスワードが正しくありません。' });
            return;
        }

        req.session.isLoggedIn = true;
        req.session.userId = user.id;

        res.status(200).json({ message: 'ログインに成功しました。', user });
        return;
    } catch (error) {
        handleServerError(res, error);
        return;
    }
};

export const checkAuthStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.session.isLoggedIn && req.session.userId) {
            const user = await UserService.findUserById(req.session.userId);
            if (!user) {
                res.status(401).json({ isLoggedIn: false, userId: null });
                return;
            }

            res.status(200).json({
                isLoggedIn: true,
                userId: req.session.userId,
                user: {
                    id: user.id,
                    account_id: user.account_id,
                    user_name: user.user_name,
                    user_image: user.user_image,
                },
            });
            return;
        }

        res.status(200).json({
            isLoggedIn: false,
            userId: null,
        });
    } catch (error) {
        console.error('checkAuthStatus error:', error);
        res.status(500).json({ isLoggedIn: false, userId: null });
    }
};



export const logoutUser: RequestHandler = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ message: 'ログアウトに失敗しました。' });
            return;
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'ログアウトしました。' });
        return;
    });
};

export const getRecommendedUsers: RequestHandler = async (req, res) => {
    const currentUserId = req.session?.userId ?? null;

    try {
        const users = await UserService.getRandomUsersExcluding(currentUserId, 3);
        console.log('おすすめユーザー:', users);
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'おすすめユーザー取得に失敗しました。' });
    }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.id;
        const userFromDb = await UserService.findUserByAccountId(userId);

        if (!userFromDb) {
            res.status(404).json({ message: 'ユーザーが見つかりません' });
            return;
        }

        const user = {
            id: userFromDb.id,
            name: userFromDb.user_name,
            bio: userFromDb.user_contents,
            userId: userFromDb.account_id,
            bannerImageUrl: userFromDb.user_header,
            avatarImageUrl: userFromDb.user_image,
        };

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部サーバーエラー' });
    }
};

export const checkDuplicateUserId = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const exists = await UserService.checkUserIdExists(userId);
        res.json({ isAvailable: !exists });
    } catch (error) {
        console.error('ユーザーID重複チェックでエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const bannerFile = files?.['bannerImage']?.[0];
        const avatarFile = files?.['avatarImage']?.[0];

        const bannerPath = bannerFile ? `/images/${bannerFile.filename}` : undefined;
        const avatarPath = avatarFile ? `/images/${avatarFile.filename}` : undefined;

        const deleteAvatar = req.body.deleteProfileImage === 'true';

        if (user.accountId && user.accountId !== user.userId) {
            const exists = await UserService.checkUserIdExists(user.accountId);
            if (exists) {
                res.status(409).json({ message: 'そのユーザーIDは既に使用されています。' });
                return;
            }
        }

        await UserService.updateUserProfile({
            id: user.id, // UUID
            accountId: user.accountId, // 新しいユーザーID
            name: user.name,
            bio: user.bio,
            bannerImage: bannerPath,
            avatarImage: deleteAvatar ? '/images/default-avatar.png' : avatarPath,
            deleteAvatar,
        });

        res.status(200).json({ message: 'プロフィール更新に成功しました。' });
    } catch (error) {
        console.error('プロフィール更新エラー:', error);
        res.status(500).json({ message: 'プロフィールの更新中にエラーが発生しました。' });
    }
};
