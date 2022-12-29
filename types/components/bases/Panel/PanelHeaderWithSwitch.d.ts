import React from 'react';
import './PanelHeaderWithSwitch.scss';
export declare type PanelHeaderWithSwitcherProps = {
    value: number;
    onChanged: (isChanged: boolean) => void;
    disabled?: boolean;
    settingRef?: React.Ref<HTMLButtonElement>;
    onSettingClick?: () => void;
};
export declare const PanelHeaderWithSwitcher: React.FC<PanelHeaderWithSwitcherProps>;
//# sourceMappingURL=PanelHeaderWithSwitch.d.ts.map