import { FC, ReactNode } from 'react';
import { Config } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import './PopperTooltip2.scss';
export declare type PopperTooltip2Props = {
    tooltip?: ReactNode;
    className?: string;
    hideArrow?: boolean;
} & Pick<Config, 'placement'>;
export declare const PopperTooltip2: FC<PopperTooltip2Props>;
//# sourceMappingURL=PopperTooltip2.d.ts.map