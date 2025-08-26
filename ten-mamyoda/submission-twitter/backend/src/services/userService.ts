import bcrypt from 'bcrypt';
import { v7 as uuidv7 } from 'uuid';
import db from '../config/db';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db'

const SALT_ROUNDS = 10;

export async function createUser(accountId: string, plainPassword: string, userName: string) {
    try {
        console.log('--- 1. createUser サービスが開始されました。 ---');

        const id = uuidv7();
        console.log('--- 2. UUIDが生成されました。 ---');

        console.log('--- 3. パスワードのハッシュ化を開始します... ---');
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        console.log('--- 4. パスワードのハッシュ化が完了しました。 ---');

        const newUser = {
            id,
            account_id: accountId,
            password: hashedPassword,
            user_name: userName,
            user_image: '/images/default-avatar.png',
            user_contents: null
        };
        console.log('--- 5. データベースに挿入するデータ:', newUser, '---');

        const sql = 'INSERT INTO users (id, account_id, password, user_name, user_image, user_contents) VALUES (?, ?, ?, ?, ?, ?)';

        console.log('--- 6. データベースクエリを実行します... ---');
        const [result] = await db.query(sql, [
            newUser.id,
            newUser.account_id,
            newUser.password,
            newUser.user_name,
            newUser.user_image,
            newUser.user_contents
        ]);
        console.log('--- 7. データベースクエリが完了しました。 ---', result);

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;

    } catch (error) {
        console.error('--- ❌ userServiceでエラーが発生しました ❌ ---', error);
        throw error;
    }
}

interface User extends RowDataPacket {
    id: string;
    account_id: string;
    password: string;
    user_name: string;
    user_image: string;
    user_contents: string | null;
}

export async function findUserByAccountId(accountId: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE account_id = ?';
    const [rows] = await db.query<User[]>(sql, [accountId]);

    return rows[0] || null;
}


export async function findUserById(id: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.query<User[]>(sql, [id]);

    return rows[0] || null;
}

export async function getRandomUsersExcluding(currentUserId: string | null, limit: number) {
    const queryParams: any[] = [];
    let query = `
        SELECT 
            id, 
            user_name AS name, 
            account_id AS userId,
            user_image AS imageUrl
        FROM users
    `;

    if (currentUserId) {
        query += ' WHERE id != ?';
        queryParams.push(currentUserId);
    }

    query += ' ORDER BY RAND() LIMIT ?';
    queryParams.push(limit);

    const [rows] = await db.query<RowDataPacket[]>(query, queryParams);
    console.log("DBから取得したユーザー:", rows); // ← ここで確認
    return rows;
}

export const checkUserIdExists = async (userId: string) => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE account_id = ?', [userId]);
    return rows.length > 0;
};

type UpdateProfileParams = {

    id: string;
    name: string;
    bio: string;
    bannerImage?: string;
    avatarImage?: string;
    deleteAvatar: boolean;
    accountId?: string;
    newAccountId?: string
};

export const updateUserProfile = async ({
    id,
    name,
    bio,
    bannerImage,
    avatarImage,
    deleteAvatar,
    accountId,
}: UpdateProfileParams & { newAccountId?: string }) => {
    // 重複チェック（他のユーザーが使っていないか）
    if (accountId) {
        const [rows] = await pool.query(
            'SELECT 1 FROM users WHERE account_id = ? AND id != ?',
            [accountId, id]
            ) as [Array<any>, any];
        if (rows.length > 0) {
            throw new Error('そのユーザーIDはすでに使われています。');
        }
    }
    const queryParts: string[] = [];
    const params: any[] = [];

    queryParts.push('user_name = ?');
    params.push(name);

    queryParts.push('user_contents = ?');
    params.push(bio);

    if (bannerImage) {
        queryParts.push('user_header = ?');
        params.push(bannerImage);
    }

    if (deleteAvatar || avatarImage) {
        queryParts.push('user_image = ?');
        params.push(avatarImage);
    }

    if (accountId) {
        queryParts.push('account_id = ?');
        params.push(accountId);
    }

    const sql = `UPDATE users SET ${queryParts.join(', ')} WHERE id = ?`;
    params.push(id);

    await pool.query(sql, params);
};
