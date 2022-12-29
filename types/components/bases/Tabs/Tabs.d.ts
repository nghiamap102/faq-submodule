import { ReactElement } from 'react';
import './Tabs.scss';
export declare type TabsProps = {
    flexHeader?: boolean;
    renderOnActive?: boolean;
    onSelect?: (id?: string, route?: string) => void;
    selected: string;
    className?: string;
    children: any[] | any;
};
export declare const Tabs: (props: TabsProps) => ReactElement;
//# sourceMappingURL=Tabs.d.ts.map