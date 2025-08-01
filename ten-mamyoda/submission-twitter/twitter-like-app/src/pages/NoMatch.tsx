import { Link } from 'react-router-dom';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { CenterBarLayout } from '../components/layouts/CenterBarLayout';

export function NoMatch() {
    return (
        <BaseLayout showSideBars>
            <CenterBarLayout
                header={
                    <header>
                        <div id="headerBox">
                            <h2 className="titleContent">ページが見つかりません</h2>
                        </div>
                    </header>
                }
            >
                <div
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        flex: 1,
                        display: 'grid',
                        placeContent: 'center',
                    }}
                >
                    <h1>404</h1>
                    <p>お探しのページは存在しないか、移動した可能性があります。</p>
                    <Link to="/" style={{ color: '#1d9bf0', textDecoration: 'underline' }}>
                        ホームページに戻る
                    </Link>
                </div>
            </CenterBarLayout>
        </BaseLayout>
    );
}
