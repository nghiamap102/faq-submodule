import './FeatureBar.scss';

import React, { Component } from 'react';
import { FlexPanel2 } from '../Panel/Panel';

export class FeatureBar extends Component
{
    render()
    {
        return (
            <div className={`feature-bar ${this.props.className || ''}`}>
                <FlexPanel2>
                    {this.props.children}
                </FlexPanel2>
            </div>
        );
    }
}

FeatureBar.propTypes = {
    // className: PropTypes.string,
    // scroll: PropTypes.bool,
};

FeatureBar.defaultProps = {
    // className: '',
};

export class FeatureBarTop extends Component
{
    render()
    {
        return (
            <div className={'feature-bar-top'}>
                {this.props.children}
            </div>
        );
    }
}

export class FeatureBarBottom extends Component
{
    render()
    {
        return (
            <div className={'feature-bar-bottom'}>
                {this.props.children}
            </div>
        );
    }
}
