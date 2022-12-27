import React from 'react';

import { Button } from '@vbd/vui';
import Menu, { MenuItem, MenuDivider } from 'extends/ffms/pages/base/Menu';

const Example = () =>
{
    return (

        <Menu
            trigger={<Button label={'Menu'} />}
            placement='bottom'
        >
            <MenuItem
                icon='clone'
                label='Setting'
            >
                <MenuItem
                    icon='clone'
                    label='Setting 1'
                    closeOnClick
                />
                <MenuItem
                    icon='clone'
                    label='Setting 2'
                    // onClick={() => console.log('ok')}
                />
                <MenuItem>
                    <input
                        type='text'
                        value=''
                    />
                </MenuItem>

            </MenuItem>
            <MenuDivider />


            <MenuItem
                icon='pencil'
                label='Rename'
            />
            <MenuDivider />
            <MenuItem
                icon='trash-alt'
                label='Delete'
            />
            <MenuItem
                icon='download'
                label='Download'
            />
        </Menu>
    );
};

export default Example;
