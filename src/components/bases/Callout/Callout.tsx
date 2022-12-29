import React, { useState } from 'react';

import { FAIcon } from '@vbd/vicon';

import './Callout.scss';

interface CalloutProps {
    severity: 'error' | 'warning' | 'info' | 'success',
    title?: string;
    onClose?: () => void;
}

const Callout: React.FC<CalloutProps> = (props) =>
{
    const { severity, title, onClose, children } = props;

    const [ showCallout, setShowCallout ] = useState(true);

    let icon = '';
    switch (severity)
    {
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        case 'info':
            icon = 'info-circle';
            break;
        case 'success':
            icon = 'check-circle';
            break;

    }

    const handleClose = () =>
    {
        setShowCallout(false);

        if (onClose)
        {
            onClose();
        }
    };

    return (
        showCallout
            ? (
                    <div
                        className={`callout-container callout-${severity}`}
                        role='alert'
                    >
                        <div className='callout-icon'>
                            <FAIcon
                                icon={icon}
                                type='regular'
                                size='1.5rem'
                            />
                        </div>
                        <div className='callout-message'>
                            {title && <div className='callout-title'>{title}</div>}
                            {children}
                        </div>
                        {onClose && (
                            <div className='callout-action'>
                                <FAIcon
                                    icon='times'
                                    type='light'
                                    size='1.25rem'
                                    onClick={handleClose}
                                />
                            </div>
                        )}
                    </div>
                )
            : <></>
    );
};

export { Callout };
