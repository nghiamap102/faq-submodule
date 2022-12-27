import './MenuButton.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, ScrollView } from '@vbd/vui';
import { EmptyButton } from '@vbd/vui';
import { EmptyData } from '@vbd/vui';

class MenuButton extends Component
{
    constructor(props)
    {
        super(props);

        const { text, icon, menu } = this.props;

        this.state = {
            text,
            icon,
            menu,
            isOpen: false,
            selectedItem: null,
        };

        this.headerRef = React.createRef();
    }

    componentDidUpdate()
    {
        const { isOpen } = this.state;

        setTimeout(() =>
        {
            if (isOpen)
            {
                window.addEventListener('click', this.onClose);
            }
            else
            {
                window.removeEventListener('click', this.onClose);
            }
        }, 0);
    }

    componentWillUnmount()
    {
        window.removeEventListener('click', this.onClose);
    }

    static getDerivedStateFromProps(nextProps, prevState)
    {
        const { menu } = nextProps;

        if (JSON.stringify(menu) !== JSON.stringify(prevState.menu))
        {
            return { menu };
        }

        return null;
    }

    onClose = () =>
    {
        this.setState({
            isOpen: false,
        });
    }

    handleMenuItemClick = (item) =>
    {
        const { icon, selectable, onMenuItemClick } = this.props;

        if (selectable)
        {
            this.setState({
                text: item.text || '',
                icon: item.icon || icon,
            });
        }

        this.setState({
            selectedItem: item,
            isOpen: false,
        });

        onMenuItemClick && onMenuItemClick(item);

    }
    
    toggleMenu = () =>
    {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    }

    renderMenuItems = () =>
    {
        const { iconVisible, iconLocation } = this.props;
        const { menu, selectedItem } = this.state;

        if (menu.length)
        {
            return (
                menu.map((item)=>(
                    <Button
                        className={cx('dd-menu-item', { 'w-icon': iconVisible, 'active': selectedItem ? selectedItem.id === item.id : !!item.active })}
                        key={item.id}
                        icon={iconVisible ? item.icon : ''}
                        iconLocation={iconLocation}
                        text={item.text || ''}
                        onClick={() => this.handleMenuItemClick(item)}
                    />
                ))
            );
        }
        return (
            <div className={'dd-menu-item no-result'}>
                <EmptyData />
            </div>
        );
    }

    getPosition = () =>
    {
        const { anchor, width } = this.props;
        const hRef = this.headerRef.current;
        if (anchor === 'left')
        {
            return { left: 0, top: hRef.offsetHeight + 3, width: width[1] };
        }
        if (anchor === 'right')
        {
            return { right: 0, top: hRef.offsetHeight + 3, width: width[1] };
        }
    }

    handleClick = () =>
    {
        this.props.onButtonClick && this.props.onButtonClick();
        this.toggleMenu();
    }

    render()
    {
        const { iconVisible, disabled, width, onlyIcon, splitButton, onButtonClick } = this.props;
        const { isOpen, text, icon } = this.state;

        let headerClassName = isOpen ? 'dd-menu-header focus' : 'dd-menu-header';
        if (onButtonClick)
        {
            headerClassName += ' both';
        }

        return (
            <div className={'dd-menu'}>
                <div
                    ref={this.headerRef}
                    className={headerClassName}
                    style={{ width: `${width[0]}` }}
                >
                    <Button
                        className={!iconVisible ? 'dd-menu-header-item' : 'dd-menu-header-item w-icon'}
                        text={text}
                        icon={iconVisible ? icon : ''}
                        disabled={disabled}
                        onlyIcon={onlyIcon}
                        onClick={this.handleClick}
                    />
                    {
                        splitButton ?
                            <EmptyButton
                                className={'dd-menu-header-action'}
                                icon={disabled ? 'ellipsis-h' : (isOpen ? 'chevron-up' : 'chevron-down')}
                                disabled={disabled}
                                onClick={this.toggleMenu}
                            /> :
                            <EmptyButton
                                className={'dd-menu-header-icon'}
                                icon={disabled ? 'ellipsis-h' : (isOpen ? 'chevron-up' : 'chevron-down')}
                                disabled={disabled}
                                onClick={this.handleClick}
                            />
                    }
                </div>

                {
                    isOpen &&
                    <div
                        className={'dd-menu-container'}
                        style={this.getPosition()}
                    >
                        <ScrollView>
                            <div className={'dd-menu-list'}>
                                {this.renderMenuItems()}
                            </div>
                        </ScrollView>
                    </div>
                }
            </div>
        );
    }
}


MenuButton.propTypes = {
    disabled: PropTypes.bool,
    iconVisible: PropTypes.bool,
    onlyIcon: PropTypes.bool,
    iconLocation: PropTypes.string,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        icon: PropTypes.string,
        badge: PropTypes.any, // TODO
    })).isRequired,
    selectable: PropTypes.bool,
    splitButton: PropTypes.bool,
    width: PropTypes.array, // width header and popup container
    anchor: PropTypes.string, // current left and right
    onMenuItemClick: PropTypes.func.isRequired,
    onButtonClick: PropTypes.func,
};

MenuButton.defaultProps = {
    disabled: false,
    iconVisible: false,
    iconLocation: 'left',
    text: '',
    icon: '',
    menu: [],
    width: ['auto', 'auto'],
    anchor: 'left',
    splitButton: true,
};

export default MenuButton;
