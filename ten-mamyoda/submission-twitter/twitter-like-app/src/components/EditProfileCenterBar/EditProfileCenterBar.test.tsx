import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { EditProfileCenterBar } from './index.tsx';
import * as AuthContextModule from '../../context/AuthContext';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as unknown as { get: Mock; post: Mock };

const mockUser = {
    account_id: 'test_user',
    id: 'uid123',
    user_name: 'てすと',
    bio: 'bioです',
    user_image: '',
};

vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
    user: mockUser,
    setUser: vi.fn(),
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
});

describe('EditProfileCenterBar', () => {
    const renderComponent = () =>
        render(
            <MemoryRouter>
                <EditProfileCenterBar />
            </MemoryRouter>
        );

    it('初期表示で名前・ユーザーID・自己紹介が入力されていること', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                user: {
                    name: 'てすと',
                    userId: 'test_user',
                    bio: 'bioです',
                    avatarImageUrl: null,
                    bannerImageUrl: null,
                },
            },
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByLabelText('名前')).toHaveValue('てすと');
            expect(screen.getByLabelText('ユーザーID')).toHaveValue('test_user');
            expect(screen.getByLabelText('自己紹介')).toHaveValue('bioです');
        });
    });

    it('フォームに入力して送信するとAPIが呼ばれる', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { user: { name: '', userId: '', bio: '' } },
        });

        mockedAxios.post.mockResolvedValueOnce({});
        mockedAxios.get.mockResolvedValueOnce({
            data: { user: mockUser },
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText('名前'), { target: { value: '新しい名前' } });
        fireEvent.click(screen.getByRole('button', { name: '保存' }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalled();
        });
    });
});
