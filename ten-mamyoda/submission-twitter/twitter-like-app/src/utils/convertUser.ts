import type { FetchedUser, User } from '../types/user';

/* FetchedUser（APIレスポンス）をアプリ内共通型Userに変換する関数 */
export function convertFetchedToUser(fetched: FetchedUser): User {
    return {
        id: fetched.id,
        account_id: fetched.userId,
        user_name: fetched.name,
        user_image: fetched.avatarImageUrl,
        bio: fetched.bio,
        banner_image: fetched.bannerImageUrl,
    };
}
