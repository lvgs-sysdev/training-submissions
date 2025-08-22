// src/pages/HomePage.tsx
import { BaseLayout } from '../components/layouts/BaseLayout';
import { CenterBarLayout } from '../components/layouts/CenterBarLayout';
import { AppHeader } from '../components/common/AppHeader';
import { CenterBar } from '../components/CenterBar';
import { ROUTES } from '../constants';
import { Link } from 'react-router-dom';

export function HomePage() {
    const headerActions = (
        <Link to={ROUTES.CREATE_POST} className="postButton">
            吐き出す
        </Link>
    );

    return (
        <BaseLayout>
            <CenterBarLayout
                header={<AppHeader actions={headerActions} />}
            >
                <div id="explainBox">
                    <p className="explainContent">
                        愚痴を投稿するサイトです。<br />あなたの愚痴を吐き出しましょう。
                    </p>
                </div>
                <div id="postTitle">
                    <h2 className="postTitleContent">みんなの愚痴</h2>
                </div>
                <CenterBar />
            </CenterBarLayout>
        </BaseLayout>
    );
}
