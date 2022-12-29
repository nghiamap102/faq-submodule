import { ReactElement, ReactNode } from 'react';
import './Tabs.scss';
export interface TabProps {
    id?: string;
    onClick?: (id: string) => void;
    title: ReactElement | ReactElement[] | string;
    flex?: boolean;
    active?: boolean;
    renderOnActive?: boolean;
    route?: string;
    children?: ReactNode;
}
export declare const Tab: (props: TabProps) => ReactElement;
//# sourceMappingURL=Tab.d.ts.map