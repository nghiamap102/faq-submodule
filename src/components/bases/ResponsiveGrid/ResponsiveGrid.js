import './ResponsiveGrid.scss';

import React, { Component } from 'react';
export class ResponsiveGrid extends Component
{
    render()
    {
        const items = Array.isArray(this.props.children) ? this.props.children.filter((child) => child.type === ResponsiveGridItem) : [];
        const col = (items.length === 1 || items.length === 2) ? items.length : Math.ceil(Math.sqrt(items.length));
        const percent = 100 / col;

        const height = 100 / Math.ceil(items.length / col);

        return (
            <div className={'responsive-grid'}>
                {
                    items.map((item) => (
                        React.cloneElement(item, {
                            style: {
                                maxWidth: `${percent}%`,
                                flex: `1 0 ${percent}%`,
                                height: `${height}%`,
                                maxHeight: `${height}%`
                            }
                        })
                    ))
                }
            </div>
        );
    }
}

ResponsiveGrid.propTypes = {
};

ResponsiveGrid.defaultProps = {
};

export class ResponsiveGridItem extends Component
{
    render()
    {
        return (
            <div
                className={'responsive-grid-item'}
                style={this.props.style}
            >
                {this.props.children}
            </div>
        );
    }
}
