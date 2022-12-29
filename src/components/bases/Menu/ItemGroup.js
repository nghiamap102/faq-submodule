import './ItemGroup.scss';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Item } from 'components/bases/Menu/Item';
import { MenuContext } from 'components/bases/Menu/MenuContext';

export const ItemGroup = ({ className, children, title, id, control, ...itemProps }) =>
{
    const { menuMode } = useContext(MenuContext);

    const { getNodeById } = useContext(MenuContext);
    const nodeItem = getNodeById(id);

    const childrenWithProps = React.Children.map(children, (child, index) =>
    {
        if (React.isValidElement(child))
        {
            const id = nodeItem?.level + '-' + index;
            const parentMode = itemProps.parentMode?.includes('inline') ? 'sub-menu-inline' : 'sub-menu';
            const props = {
                parentMode,
                id: child.props.id ? child.props.id : id,
            };

            return React.cloneElement(child, props);
        }
        return child;
    });

    const props = {
        ...itemProps,
        mode: 'group-title',
        className: className + ' group-item-title',
        active: false,
        id,
    };

    return (
        <div className={'group-item-container'}>
            <Item {...props} >{control ? control : title.toString()}</Item>

            <div className={menuMode !== 'inline' ? 'group-horizontal-content' : ''}>
                {children && childrenWithProps}
            </div>
        </div>
    );
};

ItemGroup.propTypes = {
    control: PropTypes.element,
    className: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.element,
    onClick: PropTypes.func,
};

ItemGroup.defaultProps = {
    className: '',
    control: null,
    onClick: null,
};

