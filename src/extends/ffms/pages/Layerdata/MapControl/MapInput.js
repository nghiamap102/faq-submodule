import React from 'react';
import { FAIcon, Input } from '@vbd/vui';

const MapInput = (props) =>
{
    return (
        <>
            <Input
                ref = {props.ref}
                className={`input-text  ${props.className + (props.type === 'range' ? ' slider' : '')}`}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
                onChange={props.onChange}
                value={props.value}
                onFocus={props.onFocus}
            />
            <div className="map-icon">
                <FAIcon
                    icon={'map-marker-alt'}
                    size={'1rem'}
                    onClick={props.onFocus}
                />
            </div>
        </>
    );
};
MapInput.defaultProps = {
    value: '',
    type: '',
    className: '',
    placeholder: '',
    onFocus: () =>
    {
    },
    onChange: () =>
    {
    },
};
export { MapInput };
