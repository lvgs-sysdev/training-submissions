import bcrypt from 'bcrypt';
import * as UserService from './userService';

export async function authenticateUser(accountId: string, plainPassword: string) {
    try {
        console.log('--- 1. authenticateUser サービスが開始されました。 ---');
        console.log(`--- 2. ユーザーID「${accountId}」でユーザーを検索します... ---`);

        // ユーザーIDでユーザーを検索
        const user = await UserService.findUserByAccountId(accountId);

        // ユーザーが見つからなかった場合の処理
        if (!user) {
            console.log('--- 3. ユーザーが見つかりませんでした。認証を中断します。 ---');
            return null;
        }
        console.log('--- 3. ユーザーが見つかりました。パスワードの比較を開始します... ---');

        // パスワードを比較
        const isPasswordMatch = await bcrypt.compare(plainPassword, user.password);

        // パスワードが一致しなかった場合の処理
        if (!isPasswordMatch) {
            console.log('--- 4. パスワードが一致しませんでした。認証を中断します。 ---');
            return null;
        }
        console.log('--- 4. パスワードが一致しました。認証成功です。 ---');

        // 認証成功。パスワードを除いたユーザー情報を返す
        const { password, ...userWithoutPassword } = user;
        console.log('--- 5. 認証されたユーザー情報を返します。 ---');
        return userWithoutPassword;

    } catch (error) {
        console.error('--- ❌ authServiceで予期せぬエラーが発生しました ❌ ---', error);
        // エラーをコントローラーに伝える
        throw error;
    }
}
