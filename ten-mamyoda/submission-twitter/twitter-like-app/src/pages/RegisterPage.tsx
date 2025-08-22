import { InfoBar } from '../components/InfoBar';
import { RegisterInputBar } from '../components/RegisterInputBar';

export function RegisterPage() {
    return (
        <main>
            <InfoBar
                headline="ようこそ"
                description={
                    <>
                        声を大にして言えない、<br />そんな愚痴を吐き出しましょう
                    </>
                }
            />
            <RegisterInputBar />
        </main>
    );
}
