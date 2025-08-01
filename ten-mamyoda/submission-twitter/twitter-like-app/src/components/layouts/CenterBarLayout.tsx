// src/components/layouts/CenterBarLayout.tsx
import type { ReactNode } from 'react';

type CenterBarLayoutProps = {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
};

export function CenterBarLayout({ children, header, footer }: CenterBarLayoutProps) {
    return (
        <div id="centerBar">
            {header}
            {children}
            {footer || <DefaultFooter />}
        </div>
    );
}

function DefaultFooter() {
    return (
        <footer>
            <div id="footerBox">
                <p className="footerContent">コピーライト</p>
            </div>
        </footer>
    );
}
