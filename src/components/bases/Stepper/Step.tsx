import React from 'react';
import { FAIcon } from '@vbd/vicon';
import clsx from 'clsx';

import { StepProps } from './model';

import './Step.scss';

const Step: React.FC<StepProps> = (props) =>
{
    const { status = 'wait', index = 0, size = 'default', typeIcon = 'regular' } = props;
    const { title, subTitle, icon, description, onClick, clickable, dot, spinIcon, disabled } = props;
    
    const classes = clsx('stepper-item', `stepper-item--${status}`, disabled && 'stepper-item--disabled');

    const handleClick = () => onClick && onClick(index);

    const canClick = clickable && status === 'wait';
    const stepContent = index + 1;

    return (
        <div className={classes}>
            <div
                role={canClick ? 'button' : undefined}
                tabIndex={canClick ? 0 : undefined}
                className='stepper-item__container'
                onClick={canClick ? handleClick : undefined}
            >
                <div className='stepper-item__tail' />
                <div className={clsx('stepper-item__icon', icon && 'stepper-item__icon-custom')}>
                    {
                        dot
                            ? (
                                    <span className='stepper-item__dot' />
                                )
                            : icon
                                ? (
                                        <FAIcon
                                            icon={icon}
                                            size={`${size === 'small' ? '0.875rem' : '1rem'}`}
                                            spin={spinIcon}
                                            type={typeIcon}
                                        />
                    
                                    )
                                : status === 'finish'
                                    ? (
                                            <FAIcon
                                                icon='check'
                                                size={`${size === 'small' ? '0.875rem' : '1rem'}`}
                                            />
                                        )
                                    : status === 'error'
                                        ? (
                                                <FAIcon
                                                    icon='times'
                                                    size={`${size === 'small' ? '0.875rem' : '1rem'}`}
                                                    type='light'
                                                />
                                            )
                                        : stepContent
                    }
                </div>
                
                <div className='stepper-item__content'>
                    <div className='stepper-item__title'>
                        {title}
                        {subTitle && (
                            <div className='stepper-item__subtitle'>
                                {subTitle}
                            </div>
                        )}
                    </div>
                    {description && (
                        <div className='stepper-item__description'>
                            {description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step;
