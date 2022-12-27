import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ContainField, Field, Info, Column, TB1, T } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';
export class LocationPopup extends Component
{
    render()
    {
        const { addressString, coordinates } = this.props;

        return (
            <ContainField>
                <Field className={'tracker-popup'}>
                    <Info>
                        <Column>
                            <T>{addressString}</T>
                            <TB1><T>Longitude</T>: {coordinates[0]}</TB1>
                            <TB1><T>Latitude</T>: {coordinates[1]}</TB1>
                        </Column>
                    </Info>
                </Field>
            </ContainField>
                    
        );
    }
}

LocationPopup.propTypes = {
    fieldType: PropTypes.string,
    addressString: PropTypes.string,
    coordinates: PropTypes.array,
};

const LabelIcon = (props) =>
{
    return (
        <div
            style={{ color: props.color }}
            className={`popup-label-icon ${props.className}`}
        >
            <FAIcon
                icon={props.iconName}
                color={props.iconColor}
                size={props.iconSize}
                type={props.type}
            />
            <span>{props.children}</span>
        </div>
    );
};

LabelIcon.propTypes = {
    className: PropTypes.string,
    iconName: PropTypes.string,
    iconSize: PropTypes.string,
    color: PropTypes.string,
    type: PropTypes.string,
};
LabelIcon.defaultProps = {
    className: '',
    iconName: '',
    iconSize: '12px',
    iconColor: 'darkgray',
    type: 'light',
    color: '',
};
