// src/components/common/LoadingState.tsx
import type { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorState } from './ErrorState';
import { UI_MESSAGES } from '../../constants';

type LoadingStateProps = {
    isLoading: boolean;
    error?: string | null;
    children: ReactNode;
    loadingMessage?: string;
    loadingSize?: 'small' | 'medium' | 'large';
};

export function LoadingState({ 
    isLoading, 
    error, 
    children, 
    loadingMessage = UI_MESSAGES.LOADING,
    loadingSize = 'medium'
}: LoadingStateProps) {
    if (isLoading) {
        return <LoadingSpinner message={loadingMessage} size={loadingSize} />;
    }
    
    if (error) {
        return <ErrorState message={error} />;
    }
    
    return <>{children}</>;
}
