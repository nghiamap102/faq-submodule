import './Item.scss';

import React, { useContext, useEffect } from 'react';
import PropTypes, { oneOf } from 'prop-types';

import { SubMenu, ItemGroup, Item } from './Menu';


export const MenuItem = ({ type, children, ...props }) =>
{
    switch (type)
    {
        case 'item': return <Item {...props} >{children}</Item>;
        case 'sub-item': return <SubMenu {...props} >{children}</SubMenu>;
        case 'group-item': return <ItemGroup{...props} >{children}</ItemGroup>;
        default: return <></>;
    }
};

MenuItem.propTypes = {
    type: oneOf(['item', 'sub-item', 'group-item']),
};

MenuItem.defaultProps = {
    type: 'item',
};
