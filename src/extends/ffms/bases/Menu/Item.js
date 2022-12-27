import './Item.scss';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { FAIcon, TB1 } from '@vbd/vui';
import { MenuContext } from './MenuContext';

const size = '14px';

export const Item = ({
    children,
    className,

    icon ,
    iconInfo,
    disabled,
    mode,
    id,
    onClick,
}) =>
{
    const { setActiveItem ,getNodeById, menuMode,inlineCollapsed, inlineIndent, expand, itemClassName } = useContext(MenuContext);
    const nodeItem = getNodeById(id);
    const isActive = !disabled && nodeItem && nodeItem?.checkingType !== 0 && mode !== 'group-title';

    const isInlineCollapsed = inlineCollapsed && nodeItem?.level === 0;

    const ItemIcon = (props) =>
    {
        if (!props.icon)
        {
            if (props.className !== 'item-icon-info' && isInlineCollapsed)
            {
                return <span className={props.className}>{children.charAt(0).toUpperCase()}</span>;
            }
            return null;
        }

        return <FAIcon {...props} />;
    };

    const handleClick = (e) =>
    {
        const node = getNodeById(id);

        if (node?.id)
        {
            if (node?.child?.length === 0)
            {
                setActiveItem(node, e);
            }
            else
            {
                expand(node, node?.expand ? false : true, e);
            }
        }

        onClick && onClick(node , e);
    };

    const renderSpecialChild = (children)=>
    {
        if (React.isValidElement(children))
        {
            return React.cloneElement(children, {
                id: id,
            });
        }
    };

    const renderDefaultChild = ()=>
    {
        return (
            <React.Fragment>
                <ItemIcon {...{ icon, size ,className: isInlineCollapsed ? 'item-icon-inline' : 'item-icon' }} />
                {
                    !isInlineCollapsed && (
                        <TB1
                            className={'item-text '}
                            style={{ fontSize: size }}
                        >
                            {children}
                        </TB1>
                    )}
                <ItemIcon {...{ icon: iconInfo, size ,className: 'item-icon-info' }} />
            </React.Fragment>
        );
    };

    // control subTitle active when on of child of sub active.
    // client can set active by ref Menu
    return (
        <div
            className={
                `item ${className} ${itemClassName} ${menuMode} ` +
                `${disabled ? 'disabled' : ''} ` +
                `${nodeItem?.expand ? 'expand' : ''} ` +
                `${isActive ? (nodeItem?.child?.length === 0 ? 'active-leaf' : 'active-root') : ''} ` +
                `${(iconInfo && typeof children === 'string') ? 'iconInfo' : ''}`
            }
            style={{
                ...isInlineCollapsed && { textAlign: 'center' },
                ...menuMode === 'inline' && { paddingLeft: inlineIndent * (nodeItem?.level + 1) },

            }}
            onClick={(!disabled) ? handleClick : undefined}
        >
            {
                typeof children === 'string' ? renderDefaultChild() : renderSpecialChild(children)
            }
        </div>
    );
};

Item.propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,

    className: PropTypes.string,
    iconInfo: PropTypes.string,
    icon: PropTypes.string,
    id: PropTypes.string,

    mode: PropTypes.oneOf(['menu-title', 'sub-title', 'group-title']),
    parentMode: PropTypes.oneOf(['menu-horizontal','menu-vertical','menu-inline','sub-menu','sub-menu-inline']),


    onClick: PropTypes.func,
    children: PropTypes.string.isRequired,
};

Item.defaultProps = {
    className: '',
    disabled: false,
    index: 0,
    active: false,
    id: '',
    onClick: ()=>
    {

    },
};

