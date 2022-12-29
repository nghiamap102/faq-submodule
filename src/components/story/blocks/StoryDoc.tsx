import { Source, Props } from '@storybook/addon-docs/blocks';

import { StoryTabs, StoryTabsProps, DocHeader, DocHeaderProps } from 'components/story/UI';

export type StoryDocProps = {
    componentName?: string
    component?: React.ComponentType<any>
} & DocHeaderProps & Omit<StoryTabsProps, 'properties'>

export const StoryDoc = (props: StoryDocProps): JSX.Element =>
{
    const { name, status, component, description, componentName } = props;

    return (
        <div>
            <DocHeader
                name={name}
                status={status}
            />

            <Source
                language='js'
                code={`import { ${ componentName ?? component?.displayName} } from '@vbd/vui';`}
            />

            <StoryTabs
                properties={<Props of={component} />}
                description={description}
            />
        </div>
    );
};
