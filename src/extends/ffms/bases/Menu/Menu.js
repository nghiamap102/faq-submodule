import './Menu.scss';
import React from 'react';

import PropTypes from 'prop-types';

import { Row, Column } from '@vbd/vui';
import { MenuProvider } from './MenuContext';
import { MenuItem } from './MenuItem';


const MenuContent = ({ mode, elements, className, style }) =>
{

    // custom children before parse (active, level, mode)
    const childrenWithProps = React.Children.map(elements,(child, index) =>
    {
        if (React.isValidElement(child))
        {
            const id = 0 + '-' + index;

            return React.cloneElement(child, {
                parentMode: 'menu-' + mode,
                id: child.props?.id ? child.props.id : id,
            });
        }
    });

    return (
        <div
            className={className}
            style={style}
        >
            {
                (mode === 'vertical' || mode === 'inline') && (
                    <Column className={'menu-layout vertical'}>
                        {elements && childrenWithProps }
                    </Column>
                )}
            {
                (mode === 'horizontal') && (
                    <Row className={'menu-layout  horizontal'}>
                        {elements && childrenWithProps }
                    </Row>
                )}
        </div>
    );
};


const Menu = (props)=>
{
    // if(not children)
    const cloneData = (data, level = 0) =>
    {
        if (!data || data?.length === 0)
        {
            return null;
        }

        return data.map((item, index) =>
        {
            item.type = item.type || 'item';
            return (
                <MenuItem
                    {...item}
                    key={item?.id}
                >
                    {
                        (item.child?.length > 0 && item.type !== 'item')
                            ? cloneData(item.child, level = level + 1)
                            : item.title
                    }
                </MenuItem>
            );
        });
    };

    const elements = (!props?.data || props?.data?.length === 0) ? props?.children : cloneData(props.data);
    return (
        <MenuProvider
            {...props}
            elements={elements}
        >
            <MenuContent
                {...props}
                elements={elements}
            />
        </MenuProvider>
    );

};

Menu.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    style: PropTypes.object,
    inlineIndent: PropTypes.number,

    mode: PropTypes.oneOf(['vertical' , 'horizontal', 'inline' ]).isRequired,
    defaultOpenIds: PropTypes.array,
    defaultSelectedIds: PropTypes.array,
    openIds: PropTypes.array,
    selectedIds: PropTypes.array,

    multiple: PropTypes.bool,
    selectable: PropTypes.bool,
    inlineCollapsed: PropTypes.bool,
    defaultSelectedAll: PropTypes.bool,
    defaultOpenAll: PropTypes.bool,

    expandIcon: PropTypes.element,

    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onExpand: PropTypes.func,
};

Menu.defaultProps = {
    data: [],
    className: '',
    itemClassName: '',
    mode: 'vertical',

    inlineIndent: 24,

    defaultOpenIds: [],
    defaultSelectedIds: [],

    openIds: [],
    selectedIds: [],

    multiple: false,
    selectable: true, // disabled check or not
    inlineCollapsed: false,
    defaultSelectedAll: false,
    defaultOpenAll: false,

    onClick: null,
    onSelect: null,
    onExpand: null,
};


export default Menu;
export { Item } from 'extends/ffms/bases/Menu/Item';
export { SubMenu } from 'extends/ffms/bases/Menu/SubMenu';
export { ItemGroup } from 'extends/ffms/bases/Menu/ItemGroup';
export { MenuItem } from 'extends/ffms/bases/Menu/MenuItem';
