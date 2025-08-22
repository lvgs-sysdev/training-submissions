// src/components/common/ErrorState.tsx
type ErrorStateProps = {
    message: string;
    onRetry?: () => void;
    retryText?: string;
};

export function ErrorState({ message, onRetry, retryText = '再試行' }: ErrorStateProps) {
    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#ff6b6b'
        }}>
            <p style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>⚠️</p>
            <p style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#ff6b6b' }}>
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        background: '#1d9bf0',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    {retryText}
                </button>
            )}
        </div>
    );
}
