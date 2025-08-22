import { InfoBar } from '../components/InfoBar';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
    return (
        <main>
            <InfoBar
            headline='ログイン'
            description=''/>
            <LoginForm />
        </main>
    );
}
