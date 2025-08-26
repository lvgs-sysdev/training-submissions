// src/components/common/AppHeader.tsx
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import topPicture from '../../assets/topPicture.png';

type AppHeaderProps = {
    title?: ReactNode;
    actions?: ReactNode;
    showBackButton?: boolean;
    backTo?: string;
    showDefaultTitle?: boolean;
};

export function AppHeader({ 
    title, 
    actions, 
    showBackButton = false, 
    backTo,
    showDefaultTitle = true
}: AppHeaderProps) {
    return (
        <header>
            <div id="headerBox">
                {showBackButton && backTo && (
                    <div>
                        <Link to={backTo} className="backButton">←</Link>
                    </div>
                )}
                
                {title || (showDefaultTitle && <DefaultTitle />)}
                
                {actions && <div>{actions}</div>}
            </div>
        </header>
    );
}

function DefaultTitle() {
    return (
        <Link to={ROUTES.HOME}>
            <div id="title">
                <img id="titleImg" src={topPicture} alt="titleImage" />
                <h1 className="titleContent">Black Box</h1>
            </div>
        </Link>
    );
}
