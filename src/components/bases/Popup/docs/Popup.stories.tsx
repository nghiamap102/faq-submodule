import { Meta, Story } from '@storybook/react';

import { Popup, PopupFooter, PopupProps } from '../Popup';
import CloseBlueIcon from 'images/icon/close_blue.png';
import CloseWhiteIcon from 'images/icon/close_white.png';
import { LazyLoadList } from '../../LazyLoadList/LazyLoadList';
import { EmptyButton, Button } from 'components/bases/Button/Button';
import { Row2 } from 'components/bases/Layout/Row';
import { TB1 } from 'components/bases/Text/Text';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Overlays/Popup',
    component: Popup,
} as Meta;

const items = [
    {
        'label': 'Item 1',
        'description': 'This is item 1',
        'icon': '',
    },
    {
        'label': 'Item 2',
        'description': 'This is item 2',
        'icon': CloseBlueIcon,
    },
    {
        'label': 'Item 3',
        'description': 'This is item 3',
        'icon': CloseWhiteIcon,
    },
    {
        'label': 'Item 1',
        'description': 'This is item 1',
        'icon': '',
    },
    {
        'label': 'Item 2',
        'description': 'This is item 2',
        'icon': CloseBlueIcon,
    },
    {
        'label': 'Item 3',
        'description': 'This is item 3',
        'icon': CloseWhiteIcon,
    },
    {
        'label': 'Item 1',
        'description': 'This is item 1',
        'icon': '',
    },
    {
        'label': 'Item 2',
        'description': 'This is item 2',
        'icon': CloseBlueIcon,
    },
    {
        'label': 'Item 3',
        'description': 'This is item 3',
        'icon': CloseWhiteIcon,
    },
];

const Template: Story<PopupProps> = (args) =>
{
    return (
        <Popup {...args}>
            <LazyLoadList
                items={items}
                titleField="label"
                subTitleField="description"
                iconUrlField="icon"
            />
            <PopupFooter>
                <Row2 justify='around'>
                    <Row2>
                        <TB1>Popup Footer</TB1>
                    </Row2>
                    <Row2 panel={false}>
                        <EmptyButton text={'Button'} />
                        <Button text={'Button'} />
                    </Row2>
                </Row2>
            </PopupFooter>
        </Popup>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: 'Popup Header',
    width: '500px',
    height: '400px',
    headerActions: [
        { icon: 'user', onClick: action('onClick') },
        { icon: 'cog', onClick: action('onClick') },
    ],
};
