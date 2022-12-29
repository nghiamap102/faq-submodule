import React from 'react';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

import './PanelHeader.scss';

const DEFAULT_ICON_TOOLTIPS: Record<string, string> = {
    'times': 'Tắt',
    'trash-alt': 'Xóa',
    'plus': 'Thêm mới',
};

export type PanelHeaderProps = {
    actions?: PanelHeaderAction[]
}

export type PanelHeaderAction = {
    title?: string
    tooltip?: string
    icon: string
    innerRef?: React.Ref<HTMLButtonElement>,
} & Omit<JSX.IntrinsicElements['button'], 'ref' | 'key'>

export const PanelHeader: React.FC<PanelHeaderProps> = (props) =>
{
    const { children, actions = [] } = props;

    return (
        <div className={'panel-header'}>
            {children && <h3><T>{children}</T></h3>}

            <div className={'panel-header-actions'}>
                {actions.map(({ icon, title, tooltip, disabled, innerRef, ...restButtonProps }) =>
                    !disabled && (
                        <button
                            {...restButtonProps}
                            key={icon}
                            ref={innerRef}
                        >
                            <FAIcon
                                icon={icon}
                                size={'1rem'}
                                type={'light'}
                                // Todo: title => tooltip when migrate to newer vbd/vicon version
                                title={tooltip || DEFAULT_ICON_TOOLTIPS[icon] || ''}
                            />
                            <span><T>{title}</T></span>
                        </button>
                    ))}
            </div>
        </div>
    );
};
