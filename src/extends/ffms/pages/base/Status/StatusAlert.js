import './StatusAlert.scss';
import React, { useState, useEffect } from 'react';
import { Animated } from 'react-animated-css';
import { Button } from '@vbd/vui';

const StatusAlert = ({ type, icon, message, onlyIcon }) =>
{
    const [show, setShow] = useState(true);

    useEffect(() =>
    {
        const time = setTimeout(() =>
        {
            setShow(false);
        }, 1500);
        return () =>
        {
            clearTimeout(time);
        };
    }, []);

    if (!show)
    {
        return null;
    }

    return (
        <Animated
            animationIn="fadeInDown"
            animationInDuration={250}
        >
            <div className={'status-alert'}>
                <Button
                    className={onlyIcon ? 'status-alert-icon' : 'status-alert-with-text'}
                    onlyIcon={onlyIcon}
                    type={type}
                    icon={icon}
                    text={message}
                />
            </div>
        </Animated>
        
    );
};

StatusAlert.defaultPros = {
    onlyIcon: false,
    type: 'default',
    icon: '',
    text: '',
};
export default StatusAlert;
