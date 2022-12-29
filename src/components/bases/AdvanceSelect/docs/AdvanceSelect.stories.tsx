import { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { StoryDoc } from 'components/story/blocks';

import { AdvanceSelectProps, AdvanceSelect, AdvanceSelectOption, SearchModeProps } from '../AdvanceSelect';
import docs from './AdvanceSelect.docs.mdx';
import changelog from './AdvanceSelect.changelog.md';

export default {
    title: 'Inputs/AdvanceSelect',
    component: AdvanceSelect,
    argTypes: {
        onTextChange: {
            action: 'onTextChange',
        },
    },
    parameters: {
        changelog,
        docs: {
            inlineStories: false,
            iframeHeight: 150,
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Advance Select"
                    componentName="AdvanceSelect"
                    component={AdvanceSelect}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const options: AdvanceSelectOption[] = [
    { id: 'option_1', label: 'Option 1' },
    { id: 'option_2', label: 'Option 2', dropdownDisplay: 'Option 2', inputDisplay: 'option input display 2' },
    { id: 'option_3', label: 'Option 3', dropdownDisplay: 'Option 3', inputDisplay: 'option input display 3' },
];

const Template: Story<AdvanceSelectProps> = (args) =>
{
    const [value, setValue] = useState<string[] | string>([]);

    function onChangeEventHandler(newValue?: string | string[])
    {
        if (typeof newValue === 'undefined')
        {
            return;
        }
        setValue(newValue);
        (action('onChange'))(newValue);
    }

    return (
        <AdvanceSelect
            {...args}
            options={options}
            value={value}
            onChange={onChangeEventHandler}
        />
    );
};

export const Default = Template.bind({});
Default.args = {};

export const WithDividers = Template.bind({});
WithDividers.args = {
    hasDividers: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
};

export const Clearable = Template.bind({});
Clearable.args = {
    clearable: true,
};

export const Multiple = Template.bind({});
Multiple.args = {
    multi: true,
};

export const RemoteSearch: Story<AdvanceSelectProps & SearchModeProps> = (args) =>
{
    const [value, setValue] = useState<string[] | string>([]);
    const [remoteOptions, setRemoteOptions] = useState<AdvanceSelectOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const onRemoteFetch = (searchKey: string) =>
    {
        !!searchKey && setIsLoading(true);
        setTimeout(() =>
        {
            setRemoteOptions(options);
            setIsLoading(false);
        }, 10000);
    };

    function onChangeEventHandler(newValue?: string | string[])
    {
        if (typeof newValue === 'undefined')
        {
            return;
        }
        setValue(newValue);
        (action('onChange'))(newValue);
    }

    return (
        <AdvanceSelect
            {...args}
            options={remoteOptions}
            value={value}
            isLoading={isLoading}
            searchMode="remote"
            onChange={onChangeEventHandler}
            onRemoteFetch={onRemoteFetch}
        />
    );
};
