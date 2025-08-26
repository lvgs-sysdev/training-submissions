type EmptyStateProps = {
    icon?: string;
    title: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
};

export function EmptyState({ 
    icon = '📝', 
    title, 
    description, 
    actionText, 
    onAction 
}: EmptyStateProps) {
    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#666',
            fontStyle: 'italic'
        }}>
            <p style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>{icon}</p>
            <p style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{title}</p>
            {description && (
                <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                    {description}
                </p>
            )}
            {actionText && onAction && (
                <button
                    onClick={onAction}
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
                    {actionText}
                </button>
            )}
        </div>
    );
} 