import styles from './LoadingSpinner.module.css';

type LoadingSpinnerProps = {
    message?: string;
    size?: 'small' | 'medium' | 'large';
};

export function LoadingSpinner({ 
    message = '読み込み中...', 
    size = 'medium' 
}: LoadingSpinnerProps) {
    return (
        <div className={`${styles.container} ${styles[size]}`}>
            <div className={styles.spinner}></div>
            <p className={styles.message}>{message}</p>
        </div>
    );
} 