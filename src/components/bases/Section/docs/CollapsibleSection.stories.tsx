import { Meta, Story } from '@storybook/react';

import { CollapsibleSection } from '../CollapsibleSection';
import { CollapsibleSectionProps } from '../model';

export default {
    title: 'Layout/CollapsibleSection',
    parameters: {},
    args: {
        style: { backgroundColor: 'aqua' },
    },
    decorators: [(Story) => <div style={{ width: '100vw', height: '100vh' }}><Story /></div>],
} as Meta;

const Template: Story<CollapsibleSectionProps> = (args) =>
{
    return (
        <>
            {/* <CollapsibleSection>
                AA
            </CollapsibleSection>
            <CollapsibleSection header='Thông tin chi tiết'>
                BB
            </CollapsibleSection> */}
            <CollapsibleSection
                defaultExpanded={false}
                {...args}
            >
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCaaaaaaaCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCaaaaaaaCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCaaaaaaaCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
            </CollapsibleSection>
            <CollapsibleSection
                defaultExpanded={false}
                {...args}
            >
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCaaaaaaaCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCaaaaaaaCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCaaaaaaaCCCCCCCCCCCCCCCC
                CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
            </CollapsibleSection>
        </>
    );
};

export const Default = Template.bind({});
