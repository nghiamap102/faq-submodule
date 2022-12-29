import React from 'react';
import Switch from 'react-switch';

import { T } from 'components/bases/Translate/Translate';

import './PanelHeaderWithSwitch.scss';

export type PanelHeaderWithSwitcherProps = {
    value: number
    onChanged: (isChanged: boolean) => void
    disabled?: boolean
    settingRef?: React.Ref<HTMLButtonElement>
    onSettingClick?: () => void
}

export const PanelHeaderWithSwitcher: React.FC<PanelHeaderWithSwitcherProps> = (props) =>
{
    const { value = 0, onChanged, settingRef, onSettingClick, children, disabled } = props;
    const handleSwitchStateChange = () => onChanged(!value);

    return (
        <div className={'panel-header-switch'}>
            <h3><T>{children}</T></h3>
            <div className={'panel-header-switch-actions'}>
                {onSettingClick && (
                    <button
                        className="setting-btn"
                        onClick={onSettingClick}
                        {...(settingRef && { ref: settingRef })}
                    />
                )}

                <Switch
                    checked={value === 1}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    width={38}
                    height={22}
                    activeBoxShadow="none"
                    disabled={disabled}
                    className={'switch-toggle ' + (value === 1 ? 'active' : 'disable')}
                    onChange={handleSwitchStateChange}
                />
            </div>
        </div>
    );
};
