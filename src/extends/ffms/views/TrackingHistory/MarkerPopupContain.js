import './MarkerPopupContain.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ContainField, Field, Info, T, Container } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

class MarkerPopupContain extends Component
{
    getFormatDistance(meter, fixed)
    {
        if (meter != null)
        {
            if (meter >= 1000)
            {
                meter = meter / 1000 / 60;
                return meter.toFixed(fixed || 1) + ' km/h';
            }

            return meter.toFixed(fixed || 1) + ' m/s';
        }

        return '';
    }

    degreeToCompass = (num) =>
    {
        const val = parseInt((num / 22.5) + .5);
        const arr = ['N','NNE','NE','ENE','E','ESE', 'SE', 'SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
        return arr[(val % 16)];
    }

    render()
    {
        const { timestamp, trackerId, speed, status, direction, address } = this.props;
        
        return (
            <ContainField>
                <Field className={'tracker-popup'}>
                    <Info>
                        <LabelIcon iconName={'info-circle'}>{`${trackerId}`}</LabelIcon>
                        <LabelIcon
                            iconName={'circle'} iconColor={`${status.status_color}`} iconSize={'10px'}
                            type={'solid'}
                        >
                            {`${status.status_name}`}
                        </LabelIcon>
                        <LabelIcon iconName={'clock'}>{moment(timestamp * 1000).format('L LT')}</LabelIcon>
                        {
                            address &&
                            <LabelIcon iconName={'map-marker-alt'}>{`${address}`}</LabelIcon>
                        }
                    </Info>
                    <Container className={'popup-label'}>
                        <div
                            className={'tracking-marker'}
                            style={{ borderColor: status.status_color }}
                        >
                            {
                                direction != null &&
                                (
                                    <i
                                        className="fas fa-caret-up tm-heading"
                                        style={{
                                            transform: 'rotate(' + direction + 'deg)',
                                            color: status.status_color,
                                            fontSize: '20px',
                                        }}
                                    />
                                )
                            }
                            {Math.round(speed * 3.6)} <br /> km/h
                        </div>
                        <h6><T>{this.degreeToCompass(direction)}</T> {`(${direction})`}</h6>
                    </Container>
                </Field>
            </ContainField>
        );
    }
}

MarkerPopupContain.propTypes = {
    timestamp: PropTypes.number,
    distance: PropTypes.number,
    trackerId: PropTypes.string,
    username: PropTypes.string,
    direction: PropTypes.number,
    speed: PropTypes.number,
    status: PropTypes.object,
    coordinates: PropTypes.array,
};
export { MarkerPopupContain };


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

