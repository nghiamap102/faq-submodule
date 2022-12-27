import './SwitchButton.scss';
import React,{ useState } from 'react';
import PropTypes from 'prop-types';
import { T } from '@vbd/vui';
import Switch from 'react-switch';


const SwitchButton = (props) =>
{
    const { onChange, checked, disabled, title } = props;
    const [check, setCheck] = useState(checked);
    const onSwitchChange = ()=>
    {
        const newValue = !check;
        setCheck(newValue);
        onChange(newValue);
    };
    return (
        <div className="bar-content">
            <Switch
                onChange={onSwitchChange}
                checked={check}
                uncheckedIcon={false}
                checkedIcon={false}
                width={28}
                height={14}
                activeBoxShadow='none'
                disabled={disabled ?? false}
                className={'switch-toggle ' + (check === true ? 'active' : 'disable')}
            />
            {title && <h3 className={'bar-title'}><T>{title}</T></h3>}
        </div>
                            
    );
};
SwitchButton.propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string
};
export default SwitchButton;

