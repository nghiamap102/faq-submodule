import './NavigationMenu.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PageTitle } from 'components/bases/Page/PageTitle';
import { T } from 'components/bases/Translate/Translate';

export class NavigationMenu extends Component
{
    handleChange = (menuId, event) =>
    {
        if (typeof this.props.onChange === 'function')
        {
            this.props.onChange(menuId, event);
        }
    };

    render()
    {
        const { header, menus } = this.props;

        return (
            <div className={'nav-container'}>
                {header && <PageTitle>{header}</PageTitle>}

                <ul className={`nav-menu ${this.props.type === 'vertical' ? '' : 'horizontal'}`}>
                    {
                        menus.map((m) => (
                            <MenuItem
                                key={m.id}
                                id={m.id}
                                active={this.props.activeMenu === m.id}
                                onClick={this.handleChange}
                            >
                                {m.name}
                            </MenuItem>
                        ),
                        )
                    }
                </ul>
            </div>
        );
    }
}

NavigationMenu.propTypes = {
    // className: PropTypes.string,
    header: PropTypes.string,
    menus: PropTypes.array,
    activeMenu: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
};

NavigationMenu.defaultProps = {
    menus: [],
    type: 'vertical',
};

export const MenuItem = ({ children, id, onClick, active }) =>
{
    const onMenuItemClick = (event) =>
    {
        onClick(id, event);
    };

    return (
        <li
            className={`menu-item ${active ? 'active' : ''}`}
            onClick={onMenuItemClick}
        >
            <T>{children}</T>
        </li>
    );
};

MenuItem.propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func,
};

MenuItem.defaultProps = {
    active: false,
};
