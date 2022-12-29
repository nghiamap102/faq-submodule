import { FC } from 'react';
import { TabsProps } from './Tabs';
import './Tabs.scss';
declare type TabContentProps = {
    active?: boolean;
} & Pick<TabsProps, 'renderOnActive'>;
export declare const TabContent: FC<TabContentProps>;
export {};
//# sourceMappingURL=TabContent.d.ts.map