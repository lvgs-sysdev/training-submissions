import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './EditProfileCenterBar.module.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { convertFetchedToUser } from '../../utils/convertUser';
import type { FetchedUser } from '../../types/user';
import { UI_MESSAGES, ROUTES, API_ENDPOINTS, CONFIG } from '../../constants';

type ProfileFormData = {
    name: string;
    userId: string;
    bio: string;
};

export function EditProfileCenterBar() {
    const { user: authUser, setUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        userId: '',
        bio: '',
    });

    // ✅ 型エラー回避のため string 型を明示
    const [avatarPreview, setAvatarPreview] = useState<string>(CONFIG.DEFAULT_AVATAR_URL);
    const [bannerPreview, setBannerPreview] = useState<string>(CONFIG.DEFAULT_BANNER_URL);
    const [originalAvatarUrl, setOriginalAvatarUrl] = useState<string>(CONFIG.DEFAULT_AVATAR_URL);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [deleteProfileImage, setDeleteProfileImage] = useState<boolean>(false);

    useEffect(() => {
        if (!authUser?.account_id) return;

        axios
            .get(API_ENDPOINTS.USER_PROFILE(authUser.account_id), { withCredentials: true })
            .then((res) => {
                const userData = res.data.user;

                setFormData({
                    name: userData.name || '',
                    userId: userData.userId || '',
                    bio: userData.bio || '',
                });

                const avatarUrl = userData.avatarImageUrl
                    ? `${CONFIG.API_BASE_URL}${userData.avatarImageUrl}`
                    : CONFIG.DEFAULT_AVATAR_URL;
                const bannerUrl = userData.bannerImageUrl
                    ? `${CONFIG.API_BASE_URL}${userData.bannerImageUrl}`
                    : CONFIG.DEFAULT_BANNER_URL;

                setAvatarPreview(avatarUrl);
                setBannerPreview(bannerUrl);
                setOriginalAvatarUrl(avatarUrl);
            })
            .catch((err) => {
                console.error('プロフィール詳細の取得に失敗しました:', err);
                if (authUser) {
                    setFormData({
                        name: authUser.user_name || '',
                        userId: authUser.account_id || '',
                        bio: authUser.bio || '',
                    });
                }
            });
    }, [authUser]);

    const revokeIfBlob = (url: string) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);

        if (type === 'avatar') {
            revokeIfBlob(avatarPreview);
            setAvatarFile(file);
            setAvatarPreview(fileUrl);
            setDeleteProfileImage(false);
        } else {
            revokeIfBlob(bannerPreview);
            setBannerFile(file);
            setBannerPreview(fileUrl);
        }
    };

    const handleDeleteToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setDeleteProfileImage(checked);

        if (!checked && avatarFile) revokeIfBlob(avatarPreview);

        setAvatarPreview(
            checked
                ? CONFIG.DEFAULT_AVATAR_URL
                : avatarFile
                ? URL.createObjectURL(avatarFile)
                : originalAvatarUrl
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            if (!authUser?.id) {
                alert(UI_MESSAGES.LOGIN_REQUIRED);
                return;
            }
            data.append('id', authUser.id);
            data.append('name', formData.name);
            data.append('accountId', formData.userId);
            data.append('userId', authUser.account_id); // 現在のユーザーID（重複チェック用）
            data.append('bio', formData.bio);
            if (bannerFile) data.append('bannerImage', bannerFile);
            if (avatarFile) data.append('avatarImage', avatarFile);
            data.append('deleteProfileImage', deleteProfileImage ? 'true' : 'false');

            await axios.post(API_ENDPOINTS.USER_PROFILE_UPDATE, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const res = await axios.get(API_ENDPOINTS.USER_PROFILE(formData.userId), { withCredentials: true });
            const fetchedUser: FetchedUser = res.data.user;
            setUser(convertFetchedToUser(fetchedUser));

            navigate(ROUTES.USER_PROFILE(formData.userId));
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 409) {
                alert(UI_MESSAGES.DUPLICATE_USER_ID);
            } else {
                alert(UI_MESSAGES.GENERAL_ERROR);
            }
        }
    };

    return (
        <div id="centerBar">
            <header>
                <div id="headerBox">
                    <div id="title">
                        <Link to={ROUTES.USER_PROFILE(formData.userId)} className="backButton">←</Link>
                    </div>
                    <button type="submit" form="profileEditForm" className="postButton">
                        保存
                    </button>
                </div>
            </header>

            <form className={styles.profileEditForm} id="profileEditForm" onSubmit={handleSubmit}>
                <div className={styles.editHeaderImages}>
                    <div className={styles.editBannerContainer}>
                        <div
                            className={styles.editBannerPreview}
                            style={{ backgroundImage: `url(${bannerPreview})` }}
                        >
                            <div className={styles.imageActionOverlay}>
                                <label htmlFor="bannerImage" className={styles.imageUploadLabel}>📷</label>
                                <input
                                    type="file"
                                    id="bannerImage"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleFileChange(e, 'banner')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.editAvatarContainer}>
                        <div
                            className={styles.editAvatarPreview}
                            style={{ backgroundImage: `url(${avatarPreview})` }}
                        >
                            <div className={styles.imageActionOverlay}>
                                <label htmlFor="profileImage" className={styles.imageUploadLabel}>📷</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.editFormFields}>
                    <div className={styles.formGroupCheckbox}>
                        <input
                            type="checkbox"
                            id="deleteProfileImage"
                            checked={deleteProfileImage}
                            onChange={handleDeleteToggle}
                        />
                        <label htmlFor="deleteProfileImage">プロフィール画像を削除する</label>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">名前</label>
                        <input id="name" value={formData.name} onChange={handleInputChange} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="userId">ユーザーID</label>
                        <input id="userId" value={formData.userId} onChange={handleInputChange} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="bio">自己紹介</label>
                        <textarea id="bio" rows={4} value={formData.bio} onChange={handleInputChange} className={styles.input} />
                    </div>
                </div>
            </form>
        </div>
    );
}
