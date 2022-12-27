import React, { Component } from 'react';

export class Li extends Component
{
    render()
    {
        return (
            <li className={this.props.className} onClick={this.props.onClick}>
                {this.props.children}
            </li>
        );
    }
}


Li.defaultProps = {
    className: '',
    onClick: () =>
    {
    }
};
