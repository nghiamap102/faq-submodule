import './Button.scss';
import './ToggleButton.scss';

import React, { Component } from 'react';
import { EmptyButton } from 'components/bases/Button/Button';

export class ToggleButton extends Component
{
    state = {
        pressed: false
    };

    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (nextProps.pressed !== prevState.pressed)
        {
            return { pressed: nextProps.pressed }; // return new state
        }
        
        return null; // don't change state
    }

    handleClick = () =>
    {
        this.setState({ pressed: !this.state.pressed });
        if (this.props.onClick)
        {
            this.props.onClick({ pressed: this.state.pressed });
        }
    };
    
    render()
    {
        const { className, pressed, onClick, ...rest } = this.props;

        return (
            <EmptyButton
                className={`btn-toggle ${this.state.pressed ? 'btn-active' : ''} ${className}`}
                onClick={this.handleClick}
                {...rest}
            />
        );
    }
}

ToggleButton.propTypes = EmptyButton.propTypes;

