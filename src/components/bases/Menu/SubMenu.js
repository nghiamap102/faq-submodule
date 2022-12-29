import './SubMenu.scss';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ControlOver from 'components/bases/Control/ControlOver';
import { Item } from 'components/bases/Menu/Item';
import ControlToggle from 'components/bases/Control/ControlToggle';
import { MenuContext } from 'components/bases/Menu/MenuContext';

export const SubMenu = ({ id, children, offset, title, popupClassName, control, ...itemProps }) =>
{
    const { getNodeById, menuMode, expand, expandIcon } = useContext(MenuContext);
    const nodeItem = getNodeById(id);

    const getAnchor = (parentMode) =>
    {
        if (parentMode === 'menu-horizontal')
        {
            return 'bottom';
        }
        else
        {
            return 'right';
        }
    };

    const getOffset = (parentMode) =>
    {
        const [x, y] = offset;
        if (!x && !y && parentMode === 'sub-menu')
        {
            return [4,0];
        }
        else
        {
            return offset;
        }
    };

    const getIconInfo = (parentMode) =>
    {
        if (expandIcon)
        {
            if (menuMode === 'horizontal' && nodeItem?.level === 0)
            {
                return;
            }
            return expandIcon;
        }

        if (parentMode?.includes('inline'))
        {
            return nodeItem?.expand ? 'angle-up' : 'angle-down';
        }
        else if (parentMode !== 'menu-horizontal')
        {
            return 'angle-right';
        }

        return null;
    };

    const handleBackgroundClick = ()=>
    {
        expand(nodeItem, !nodeItem.expand);
    };


    const renderControl = ()=>
    {
        const props = { ...itemProps, id };

        return (
            <Item
                {...props}
                id={id}
                iconInfo={getIconInfo(props?.parentMode)}
                onClick={props.onClick}
            >
                {control ? control : title}
            </Item>
        );
    };

    const childrenWithProps = React.Children.map(children, (child, index) =>
    {
        if (React.isValidElement(child))
        {
            const id = nodeItem?.level + 1 + '-' + index;
            const parentMode = itemProps.parentMode?.includes('inline') ? 'sub-menu-inline' : 'sub-menu';
            const props = {
                parentMode,
                id: child.props.id ? child.props.id : id,
            };

            return React.cloneElement(child, props);
        }
        else
        {
            return child;
        }
    });

    return (
        <React.Fragment>
            {
                !itemProps.parentMode?.includes('inline') ?
                    (
                        <ControlOver
                            className={popupClassName}
                            visible={!itemProps.disabled && nodeItem?.expand}
                            control={renderControl()}
                            anchor={getAnchor(itemProps.parentMode)}
                            offset={getOffset(itemProps.parentMode)}
                            onBackgroundClick={handleBackgroundClick}
                        >
                            <div className={'sub-menu-content ' + itemProps.parentMode}>
                                {children && childrenWithProps}
                            </div>
                        </ControlOver>
                    ) :
                    (
                        <ControlToggle
                            visible={!itemProps.disabled && nodeItem?.expand}
                            control={renderControl()}
                            className={popupClassName}
                        >
                            <div className={'sub-menu-content ' + itemProps.parentMode}>
                                {children && childrenWithProps}
                            </div>
                        </ControlToggle>
                    )
            }
        </React.Fragment>
    );
};

SubMenu.propTypes = {
    control: PropTypes.element,
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,

    disabled: PropTypes.bool,

    anchor: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    offset: PropTypes.array,

    onClick: PropTypes.func,
};

SubMenu.defaultProps = {
    control: null,
    offset: [0,0],
    className: '',
    popupClassName: '',
    title: '',
    id: '',
    disabled: false,
    onClick: null,
};
