import './SelectionItem.scss';
import 'extends/ffms/pages/base/base.scss';

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import * as _ from 'lodash';
import { T } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';
import { useI18n } from '@vbd/vui';
import { CheckBox } from '@vbd/vui';

const SelectionItem = (props) =>
{
    const { t } = useI18n();

    const { text, hasCheckbox, icon, style } = props;
    const [checked, setChecked] = useState(props.checked ?? false);
    const onClick = () =>
    {
        setChecked(checked => !checked);
        if (_.isFunction(props.onClick))
        {
            props.onClick({ ...props, checked: !checked });
        }
    };
    useEffect(() =>
    {
        setChecked(props.checked);
    }, [props.checked]);
    return (
        <div
            className={`bar selection-item ${props.showHover ? 'show' : ''} ${props.active ? 'active' : ''}  ${props.borderBottom ? 'border-bottom' : ''}`}
            onClick={onClick}
            style={style}
        >
            {
                hasCheckbox &&
                <CheckBox
                    checked={checked}
                />
            }
            {
                icon &&
                <FAIcon
                    size={'1rem'}
                    icon={icon}
                />
            }
            <div
                className='selection-item-text'
                title={t(text)}
            >
                <T>{text}</T>
            </div>
        </div>
    );
};

SelectionItem.propTypes = {
    checked: PropTypes.bool,
    hasCheckbox: PropTypes.any,
    key: PropTypes.any,
    onClick: PropTypes.func,
    showHover: PropTypes.bool,
    text: PropTypes.any,
    icon: PropTypes.string,
    active: PropTypes.bool,
    style: PropTypes.any,
    borderBottom: PropTypes.bool,
};
SelectionItem.defaultProps = {
    showHover: true,
    borderBottom: true,
};

export default SelectionItem;
