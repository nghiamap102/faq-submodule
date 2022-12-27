
import React from 'react';
import Menu, { MenuItem } from 'extends/ffms/bases/Menu/Menu';
import { NavLink, useLocation } from 'react-router-dom';
import { T, FAIcon } from '@vbd/vui';

import * as Routers from 'extends/ffms/routes';

import { SVGIconPath } from 'extends/ffms/bases/IconSvg/SVGIcon';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';

const AppConfigMenu = (props) =>
{

    const [activeId, setActiveId] = React.useState();
    const location = useLocation();
    const { pathPermission } = usePermission();


    React.useEffect(() =>
    {
        const path = location.pathname.replace(Routers.APP_CONFIG,'');
        const feature = path.split('/')[1];
        if (feature && pathPermission?.CanView)
        {
            const menuId = Routers.APP_CONFIG + '/' + feature;
            setActiveId(menuId);
        }
    },[location.pathname, pathPermission]);

    // if(not childrend)
    const cloneData = (data, level = 0) =>
    {
        if (!data || data?.length === 0)
        {
            return null;
        }

        const renderChild = (item, level) =>
        {
            return (
                item.child?.length > 0 ?
                    cloneData(item.child, level = level + 1) :
                    <></>
            );
        };

        const renderControl = (item) =>
        {
            return (
                <NavLink
                    to={item.path}
                    activeClassName='menu-activate'
                    className='menu-link-item'
                    disabled
                >
                    {
                        item.iconType === 'svg' ?
                            (
                                <SVGIconPath
                                    className={'svg-icon--xsmall'}
                                    name={item.icon}
                                    fill={'var(--text-color)'}
                                />
                            ) :
                            (
                                <FAIcon
                                    className={'nav-icon'}
                                    icon={item.icon}
                                    type={'light'}
                                    size={'1.25rem'}
                                    color={'var(--text-color)'}
                                />
                            )
                    }
             
                    <T>{item.title}</T>
                </NavLink>
            );
        };
  
        return data.map((item, index) =>
        {
            item.type = item.type || 'item';
            return (
                <MenuItem {...item} key={item?.id} >
                    {
                        ['sub-item', 'group-item'].includes(item?.type) ?
                            renderChild(item) : renderControl(item)
                    }
                </MenuItem>
            );
        });
    };

    if (!activeId)
    {
        return null;
    }

    return (
        
        <Menu itemClassName={'item-menu'} defaultSelectedIds={[activeId]}>
            {cloneData(props.menu)}
        </Menu>
    );
};

export default AppConfigMenu;
