import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// *******************************************************
// HANDLE COMPONENT
// *******************************************************

export class Handle extends React.Component
{
    state = {
        mouseOver: false,
    };

    onMouseEnter = () =>
    {
        this.setState({ mouseOver: true });
    };

    onMouseLeave = () =>
    {
        this.setState({ mouseOver: false });
    };

    render()
    {
        const {
            domain: [min, max],
            handle: { id, value, percent },
            isActive,
            disabled,
            getHandleProps,
            text,
        } = this.props;
        const { mouseOver } = this.state;

        return (
            <React.Fragment>
                {(mouseOver || isActive) && !disabled ? (
                    <div
                        style={{
                            left: `${percent}%`,
                            position: 'absolute',
                            marginLeft: '-11px',
                            marginTop: '-35px',
                        }}
                    >
                        <div className="tooltip">
                            <span className="tooltiptext">{moment().startOf('day').add(value, 'hours').format('HH:mm')}</span>
                        </div>
                    </div>
                ) : null}
                <div
                    role="slider"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    style={{
                        left: `${percent}%`,
                        position: 'absolute',
                        marginLeft: '-11px',
                        top: -2,
                        zIndex: 2,
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                        borderRadius: '50%',
                        boxShadow: '1px 1px 1px 1px var(--bg-dark)',
                        backgroundColor: 'white',
                        border: '3px solid var(--primary)',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                        color: 'var(--primary)',
                    }}
                    {...getHandleProps(id, {
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave,
                    })}
                >
                    {text}
                </div>
            </React.Fragment>
        );
    }
}

Handle.propTypes = {
    domain: PropTypes.array,
    handle: PropTypes.object,
    isActive: PropTypes.bool,
    disabled: PropTypes.bool,
    getHandleProps: PropTypes.func,
    text: PropTypes.string,
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************

export const Track = ({
    source,
    target,
    getTrackProps,
}) => (
    <div
        style={{
            position: 'absolute',
            height: 6,
            zIndex: 1,
            top: 7,
            backgroundColor: '#3dcad4',
            borderRadius: 7,
            cursor: 'pointer',
            left: `${source.percent}%`,
            width: `${target.percent - source.percent}%`,
        }}
        {...getTrackProps()}
    />
);

// *******************************************************
// TICK COMPONENT
// *******************************************************

export const Tick = ({ tick, count }) => (
    <div className={'slider-ticks-content'}>
        <div
            className={'line-time'}
            style={{
                position: 'absolute',
                top: 20,
                width: 1,
                height: '12.2rem',
                backgroundColor: 'rgba(255,255,255,.05)',
                left: `${tick.percent}%`,
            }}
        />
        <div
            style={{
                color: 'var(--text-color)',
                position: 'absolute',
                zIndex: 2,
                top: -20,
                fontSize: 10,
                textAlign: 'center',
                marginLeft: `${-(100 / count) / 2}%`,
                width: `${100 / count}%`,
                left: `${tick.percent}%`,
            }}
        >
            {moment(tick.value,'h:mm A').format('HH')}
        </div>
    </div>
);
