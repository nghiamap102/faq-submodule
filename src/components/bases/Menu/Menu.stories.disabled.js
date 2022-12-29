import './Menu.stories.scss';
import React, { useState } from 'react';
import Menu, { Item, SubMenu } from './Menu';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import FilterItem from 'extends/ffms/views/JobFilterView/FilterItem';
import { MenuItem } from './MenuItem';

export default {
    title: 'Bases/Menu',
    component: Menu,
    args: {
        style: { padding: '20px' , width: '500px' },

    },
};

const menuData = [
    {
        id: '0-1',
        title: 'Navigation One',
        icon: 'user',
        type: 'sub-item',
        onClick: (e)=>console.log(e),
        child: [
            {
                id: '1',
                title: 'Option 1',
                icon: 'bath',
                onClick: (e)=>console.log(e),
            },
            {
                id: '2',
                title: 'Option 2',
                icon: 'map',
            },
            {
                id: '3',
                title: 'Group 01',
                icon: 'bath',
                type: 'group-item',
                child: [
                    {
                        id: '4',
                        title: 'Option 3',
                        icon: 'bath',
                    },
                    {
                        id: '5',
                        title: 'Option 4',
                        icon: 'map',
                    },
                ] },
        ],
    },
    {
        id: '0-2',
        title: 'Navigation Two',
        icon: 'bath',
        type: 'sub-item',
        child: [
            {
                id: '2-1',
                title: 'Option 1',
                icon: 'bath',
            },
            {
                id: '2-2',
                title: 'Option 2',
                icon: 'map',
            },
        ],
    },
    {
        id: '0-3',
        title: 'Navigation Three',
        icon: 'map',
    },
];

const Template = (props) =>
{
    const [ids, setIds] = useState([]);

    const handleClick = (node) =>
    {
        setIds([...ids, node.id]);
    };

    return (
        <div>
            <Menu
                {...props}
                data ={menuData}
            >
                <MenuItem
                    title="Navigation One"
                    icon={'user'}
                    type={'sub-item'}
                >
                    <MenuItem onClick={(a)=> console.log(11111111,a)}>Option 1</MenuItem>
                    <MenuItem>Option 2</MenuItem>
                    <MenuItem>Option 3</MenuItem>
                    <MenuItem>Option 4</MenuItem>
                </MenuItem>
            </Menu>
        </div>
    );
};

const CustomControlTemplate = (props) =>
{
    console.log(props);
    const [ids, setIds] = useState([]);
    const team = [
        {
            id: 1,
            text: 'team A',
        },
        {
            id: 2,
            text: 'team B',
        },
    ];
    return (
        <div>
            <Menu
                {...props}
                // data ={menuData}
            >
                <SubMenu
                    offset={[8,0]}
                    id="sub1"
                    control={(
                        <FilterItem
                            title={'Đội'}
                            type={'tag'}
                            data={team}
                            style={{ flex: 1 }}
                        />
                    )}
                >
                    <Item
                        id="1"
                        onClick={(a)=> console.log(11111111,a)}
                    >Option 1
                    </Item>
                    <Item id="2"><CheckBox /></Item>
                    <Item id="3">Option 3</Item>
                    <Item id="4">Option 4</Item>
                </SubMenu>
            </Menu>
        </div>
    );
};


export const Default = Template.bind({});
Default.args = {
    // mode: 'horizontal',
    // defaultOpenIds: ['sub1'],
    // defaultSelectedIds: ['1','8'],
};

export const ExpandIcon = Template.bind({});
ExpandIcon.args = {
    mode: 'inline',
    defaultOpenIds: ['sub1'],
    defaultSelectedIds: ['1','8'],
    expandIcon: 'user',
    itemClassName: 'item-menu',
};

export const InlineCollapsed = Template.bind({});
InlineCollapsed.args = {
    mode: 'horizontal',
    defaultOpenIds: ['sub1'],
    inlineCollapsed: true,
    itemClassName: 'item-menu',
};

export const InlineIndent = Template.bind({});
InlineIndent.args = {
    mode: 'inline',
    defaultOpenIds: ['sub1'],
    inlineIndent: 16,
    itemClassName: 'item-menu',
};

export const openIds = Template.bind({});
openIds.args = {
    mode: 'inline',
    openIds: ['sub1'],
    itemClassName: 'item-menu',
};

export const SelectedIds = Template.bind({});
SelectedIds.args = {
    mode: 'inline',
    openIds: ['sub1'],
    selectedIds: ['1', '2'],
    itemClassName: 'item-menu',
};

export const OnClick = Template.bind({});
OnClick.args = {
    mode: 'inline',
    onClick: (node)=>console.log(node),
    itemClassName: 'item-menu',
};

export const OnSelect = Template.bind({});
OnSelect.args = {
    mode: 'inline',
    onSelect: (node)=>console.log(node),
    itemClassName: 'item-menu',
};

export const OnExpand = Template.bind({});
OnExpand.args = {
    mode: 'inline',
    onExpand: (node)=>console.log(node),
    itemClassName: 'item-menu',
};

export const ControlSubMenu = CustomControlTemplate.bind({});
ControlSubMenu.args = {

};


