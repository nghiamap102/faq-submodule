import './SwitchButton.scss';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

import { T } from 'components/bases/Translate/Translate';

export const SwitchButton = (props) =>
{
    const { onChange, checked, disabled, title } = props;
    const [check, setCheck] = useState(checked);

    useEffect(() =>
    {
        setCheck(checked);
    }, [checked]);

    const onSwitchChange = () =>
    {
        const newValue = !check;
        setCheck(newValue);
        onChange(newValue);
    };

    return (
        <div className="bar-content">
            <Switch
                checked={check}
                uncheckedIcon={false}
                checkedIcon={false}
                width={28}
                height={14}
                activeBoxShadow="none"
                disabled={disabled ?? false}
                className={'switch-toggle ' + (check === true ? 'active' : 'disable')}
                onChange={onSwitchChange}
            />
            {title && <h3 className={'bar-title'}><T>{title}</T></h3>}
        </div>
    );
};

SwitchButton.propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string,
};

