import React from 'react';
import clsx from 'clsx';

import { Button, ButtonProps } from 'components/bases/Button/Button';
import { T } from 'components/bases/Translate/Translate';

import './PanelFooter.scss';

type PanelFooterProps = {
    docked?: boolean
    disabled?: boolean
    actions?: PanelFooterAction[]
}

type PanelFooterAction = {
    isDirty?: boolean
    text?: string
} & Omit<ButtonProps, 'size' | 'text'>

export const PanelFooter: React.FC<PanelFooterProps> = (props) =>
{
    const { children, docked = true, actions } = props;
    return (
        <div className={clsx('panel-footer', docked ?? 'panel-footer-docked')}>
            {actions
                ? (
                        <div className={'panel-footer-actions'}>
                            { actions.map(({ disabled, text, isDirty, ...restButtonProps }) =>
                            {
                                return (
                                    <Button
                                        {...restButtonProps}
                                        key={text}
                                        disabled={props.disabled || disabled}
                                        text={(
                                            <>
                                                <T>{text}</T>
                                                {isDirty && <span style={{ color: 'red' }}>&nbsp;(*)</span>}
                                            </>
                                        )}
                                        size="sm"
                                    />
                                );
                            })}
                        </div>
                    )
                : children
            }
        </div>
    );
};
