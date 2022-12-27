import './HistoryTimeSeries.scss';

import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Slider, Handles, Rail, Tracks, Ticks } from 'react-compound-slider';

import { EmptyButton } from '@vbd/vui';

import { Handle, Tick, Track } from 'extends/ffms/views/TrackingHistory/TimeSeries/HistoryTimeSliderComponents';

const sliderStyle = {
    
    position: 'relative',
    margin: '25px 20px 25px 50px',
    // width: '92%',
    boxSizing: 'border-box',
};
  
const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 20,
    borderRadius: '2px 10px 10px 2px',
    cursor: 'pointer',
    backgroundColor: 'var(--contrast-highlight)',
};

export class HistoryTimeSlider extends Component
{
    historyStore = this.props.fieldForceStore.historyStore;
    overlayPopupStore = this.props.fieldForceStore.overlayPopupStore;
    languageStore = this.props.appStore.languageStore;

    
    state = {
        sliderDomain: [0, 24],
        iconStop: false,
        // values: [0, 24]
    }
    async componentDidMount()
    {
        // this.setState({
        //     values: [moment.duration(timeFrom.format('HH:mm')).asHours(), moment.duration(timeTo.format('HH:mm')).asHours()]
        // });
        this.historyStore.changeSliderTime();
    }

    handleChangeTime = (values, force) =>
    {
        if (force || !this.historyStore.isSliding)
        {
            // this.historyStore.simulate = false;

            // console.log(this.historyStore.sliderFrom, this.historyStore.sliderHandle, this.historyStore.sliderTo);
            // console.log(this.historyStore.sliderFrom.format('DD/MM/YYYY HH:mm'), this.historyStore.sliderHandle.format('DD/MM/YYYY HH:mm'), this.historyStore.sliderTo.format('DD/MM/YYYY HH:mm'));
        
        
            // Check if the prev bounds were changed.
            const prevBoundStart = moment(this.historyStore.sliderFrom);
            const prevBoundStop = moment(this.historyStore.sliderTo);

            const sortedValues = values.sort((a,b) => a - b);
            if (sortedValues.length < 3)
            {
                const middleHour = moment.duration(this.historyStore.sliderHandle.format('HH:mm')).asHours();
                const stillInRange = middleHour >= sortedValues[0] && middleHour <= sortedValues[1];
                sortedValues.splice(stillInRange ? 1 : 0, 0, stillInRange ? middleHour : sortedValues[0]);
            }
            const valueFrom = moment(this.historyStore.sliderFrom).startOf('day').add(sortedValues[0], 'hours');
            const middleValue = moment(this.historyStore.sliderHandle).startOf('day').add(sortedValues[1], 'hours');
            let valueTo;
            if (sortedValues[2] !== 24)
            {
                valueTo = moment(this.historyStore.sliderTo).startOf('day').add(sortedValues[2], 'hours');
            }
            else
            {
                valueTo = moment(this.historyStore.sliderTo).endOf('day');
            }

            this.historyStore.sliderHandle = middleValue;

            if (!prevBoundStart.isSame(valueFrom))
            {
                this.historyStore.sliderFrom = valueFrom;
            }
        
            if (!prevBoundStop.isSame(valueTo))
            {
                this.historyStore.sliderTo = valueTo;
            }
        
            if (!prevBoundStart.isSame(valueFrom) || !prevBoundStop.isSame(valueTo))
            {
                this.historyStore.clampDateTime(this.historyStore.selectedEntry.rawData);
            }

            // console.log(this.historyStore.sliderFrom.format('DD/MM/YYYY HH:mm'), this.historyStore.sliderHandle.format('DD/MM/YYYY HH:mm'), this.historyStore.sliderTo.format('DD/MM/YYYY HH:mm'));
        }
    }

    onChange = (values) =>
    {
        this.setState({ values });
    };

    handleSpeedChange = (e) =>
    {
        this.historyStore.defaultSimulationSpeed = e;
    }

    setTimeParams = (from, to) =>
    {
        const searchParams = new URLSearchParams(this.props.location.search);
        let valueFrom, valueTo;
        const paramFrom = searchParams.get('from');
        const paramTo = searchParams.get('to');
        const prevBoundStart = moment(this.historyStore.sliderFrom);
        const prevBoundStop = moment(this.historyStore.sliderTo);
        if (paramFrom && paramTo)
        {
            valueFrom = moment(Number(paramFrom)).startOf('day').add(from, 'hours');
            if (to !== 24)
            {
                valueTo = moment(Number(paramTo)).startOf('day').add(to, 'hours');
            }
            else
            {
                valueTo = moment(Number(paramTo)).endOf('day');
            }
        }
        else
        {
            valueFrom = moment(this.historyStore.sliderFrom).startOf('day').add(from, 'hours');
            if (to !== 24)
            {
                valueTo = moment(this.historyStore.sliderTo).startOf('day').add(to, 'hours');
            }
            else
            {
                valueTo = moment(this.historyStore.sliderTo).endOf('day');
            }
        }
        if (!prevBoundStart.isSame(valueFrom))
        {
            this.historyStore.sliderFrom = valueFrom;
        }
        
        if (!prevBoundStop.isSame(valueTo))
        {
            this.historyStore.sliderTo = valueTo;
        }

        this.historyStore.clampDateTime(this.historyStore.selectedEntry.rawData);
    }

    render()
    {
        const { sliderDomain } = this.state;
        const { defaultSimulationSpeed } = this.historyStore;
        
        const timeFrom = moment(this.historyStore.sliderFrom);
        const timeTo = moment(this.historyStore.sliderTo);
        // const handleTime = moment((timeFrom + timeTo) / 2);
        const handleTime = moment(this.historyStore.sliderHandle);
        
        const values = [moment.duration(timeFrom.format('HH:mm')).asHours(), moment.duration(handleTime.format('HH:mm')).asHours(), moment.duration(timeTo.format('HH:mm')).asHours()];

        return (
            <div style={sliderStyle}>
                {/* <FormGroup>
                            <FormControlLabel
                                label={'From'}
                                control={
                                    <DateTimePicker
                                        showTimeSelectOnly
                                        value={this.historyStore.currentFilter.from}
                                        onChange={this.handleChangeTimeFrom}
                                    />
                                }
                            />
                            <FormControlLabel
                                label={'To'}
                                control={
                                    <DateTimePicker
                                        showTimeSelectOnly
                                        value={this.historyStore.currentFilter.to}
                                        onChange={this.handleChangeTimeTo}
                                    />
                                }
                            />
                        </FormGroup> */}
                
                <Slider
                    mode={2}
                    step={24 / 1440}
                    domain={sliderDomain}
                    // rootStyle={sliderStyle}
                    onChange={this.handleChangeTime}
                    onSlideStart={() =>
                    {
                        this.historyStore.setSliding(true);
                    }}
                    onSlideEnd={(e) =>
                    {
                        this.historyStore.setSliding(false);
                        this.handleChangeTime(e, true);
                    }}
                    values={values}
                >
                    <Rail>
                        {({ getRailProps }) => (
                            <div
                                style={railStyle}
                                {...getRailProps()}
                            />
                        )}
                    </Rail>
                    {/* <AdvanceSelect
                        options={this.historyStore.speedStates && this.historyStore.defaultSimulationSpeed ? this.historyStore.speedStates.map((speed) =>
                        {
                            return { id: speed, label: speed + 'x' };
                        }) : []}
                        onChange={(value) => this.handleSpeedChange(value)}
                        value={this.historyStore.defaultSimulationSpeed}
                        placeholder={'Select speed'}
                        disabled={this.historyStore.simulate}
                    /> */}
                    <EmptyButton
                        className={'btn-start-slide'}
                        icon={!this.historyStore.simulate ? 'play' : 'pause'}
                        color={!this.historyStore.simulate ? 'var(--text-color)' : 'var(--text-color-dark)'}
                        iconType={'solid'}
                        tooltip={`${this.historyStore.defaultSimulationSpeed}x`}
                        onClick={() => this.historyStore.playSimulation(this.historyStore.defaultSimulationSpeed)}
                    />
                    <Handles>
                        {({ handles, activeHandleID, getHandleProps }) => (
                            <div className="slider-handles">
                                {
                                    handles.map((handle, index) => (
                                        <Handle
                                            key={handle.id}
                                            handle={handle}
                                            domain={sliderDomain}
                                            isActive={handle.id === activeHandleID}
                                            getHandleProps={getHandleProps}
                                            text={index === 1 ? `${defaultSimulationSpeed}x` : ''}
                                        />
                                    ))}
                            </div>
                        )}
                    </Handles>
                    <Tracks
                        left={false}
                        right={false}
                    >
                        {({ tracks, getTrackProps }) =>
                        {
                            return (
                                <div className="slider-tracks">
                                    {tracks.map(({ id, source, target }) => (
                                        <Track
                                            key={id}
                                            source={source}
                                            target={target}
                                            getTrackProps={getTrackProps}
                                        />
                                    ))}
                                </div>
                            );
                        }}
                    </Tracks>
                    <Ticks count={24}>
                        {({ ticks }) =>
                        {
                            // console.log(ticks);
                            return (<div className="slider-ticks">
                                {ticks.map(tick => (
                                    <Tick
                                        key={tick.id}
                                        tick={tick}
                                        count={ticks.length}
                                    />
                                ))}
                            </div>);
                        }}
                    </Ticks>
                </Slider>
            </div>
        );
    }
}


HistoryTimeSlider.propTypes = {
    onFilterChange: PropTypes.func,
    initialValues: PropTypes.array,
};

HistoryTimeSlider = inject('appStore', 'fieldForceStore')(observer(HistoryTimeSlider));
HistoryTimeSlider = withRouter(HistoryTimeSlider);
