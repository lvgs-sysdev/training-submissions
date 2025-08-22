import { UI_MESSAGES } from '../constants';

export type ApiError = {
    response?: {
        status: number;
        data?: any;
    };
    message?: string;
};

export function handleApiError(error: ApiError): string {
    if (error.response?.status === 409) {
        return UI_MESSAGES.DUPLICATE_USER_ID;
    }
    
    if (error.response?.status === 404) {
        return UI_MESSAGES.USER_NOT_FOUND;
    }
    
    if (error.response?.status === 401) {
        return UI_MESSAGES.LOGIN_REQUIRED;
    }
    
    return error.message || 'エラーが発生しました';
}

export function showErrorAlert(error: ApiError): void {
    const message = handleApiError(error);
    alert(message);
}

export function showSuccessAlert(message: string): void {
    alert(message);
} 